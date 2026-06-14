'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  ArrowLeft, MessageSquare, Heart, MoreHorizontal,
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
  learning: 'bg-gray-100 text-gray-700',
};

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
    unknown: '匿名',
  },
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
    unknown: 'Anonymous',
  },
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
    unknown: 'Anonim',
  },
};

interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  content: string;
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
  const { user, loginWithGoogle: authLoginWithGoogle, logout: authLogout } = useAuth();
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
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComments, setNewComments] = useState<Record<string, string>>({});
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  // Load posts
  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedPosts = await getPosts(20);
      setPosts(fetchedPosts as Post[]);
      
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

  // If not logged in, show login prompt with preview
  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          {/* Preview content behind semi-transparent overlay */}
          <div className="relative mb-12 opacity-30 pointer-events-none select-none">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">占星社区</h2>
              <div className="flex gap-2">
                {['日常','提问','经验','学习'].map(c => (
                  <span key={c} className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">{c}</span>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {[
                { author:'星友小王', cat:'日常', content:'今天看了日返盘，发现明年木星进第一宫，太期待了！有同样配置的朋友吗？', likes:12, comments:5 },
                { author:'占星学习者', cat:'提问', content:'请问各位大神，月亮空亡（VoC Moon）期间适合做什么？不适合做什么？', likes:8, comments:15 },
                { author:'星座达人', cat:'经验', content:'分享一个看事业宫的小技巧：重点看10宫主星和MC的相位关系，比单纯看10宫内行星更准。', likes:24, comments:9 },
              ].map((post, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium">{post.author}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{post.cat}</span>
                  </div>
                  <p className="text-sm mb-2">{post.content}</p>
                  <div className="flex gap-4 text-xs text-gray-400">
                    <span>❤ {post.likes}</span>
                    <span>💬 {post.comments}</span>
                  </div>
                </div>
              ))}
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
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:border-gray-500/50 focus:outline-none"
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
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
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
                  className="w-full px-4 py-3 bg-white/5 border border-gray-200 rounded-xl text-gray-900 focus:border-gray-500/50 focus:outline-none appearance-none cursor-pointer"
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
                className="w-full h-32 p-4 bg-white/5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 resize-none focus:border-gray-500/50 focus:outline-none mb-4"
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
                className="bg-white/5 rounded-2xl p-6 border border-gray-200 hover:border-gray-200 transition-all"
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
                <p className="text-gray-700 mb-4 leading-relaxed whitespace-pre-wrap">{post.content}</p>

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
                        className="flex-1 px-4 py-2 bg-white/5 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 text-sm focus:border-gray-500/50 focus:outline-none"
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
