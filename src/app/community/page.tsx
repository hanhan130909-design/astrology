"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { 
  ArrowLeft, MessageSquare, Heart, Share2, MoreHorizontal,
  Plus, Search, TrendingUp, Clock, Users, Filter,
  Send, Image as ImageIcon, X
} from "lucide-react";

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    zodiac: string;
  };
  content: string;
  images?: string[];
  likes: number;
  comments: number;
  shares: number;
  tags: string[];
  createdAt: string;
  isLiked?: boolean;
}

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
  likes: number;
}

const TRANSLATIONS: Record<string, Record<string, string>> = {
  zh: {
    title: "占星社区",
    subtitle: "与志同道合的占星爱好者交流",
    newPost: "发布新帖",
    search: "搜索话题...",
    trending: "热门",
    latest: "最新",
    following: "关注",
    allTopics: "全部话题",
    astrology: "占星讨论",
    compatibility: "配对分析",
    transit: "运势分享",
    learning: "学习交流",
    offTopic: "闲聊",
    likes: "赞",
    comments: "评论",
    shares: "分享",
    post: "发布",
    cancel: "取消",
    writeSomething: "分享你的占星心得...",
    addTags: "添加标签",
    loadMore: "加载更多",
    noPosts: "暂无帖子",
    beFirst: "成为第一个发帖的人吧！",
  },
  en: {
    title: "Astrology Community",
    subtitle: "Connect with fellow astrology enthusiasts",
    newPost: "New Post",
    search: "Search topics...",
    trending: "Trending",
    latest: "Latest",
    following: "Following",
    allTopics: "All Topics",
    astrology: "Astrology",
    compatibility: "Compatibility",
    transit: "Transits",
    learning: "Learning",
    offTopic: "Off-Topic",
    likes: "likes",
    comments: "comments",
    shares: "shares",
    post: "Post",
    cancel: "Cancel",
    writeSomething: "Share your astrology insights...",
    addTags: "Add tags",
    loadMore: "Load more",
    noPosts: "No posts yet",
    beFirst: "Be the first to post!",
  },
  id: {
    title: "Komunitas Astrologi",
    subtitle: "Terhubung dengan penggemar astrologi",
    newPost: "Posting Baru",
    search: "Cari topik...",
    trending: "Populer",
    latest: "Terbaru",
    following: "Mengikuti",
    allTopics: "Semua Topik",
    astrology: "Astrologi",
    compatibility: "Kecocokan",
    transit: "Transit",
    learning: "Pembelajaran",
    offTopic: "Obrolan",
    likes: "suka",
    comments: "komentar",
    shares: "bagikan",
    post: "Posting",
    cancel: "Batal",
    writeSomething: "Bagikan wawasan astrologi Anda...",
    addTags: "Tambah tag",
    loadMore: "Muat lebih",
    noPosts: "Belum ada posting",
    beFirst: "Jadilah yang pertama memposting!",
  },
  th: {
    title: "ชุมชนดูดวง",
    subtitle: "เชื่อมต่อกับผู้รักดูดวง",
    newPost: "โพสต์ใหม่",
    search: "ค้นหาหัวข้อ...",
    trending: "ยอดนิยม",
    latest: "ล่าสุด",
    following: "กำลังติดตาม",
    allTopics: "ทุกหัวข้อ",
    astrology: "ดูดวง",
    compatibility: "ความเข้ากัน",
    transit: "ดาวโคจร",
    learning: "การเรียนรู้",
    offTopic: "พูดคุยทั่วไป",
    likes: "ถูกใจ",
    comments: "ความคิดเห็น",
    shares: "แชร์",
    post: "โพสต์",
    cancel: "ยกเลิก",
    writeSomething: "แชร์ความรู้ดูดวงของคุณ...",
    addTags: "เพิ่มแท็ก",
    loadMore: "โหลดเพิ่ม",
    noPosts: "ยังไม่มีโพสต์",
    beFirst: "เป็นคนแรกที่โพสต์!",
  },
  vi: {
    title: "Cộng Đồng Chiêm Tinh",
    subtitle: "Kết nối với ngườii yêu chiêm tinh",
    newPost: "Bài mới",
    search: "Tìm chủ đề...",
    trending: "Phổ biến",
    latest: "Mới nhất",
    following: "Đang theo dõi",
    allTopics: "Tất cả chủ đề",
    astrology: "Chiêm tinh",
    compatibility: "Tương hợp",
    transit: "Luân chuyển",
    learning: "Học tập",
    offTopic: "Nói chuyện",
    likes: "thích",
    comments: "bình luận",
    shares: "chia sẻ",
    post: "Đăng",
    cancel: "Hủy",
    writeSomething: "Chia sẻ hiểu biết chiêm tinh của bạn...",
    addTags: "Thêm thẻ",
    loadMore: "Tải thêm",
    noPosts: "Chưa có bài viết",
    beFirst: "Hãy là ngườii đầu tiên đăng bài!",
  },
  ms: {
    title: "Komuniti Astrologi",
    subtitle: "Berkongsi dengan peminat astrologi",
    newPost: "Pos Baru",
    search: "Cari topik...",
    trending: "Popular",
    latest: "Terkini",
    following: "Mengikuti",
    allTopics: "Semua Topik",
    astrology: "Astrologi",
    compatibility: "Keserasian",
    transit: "Transit",
    learning: "Pembelajaran",
    offTopic: "Sembang",
    likes: "suka",
    comments: "komen",
    shares: "kongsi",
    post: "Pos",
    cancel: "Batal",
    writeSomething: "Kongsi pengetahuan astrologi anda...",
    addTags: "Tambah tag",
    loadMore: "Muat lagi",
    noPosts: "Tiada pos",
    beFirst: "Jadilah yang pertama mempos!",
  },
  ja: {
    title: "占星コミュニティ",
    subtitle: "占星愛好家とつながる",
    newPost: "新規投稿",
    search: "トピックを検索...",
    trending: "トレンド",
    latest: "最新",
    following: "フォロー中",
    allTopics: "すべてのトピック",
    astrology: "占星術",
    compatibility: "相性",
    transit: "トランジット",
    learning: "学習",
    offTopic: "雑談",
    likes: "いいね",
    comments: "コメント",
    shares: "シェア",
    post: "投稿",
    cancel: "キャンセル",
    writeSomething: "占星の知見をシェアしよう...",
    addTags: "タグを追加",
    loadMore: "もっと読む",
    noPosts: "投稿はありません",
    beFirst: "最初の投稿者になろう!",
  },
  ko: {
    title: "점성 커뮤니티",
    subtitle: "점성 애호가와 연결하다",
    newPost: "새 글",
    search: "주제 검색...",
    trending: "인기",
    latest: "최신",
    following: "팔로우 중",
    allTopics: "모든 주제",
    astrology: "점성술",
    compatibility: "궁합",
    transit: "트랜짓",
    learning: "학습",
    offTopic: "잡담",
    likes: "좋아요",
    comments: "댓글",
    shares: "공유",
    post: "게시",
    cancel: "취소",
    writeSomething: "점성술 인사이트를 공유하세요...",
    addTags: "태그 추가",
    loadMore: "더 보기",
    noPosts: "글 없음",
    beFirst: "첫 번째 글을 올려보세요!",
  },
};

