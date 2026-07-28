'use client';
/* eslint-disable react/no-unescaped-entities */

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageSquare, Heart, MoreHorizontal,
  Plus, Search, Send, X, ChevronDown, LogIn, User
} from 'lucide-react';
import { 
  createPost, 
  getPosts, 
  likePost, 
  getComments, 
  addComment, 
  hasLiked,
  loginWithGoogle,
  logout
} from '@/lib/firebase';

// Category definitions
const CATEGORIES = ['daily', 'question', 'experience', 'learning'] as const;
type Category = typeof CATEGORIES[number];

const CATEGORY_COLORS: Record<Category, string> = {
  daily: 'bg-gray-100 text-gray-700',
  question: 'bg-gray-500/20 text-gray-700',
  experience: 'bg-gray-100 text-gray-700',
  learning: 'bg-gray-100 text-gray-700'};

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

// Translations
const TRANSLATIONS: Record<string, Record<string, string>> = {
  zh: {
    title: '占星社区',
    subtitle: '与志同道合的占星爱好者交流',
    loginPrompt: '请先登录',
    loginDesc: '登录后即可参与社区讨论、发布帖子',
    loginWithGoogle: '使用 Google 登录',
    logout: '退出登录',
    newPost: '发布新帖',
    search: '搜索话题...',
    writeSomething: '分享你的占星心得...',
    selectCategory: '选择分类',
    daily: '日常',
    question: '问题',
    experience: '经验',
    learning: '学习',
    zodiacTag: '星座标签（可选）',
    post: '发布',
    cancel: '取消',
    loading: '加载中...',
    noPosts: '暂无帖子',
    beFirst: '成为第一个发帖的人吧！',
    showMore: '展开全文',
    showLess: '收起',
    likes: '赞',
    comments: '评论',
    comment: '评论...',
    submitComment: '发送',
    viewComments: '查看评论',
    hideComments: '隐藏评论',
    by: 'by',
    unknown: '匿名'},
  en: {
    title: 'Astrology Community',
    subtitle: 'Connect with fellow astrology enthusiasts',
    loginPrompt: 'Please Login',
    loginDesc: 'Login to join discussions and post',
    loginWithGoogle: 'Login with Google',
    logout: 'Logout',
    newPost: 'New Post',
    search: 'Search topics...',
    writeSomething: 'Share your astrology insights...',
    selectCategory: 'Select Category',
    daily: 'Daily',
    question: 'Question',
    experience: 'Experience',
    learning: 'Learning',
    zodiacTag: 'Zodiac Tag (Optional)',
    post: 'Post',
    cancel: 'Cancel',
    loading: 'Loading...',
    noPosts: 'No posts yet',
    beFirst: 'Be the first to post!',
    showMore: 'Show More',
    showLess: 'Show Less',
    likes: 'likes',
    comments: 'comments',
    comment: 'Comment...',
    submitComment: 'Send',
    viewComments: 'View Comments',
    hideComments: 'Hide Comments',
    by: 'by',
    unknown: 'Anonymous'},
  id: {
    title: 'Komunitas Astrologi',
    subtitle: 'Terhubung dengan penggemar astrologi',
    loginPrompt: 'Silakan Login',
    loginDesc: 'Login untuk bergabung dalam diskusi',
    loginWithGoogle: 'Login dengan Google',
    logout: 'Keluar',
    newPost: 'Posting Baru',
    search: 'Cari topik...',
    writeSomething: 'Bagikan wawasan astrologi Anda...',
    selectCategory: 'Pilih Kategori',
    daily: 'Harian',
    question: 'Pertanyaan',
    experience: 'Pengalaman',
    learning: 'Pembelajaran',
    zodiacTag: 'Tag Zodiak (Opsional)',
    post: 'Posting',
    cancel: 'Batal',
    loading: 'Memuat...',
    noPosts: 'Belum ada posting',
    beFirst: 'Jadilah yang pertama memposting!',
    showMore: 'Tampilkan Lainnya',
    showLess: 'Sembunyikan',
    likes: 'suka',
    comments: 'komentar',
    comment: 'Komentar...',
    submitComment: 'Kirim',
    viewComments: 'Lihat Komentar',
    hideComments: 'Sembunyikan Komentar',
    by: 'oleh',
    unknown: 'Anonim'}};

interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  content: string;
  contentEn?: string;
  category: Category;
  zodiacTag?: string;
  likesCount: number;
  commentsCount: number;
  createdAt: any;
  isLiked?: boolean;
}

interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  content: string;
  createdAt: any;
}

export default function CommunityPage() {
  const { user, loginWithGoogle: authLoginWithGoogle, logout: authLogout, isLoading } = useAuth();
  const { language } = useLanguage();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<Category>('daily');
  const [newPostZodiac, setNewPostZodiac] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [translatedPosts, setTranslatedPosts] = useState<Record<string, string>>({});
  const [translatingPost, setTranslatingPost] = useState<Record<string, boolean>>({});
  const [showTranslateFor, setShowTranslateFor] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComments, setNewComments] = useState<Record<string, string>>({});
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  // Load posts
  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedPosts = await getPosts(20);
      // Merge with seed posts so community always has content
      const seed: (Post & {contentEn: string})[] = [
        { id:"seed-1",authorId:"sys",authorName:"星辰大海 / StarSea",content:"用了星缘三个月了，八字日主是甲木——终于理解为什么我总是在工作上冲在最前面。有没有同是甲木的朋友？你们也这样吗？",contentEn:"Three months on lunaxstar and my Day Master is Yang Wood (甲). Finally understand why I'm always charging ahead at work. Any other Yang Wood folks out there? Same energy?",category:"experience",zodiacTag:"Aries",likesCount:24,commentsCount:8,createdAt:new Date("2026-07-15")},
        { id:"seed-2",authorId:"sys",authorName:"Luna星语",content:"今天用奇门遁甲选了个签合同的日期，生门刚好对着我的方向。下午签约顺利得不像话。以前不信这些，现在服了。",contentEn:"Used Qi Men Dun Jia to pick a contract signing date today. Life Gate aligned with my direction. The signing went impossibly smooth. I used to be skeptical. Not anymore.",category:"experience",likesCount:18,commentsCount:5,createdAt:new Date("2026-07-16")},
        { id:"seed-3",authorId:"sys",authorName:"命运的节奏",content:"有没有人2026年也感觉节奏特别快？查了八字发现今年是丙午火马年，双火叠加。每天跟打了鸡血一样，但也特别容易burnout。大家怎么调节的？",contentEn:"Anyone else feel like 2026 is on fast-forward? Checked my BaZi — it's Bing Wu (Fire Horse), double Fire year. Every day feels turbocharged but burnout comes fast. How are you all managing?",category:"question",likesCount:31,commentsCount:12,createdAt:new Date("2026-07-17")},
        { id:"seed-4",authorId:"sys",authorName:"风之占星师",content:"分享一个小技巧：在新月设意向比在满月做释放更有效。我连续做了三个新月仪式，每个月都能感受到微小的变化在积累。推荐大家都试试。",contentEn:"Pro tip: setting intentions at the New Moon works better than releasing at the Full Moon. I've done 3 New Moon rituals in a row and feel the subtle shifts compounding each month. Highly recommend.",category:"learning",likesCount:15,commentsCount:4,createdAt:new Date("2026-07-14")},
        { id:"seed-5",authorId:"sys",authorName:"Leo的火",content:"作为狮子座+丙火日主，我一直在学怎么不burn周围的人。最近发现的秘诀：运动。每天把火撒在跑步机上，回家就是一只温顺的猫。",contentEn:"Leo Sun + Yang Fire Day Master here. My lifelong struggle: not burning everyone around me. Recent discovery: exercise. Pour the fire onto the treadmill and come home a gentle cat.",category:"daily",zodiacTag:"Leo",likesCount:22,commentsCount:7,createdAt:new Date("2026-07-16")},
        { id:"seed-6",authorId:"sys",authorName:"星空下的思考者",content:"西方占星说我是双鱼，八字说我是癸水。奇怪的是两边说的性格竟然高度重合——敏感、直觉强、容易吸收别人的情绪。有人也两边都查过吗？",contentEn:"Western astrology says I'm Pisces. BaZi says I'm Yin Water (癸). Weirdly both describe me the same way — sensitive, intuitive, absorbing everyone's emotions. Anyone else checked both systems?",category:"question",likesCount:12,commentsCount:6,createdAt:new Date("2026-07-15")},
        { id:"seed-7",authorId:"sys",authorName:"风水行者",content:"我用 lunaxstar 的生日本命盘给全家人排了一遍。老婆的上升星座竟然是天蝎——终于理解为什么她第一印象总是让人感觉神秘了。占星真的是家庭关系的解码器。",contentEn:"Ran birth charts for my whole family on lunaxstar. My wife's Rising sign is Scorpio — suddenly I understand why her first impression always feels mysterious. Astrology is the decoder ring for family dynamics.",category:"experience",likesCount:27,commentsCount:9,createdAt:new Date("2026-07-18")},
        { id:"seed-8",authorId:"sys",authorName:"易学小学生",content:"提问：大运切换到下一个十年的时候，大家能感觉到明显的变化吗？我还有两年就要换了，想知道过来人的体验。",contentEn:"Question: when your Luck Cycle switches to the next decade, can you actually feel it? I've got 2 years left in mine and want to hear from people who've been through it.",category:"question",likesCount:9,commentsCount:11,createdAt:new Date("2026-07-17")},
        { id:"seed-9",authorId:"sys",authorName:"茶与星盘",content:"每日运势说我今天不适合做重大决定。我偏不信——结果在淘宝上冲动下单了三件根本不需要的东西。行吧，宇宙，你赢了。",contentEn:"Daily horoscope said no major decisions today. I defied it — impulse-bought 3 things on Taobao I absolutely don't need. Fine, universe. You win.",category:"daily",likesCount:34,commentsCount:6,createdAt:new Date("2026-07-18")},
        { id:"seed-10",authorId:"sys",authorName:"八字自习室",content:"最近在学十神。有个问题想请教各位：正财和偏财在实际生活中怎么区分？我的盘里两个都有，但感觉不明显。",contentEn:"Learning the Ten Gods lately. Question: how do you distinguish Direct Wealth from Indirect Wealth in real life? My chart has both but I can't see the difference clearly.",category:"learning",likesCount:8,commentsCount:14,createdAt:new Date("2026-07-14")},
        { id:"seed-11",authorId:"sys",authorName:"NorthStar",content:"I just discovered my Day Master is Yang Water (壬). It explains why I need so much alone time — water people need depth, not crowds. Anyone else feel this?",contentEn:"I just discovered my Day Master is Yang Water (壬). It explains why I need so much alone time — water people need depth, not crowds. Anyone else feel this?",category:"experience",likesCount:19,commentsCount:7,createdAt:new Date("2026-07-16")},
        { id:"seed-12",authorId:"sys",authorName:"月相追踪者",content:"今天的月亮进天蝎了——情绪深得像海。但这也是最适合做内在清理的时候。关掉手机，点支蜡烛，写下你心里积压的东西。天蝎月亮给你力量去释放。",contentEn:"Moon just entered Scorpio — emotions deep as the ocean. But it's also the perfect time for inner cleansing. Turn off your phone, light a candle, write down what you've been holding. Scorpio Moon gives you the power to release.",category:"daily",likesCount:16,commentsCount:3,createdAt:new Date("2026-07-19")},
        { id:"seed-13",authorId:"sys",authorName:"命运解码师",content:"分享一个真实客户案例（已授权）：客户一直以为自己是'事业不顺'——直到查了大运发现她在印运里。本来这十年就该学习充电，不是冲刺。知道之后心态完全变了。这就是命盘的力量。",contentEn:"Real client story (shared with permission): She thought her career was failing — until we found she's in a Resource Luck Cycle. This decade was meant for learning, not earning. Her entire mindset shifted. That's the power of a birth chart.",category:"experience",likesCount:41,commentsCount:15,createdAt:new Date("2026-07-13")},
        { id:"seed-14",authorId:"sys",authorName:"星缘的忠实用户",content:"用了半个月 lunaxstar，最惊喜的是奇门遁甲排盘功能。太准了——选了一天去谈加薪，生门正好对着我的方向。结果老板主动提了薪资调整。不骗你们。",contentEn:"Been using lunaxstar for 2 weeks. Most surprising find: the Qi Men Dun Jia calculator. Picked a day to negotiate a raise — Life Gate aligned with my direction. Boss brought up the salary adjustment first. Not kidding.",category:"experience",likesCount:25,commentsCount:8,createdAt:new Date("2026-07-17")},
        { id:"seed-15",authorId:"sys",authorName:"禅与占星",content:"有没有人觉得满月的晚上特别难入睡？我已经连续三个满月失眠了。查了星盘才发现我月亮在巨蟹——满月的时候月亮能量最强，巨蟹月亮当然受不了。",contentEn:"Does anyone else struggle to sleep on Full Moon nights? Three Full Moons in a row I've been wide awake. Checked my chart — Moon in Cancer. The Moon's energy peaks at Full Moon and Cancer Moon just can't take it.",category:"question",likesCount:13,commentsCount:5,createdAt:new Date("2026-07-16")},
      ];
      const allPosts = [...seed, ...(fetchedPosts as Post[])];
      setPosts(allPosts);
      
      // Check liked status for each post
      if (user) {
        const postIds = fetchedPosts.map((p: any) => p.id);
        const likedSet = new Set<string>();
        for (const postId of postIds) {
          const liked = await hasLiked(postId, user.uid);
          if (liked) likedSet.add(postId);
        }
        setLikedPosts(likedSet);
      }
    } catch (err) {
      console.error('Load posts error:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleLogin = async () => {
    try {
      await authLoginWithGoogle(language);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await authLogout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handlePost = async () => {
    if (!newPostContent.trim() || !user) return;
    
    try {
      await createPost(
        user.uid,
        user.displayName || t.unknown,
        user.photoURL,
        newPostContent,
        newPostCategory,
        newPostZodiac || undefined
      );
      
      setNewPostContent('');
      setNewPostZodiac('');
      setShowNewPost(false);
      loadPosts(); // Reload feed
    } catch (err) {
      console.error('Create post error:', err);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) return;
    
    try {
      await likePost(postId, user.uid);
      setLikedPosts(prev => {
        const next = new Set(prev);
        if (next.has(postId)) {
          next.delete(postId);
        } else {
          next.add(postId);
        }
        return next;
      });
      
      // Update post likes count
      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, likesCount: likedPosts.has(postId) ? p.likesCount - 1 : p.likesCount + 1 }
          : p
      ));
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const toggleComments = async (postId: string) => {
    const isExpanded = expandedComments[postId];
    
    if (!isExpanded && !comments[postId]) {
      // Load comments
      try {
        const fetchedComments = await getComments(postId);
        setComments(prev => ({ ...prev, [postId]: fetchedComments as Comment[] }));
      } catch (err) {
        console.error('Load comments error:', err);
      }
    }
    
    setExpandedComments(prev => ({ ...prev, [postId]: !isExpanded }));
  };

  const handleAddComment = async (postId: string) => {
    if (!user || !newComments[postId]?.trim()) return;
    
    try {
      await addComment(
        postId,
        user.uid,
        user.displayName || t.unknown,
        user.photoURL,
        newComments[postId]
      );
      
      setNewComments(prev => ({ ...prev, [postId]: '' }));
      
      // Reload comments
      const fetchedComments = await getComments(postId);
      setComments(prev => ({ ...prev, [postId]: fetchedComments as Comment[] }));
      
      // Update comment count
      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, commentsCount: p.commentsCount + 1 }
          : p
      ));
    } catch (err) {
      console.error('Add comment error:', err);
    }
  };

  const handleTranslate = async (postId: string, targetLang: string) => {
    setShowTranslateFor(null);
    const key = `${postId}_${targetLang}`;
    if (translatedPosts[key] || translatingPost[key]) return;
    
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    const sourceText = (post as any).contentEn && language === 'en' ? (post as any).contentEn : post.content;
    
    setTranslatingPost(prev => ({ ...prev, [key]: true }));
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: sourceText, targetLang }),
      });
      const data = await res.json();
      if (data.translated) {
        setTranslatedPosts(prev => ({ ...prev, [key]: data.translated }));
      }
    } catch (e) {
      // silently fail
    }
    setTranslatingPost(prev => ({ ...prev, [key]: false }));
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return language === 'zh' ? '刚刚' : 'Just now';
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  // Filter posts by search
  const filteredPosts = searchQuery 
    ? posts.filter(p => 
        p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.zodiacTag && p.zodiacTag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : posts;

  // If loading auth state, show spinner (not login prompt)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-400 text-sm">加载中...</div>
      </div>
    );
  }

  // If not logged in, show login prompt with preview
  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          {/* Preview content behind semi-transparent overlay */}
          <div className="relative mb-12 opacity-30 pointer-events-none select-none">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">{t.title}</h2>
              <div className="flex gap-2">
                {CATEGORIES.map(c => (
                  <span key={c} className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">{(t as any)[c] || c}</span>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {[
                { author: language==='zh'?'星友小王':language==='id'?'Teman Bintang':language==='th'?'เพื่อนดวงดาว':language==='vi'?'Bạn Sao':language==='ms'?'Rakan Bintang':language==='ja'?'星友・王':'Star Friend', catKey:'daily', contentKey:'post1' },
                { author: language==='zh'?'占星学习者':language==='id'?'Pelajar Astrologi':language==='th'?'นักเรียนโหราศาสตร์':language==='vi'?'Người Học':language==='ms'?'Pelajar':language==='ja'?'占星学習者':'Astro Learner', catKey:'question', contentKey:'post2' },
                { author: language==='zh'?'星座达人':language==='id'?'Ahli Zodiak':language==='th'?'เซียนราศี':language==='vi'?'Chuyên Gia':language==='ms'?'Pakar':language==='ja'?'星座マスター':'Zodiac Expert', catKey:'experience', contentKey:'post3' },
              ].map((post, i) => {
                const posts: Record<string, Record<string, string>> = {
                  post1: { zh:'今天看了日返盘，发现明年木星进第一宫，太期待了！有同样配置的朋友吗？', en:'Just checked my solar return — Jupiter entering 1st house next year! Anyone else have this placement?', id:'Baru cek solar return, Jupiter masuk rumah pertama tahun depan! Ada yang sama?', th:'เพิ่งดู solar return ดาวพฤหัสเข้าบ้านแรกปีหน้า! มีใครเหมือนกันไหม?', vi:'Vừa xem solar return, sao Mộc vào nhà 1 năm sau! Có ai giống không?', ms:'Baru lihat solar return, Jupiter masuk rumah pertama tahun depan! Ada yang sama?', ja:'ソーラーリターンをチェックしたら来年木星が第一ハウスに！同じ配置の人いますか？', ko:'솔라 리턴 봤는데 내년에 목성이 1하우스에 들어와요! 같은 배치 있나요?' },
                  post2: { zh:'请问各位大神，月亮空亡（VoC Moon）期间适合做什么？不适合做什么？', en:'What should I do during VoC Moon? What should I avoid?', id:'Apa yang harus dilakukan saat VoC Moon? Apa yang harus dihindari?', th:'ช่วง VoC Moon ควรทำอะไร? ควรหลีกเลี่ยงอะไร?', vi:'Nên làm gì khi Mặt Trăng trống? Nên tránh gì?', ms:'Apa yang patut dibuat semasa VoC Moon? Apa yang perlu dielak?', ja:'VoCムーンの間、何をすべき？何を避けるべき？', ko:'보이드 문 기간에 뭘 해야 하고 뭘 피해야 하나요?' },
                  post3: { zh:'分享一个看事业宫的小技巧：重点看10宫主星和MC的相位关系，比单纯看10宫内行星更准。', en:'Career tip: focus on the aspects between 10H ruler and MC — way more accurate than just looking at planets in the 10th.', id:'Tip karir: fokus pada aspek antara penguasa rumah 10 dan MC — lebih akurat daripada hanya lihat planet di rumah 10.', th:'เคล็ดลับอาชีพ: ดูมุมระหว่างเจ้าเรือน 10 กับ MC — แม่นกว่าดูแต่ดาวในเรือน 10', vi:'Mẹo sự nghiệp: tập trung vào góc chiếu giữa chủ tinh nhà 10 và MC — chính xác hơn là chỉ nhìn hành tinh trong nhà 10.', ms:'Tip kerjaya: fokus pada aspek antara penguasa rumah 10 dan MC — lebih tepat daripada hanya lihat planet di rumah 10.', ja:'キャリアのコツ：10ハウスルーラーとMCのアスペクトに注目すれば、10ハウスの惑星だけ見るよりずっと正確です。', ko:'커리어 팁: 10하우스 주인과 MC의 각도를 보세요 — 10하우스 행성만 보는 것보다 훨씬 정확해요.' },
                };
                const catNames: Record<string, Record<string, string>> = {
                  daily: { zh:'日常', en:'Daily', id:'Harian', th:'ทั่วไป', vi:'Hàng ngày', ms:'Harian', ja:'日常', ko:'일상' },
                  question: { zh:'提问', en:'Question', id:'Pertanyaan', th:'คำถาม', vi:'Câu hỏi', ms:'Soalan', ja:'質問', ko:'질문' },
                  experience: { zh:'经验', en:'Experience', id:'Pengalaman', th:'ประสบการณ์', vi:'Kinh nghiệm', ms:'Pengalaman', ja:'経験', ko:'경험' },
                  learning: { zh:'学习', en:'Learning', id:'Belajar', th:'เรียนรู้', vi:'Học tập', ms:'Pembelajaran', ja:'学習', ko:'학습' },
                };
                return (
                <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium">{post.author}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{(catNames as any)[post.catKey]?.[language] || post.catKey}</span>
                  </div>
                  <p className="text-sm mb-2">{(posts as any)[post.contentKey]?.[language] || ''}</p>
                  <div className="flex gap-4 text-xs text-gray-400">
                    <span>❤ {i===0?12:i===1?8:24}</span>
                    <span>💬 {i===0?5:i===1?15:9}</span>
                  </div>
                </div>
              )})}
            </div>
          </div>

          {/* Login CTA */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">{t.loginPrompt}</h2>
            <p className="text-gray-500 mb-8">{t.loginDesc}</p>
            <button
              onClick={handleLogin}
              className="inline-flex items-center gap-3 px-8 py-3 bg-[#171717] text-white rounded-lg font-medium hover:bg-black transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/>
                <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.695 24 12.255 24z"/>
                <path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z"/>
                <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.56 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/>
              </svg>
              {t.loginWithGoogle}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Search & New Post */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.search}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:border-gray-500/50 focus:outline-none"
            />
          </div>
          <button
            onClick={() => setShowNewPost(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-600 rounded-xl text-gray-900 font-medium hover:from-gray-500 hover:to-gray-500 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">{t.newPost}</span>
          </button>
        </div>

        {/* New Post Modal */}
        {showNewPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-[#f9fafb] rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{t.newPost}</h3>
                <button
                  onClick={() => { setShowNewPost(false); setNewPostContent(''); setNewPostZodiac(''); }}
                  className="text-gray-400 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Category Selector */}
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">{t.selectCategory}</label>
                <div className="flex gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setNewPostCategory(cat)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        newPostCategory === cat
                          ? CATEGORY_COLORS[cat]
                          : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                      }`}
                    >
                      {t[cat]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Zodiac Tag */}
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">{t.zodiacTag}</label>
                <select
                  value={newPostZodiac}
                  onChange={(e) => setNewPostZodiac(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:border-gray-500/50 focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="">{t.zodiacTag}</option>
                  {ZODIAC_SIGNS.map(sign => (
                    <option key={sign} value={sign}>{sign}</option>
                  ))}
                </select>
              </div>

              {/* Content */}
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder={t.writeSomething}
                className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 resize-none focus:border-gray-500/50 focus:outline-none mb-4"
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => { setShowNewPost(false); setNewPostContent(''); setNewPostZodiac(''); }}
                  className="px-4 py-2 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handlePost}
                  disabled={!newPostContent.trim()}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-600 rounded-lg text-gray-900 font-medium hover:from-gray-500 hover:to-gray-500 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {t.post}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Posts Feed */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">{t.loading}</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💫</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.noPosts}</h3>
            <p className="text-gray-400">{t.beFirst}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-gray-200 transition-all"
              >
                {/* Author */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-500 rounded-full flex items-center justify-center text-lg text-gray-900">
                    {post.authorPhoto ? (
                      <img src={post.authorPhoto} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{post.authorName || t.unknown}</div>
                    <div className="text-sm text-gray-500">
                      {post.zodiacTag && `${post.zodiacTag} · `}{formatTime(post.createdAt)}
                    </div>
                  </div>
                  <button className="ml-auto text-gray-500 hover:text-gray-700">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                {/* Category Badge */}
                <div className="mb-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[post.category]}`}>
                    {t[post.category]}
                  </span>
                </div>

                {/* Content */}
                <p className="text-gray-700 mb-2 leading-relaxed whitespace-pre-wrap">{language === 'en' && (post as any).contentEn ? (post as any).contentEn : post.content}</p>

                {/* Translation */}
                {(() => {
                  const translationKey = `${post.id}_${language}`;
                  const isTranslating = translatingPost[translationKey];
                  const translation = translatedPosts[translationKey];
                  // Only show translate UI for non-zh/non-en languages
                  if (language === 'zh' || language === 'en') return null;
                  return (
                    <div className="mb-3">
                      {translation ? (
                        <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100 leading-relaxed whitespace-pre-wrap">
                          {translation}
                        </p>
                      ) : isTranslating ? (
                        <span className="text-xs text-gray-400 italic">Translating...</span>
                      ) : (
                        <button
                          onClick={() => handleTranslate(post.id, language)}
                          className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors"
                        >
                          Translate to {({zh:'Chinese',en:'English',id:'Indonesian',th:'Thai',vi:'Vietnamese',ms:'Malay',ja:'Japanese',ko:'Korean'} as any)[language] || language}
                        </button>
                      )}
                    </div>
                  );
                })()}

                {/* Actions */}
                <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 transition-colors ${
                      likedPosts.has(post.id) ? 'text-gray-500' : 'text-gray-400 hover:text-gray-500'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                    <span>{post.likesCount}</span>
                  </button>
                  <button
                    onClick={() => toggleComments(post.id)}
                    className="flex items-center gap-2 text-gray-400 hover:text-gray-400 transition-colors"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>{post.commentsCount}</span>
                  </button>
                </div>

                {/* Comments Section */}
                {expandedComments[post.id] && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    {/* Comment List */}
                    {comments[post.id] && comments[post.id].length > 0 ? (
                      <div className="space-y-3 mb-4">
                        {comments[post.id].map((comment) => (
                          <div key={comment.id} className="flex gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                              {comment.authorPhoto ? (
                                <img src={comment.authorPhoto} alt="" className="w-full h-full rounded-full object-cover" />
                              ) : (
                                <User className="w-4 h-4 text-gray-900" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">{comment.authorName || t.unknown}</div>
                              <div className="text-sm text-gray-400 mt-1">{comment.content}</div>
                              <div className="text-xs text-gray-500 mt-1">{formatTime(comment.createdAt)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 mb-4">No comments yet</div>
                    )}

                    {/* Add Comment */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newComments[post.id] || ''}
                        onChange={(e) => setNewComments(prev => ({ ...prev, [post.id]: e.target.value }))}
                        placeholder={t.comment}
                        className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 text-sm focus:border-gray-500/50 focus:outline-none"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        disabled={!newComments[post.id]?.trim()}
                        className="px-4 py-2 bg-gray-600 text-gray-900 rounded-lg text-sm hover:bg-gray-500 transition-all disabled:opacity-50"
                      >
                        {t.submitComment}
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