const SAMPLE_POSTS: Post[] = [
  {
    id: "1",
    author: { name: "星空漫步者", avatar: "✨", zodiac: "双鱼座" },
    content: "最近水星逆行，大家感觉怎么样？我发现沟通确实变得困难了，电子设备也经常出问题。有什么好的应对方法吗？",
    likes: 128,
    comments: 45,
    shares: 12,
    tags: ["水星逆行", "运势", "讨论"],
    createdAt: "2026-04-11T10:30:00",
  },
  {
    id: "2",
    author: { name: "星座达人", avatar: "♌", zodiac: "狮子座" },
    content: "分享一个有趣的发现：我的本命盘里金星和火星合相，难怪我对感情总是这么热情直接！有同样配置的朋友吗？",
    likes: 256,
    comments: 89,
    shares: 34,
    tags: ["本命盘", "金星", "火星"],
    createdAt: "2026-04-11T08:15:00",
  },
  {
    id: "3",
    author: { name: "月亮守护者", avatar: "🌙", zodiac: "巨蟹座" },
    content: "刚给男朋友看了我们的合盘，契合度居然有85%！太阳月亮三合，金星火星六分，感觉找到了灵魂伴侣。",
    likes: 512,
    comments: 156,
    shares: 78,
    tags: ["合盘", "爱情", "分享"],
    createdAt: "2026-04-10T22:00:00",
  },
];

const TOPICS: { id: string; name: Record<string, string>; icon: any }[] = [
  { id: "all", name: { zh: "全部", en: "All", id: "Semua", th: "ทั้งหมด", vi: "Tất cả", ms: "Semua", ja: "すべて", ko: "전체" }, icon: Filter },
  { id: "astrology", name: { zh: "占星讨论", en: "Astrology", id: "Astrologi", th: "ดูดวง", vi: "Chiêm tinh", ms: "Astrologi", ja: "占星術", ko: "점성술" }, icon: MessageSquare },
  { id: "compatibility", name: { zh: "配对分析", en: "Compatibility", id: "Kecocokan", th: "ความเข้ากัน", vi: "Tương hợp", ms: "Keserasian", ja: "相性", ko: "궁합" }, icon: Heart },
  { id: "transit", name: { zh: "运势分享", en: "Transits", id: "Transit", th: "ดาวโคจร", vi: "Vận", ms: "Transit", ja: "トランジット", ko: "트랜짓" }, icon: TrendingUp },
  { id: "learning", name: { zh: "学习交流", en: "Learning", id: "Pembelajaran", th: "การเรียนรู้", vi: "Học tập", ms: "Pembelajaran", ja: "学習", ko: "학습" }, icon: Users },
  { id: "offtopic", name: { zh: "闲聊", en: "Off-Topic", id: "Obrolan", th: "พูดคุย", vi: "Nói chuyện", ms: "Sembang", ja: "雑談", ko: "잡담" }, icon: Clock },
];

export default function CommunityPage() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  
  const [posts, setPosts] = useState<Post[]>(SAMPLE_POSTS);
  const [activeTab, setActiveTab] = useState<"trending" | "latest" | "following">("trending");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return language === "zh" ? "刚刚" : language === "id" ? "Baru saja" : "Just now";
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handlePost = () => {
    if (!newPostContent.trim()) return;
    
    const newPost: Post = {
      id: Date.now().toString(),
      author: { name: "我", avatar: "👤", zodiac: "未知" },
      content: newPostContent,
      likes: 0,
      comments: 0,
      shares: 0,
      tags: [],
      createdAt: new Date().toISOString(),
    };
    
    setPosts([newPost, ...posts]);
    setNewPostContent("");
    setShowNewPost(false);
  };

  return (
    <div className="min-h-screen bg-[#030014]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#030014]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold gradient-text">{t.title}</h1>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

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
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500/50 focus:outline-none"
            />
          </div>
          <button
            onClick={() => setShowNewPost(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-medium hover:from-purple-500 hover:to-pink-500 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">{t.newPost}</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white/5 rounded-xl mb-6">
          {(["trending", "latest", "following"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-purple-500/20 text-purple-300"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {t[tab]}
            </button>
          ))}
        </div>

        {/* Topics */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(topic.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                selectedTopic === topic.id
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10"
              }`}
            >
              <topic.icon className="w-4 h-4" />
              {topic.name[language]}
            </button>
          ))}
        </div>

        {/* New Post Modal */}
        {showNewPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-[#0f0f1a] rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{t.newPost}</h3>
                <button
                  onClick={() => setShowNewPost(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder={t.writeSomething}
                className="w-full h-32 p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 resize-none focus:border-purple-500/50 focus:outline-none mb-4"
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-purple-400 transition-colors">
                    <ImageIcon className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-purple-400 transition-colors">
                    <span className="text-sm">#</span>
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowNewPost(false)}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    {t.cancel}
                  </button>
                  <button
                    onClick={handlePost}
                    disabled={!newPostContent.trim()}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {t.post}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💫</div>
              <h3 className="text-xl font-semibold text-white mb-2">{t.noPosts}</h3>
              <p className="text-gray-400">{t.beFirst}</p>
            </div>
          ) : (
            posts.map((post) => (
              <article
                key={post.id}
                className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:border-purple-500/20 transition-all"
              >
                {/* Author */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-lg">
                    {post.author.avatar}
                  </div>
                  <div>
                    <div className="font-medium text-white">{post.author.name}</div>
                    <div className="text-sm text-gray-500">
                      {post.author.zodiac} · {formatTime(post.createdAt)}
                    </div>
                  </div>
                  <button className="ml-auto text-gray-500 hover:text-white">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <p className="text-gray-300 mb-4 leading-relaxed">{post.content}</p>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-purple-500/10 text-purple-300 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 transition-colors ${
                      post.isLiked ? "text-pink-500" : "text-gray-400 hover:text-pink-500"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${post.isLiked ? "fill-current" : ""}`} />
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors">
                    <MessageSquare className="w-5 h-5" />
                    <span>{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span>{post.shares}</span>
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        {/* Load More */}
        {posts.length > 0 && (
          <div className="text-center mt-8">
            <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
              {t.loadMore}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
