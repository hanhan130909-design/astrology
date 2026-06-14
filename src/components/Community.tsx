"use client";

import { useState, useEffect } from "react";
import { Timestamp } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Post, 
  getPosts, 
  createPost, 
  likePost, 
  getUserLikedPosts,
  addComment,
  getComments,
  getUserProfile,
  updateUserProfile
} from "@/lib/firebase";

interface Props {
  language: "id" | "en" | "zh";
}

const CATEGORY_ICONS: Record<string, string> = {
  daily: "🌟",
  question: "❓",
  experience: "💫",
  learning: "📚"
};

const CATEGORY_COLORS: Record<string, string> = {
  daily: "from-amber-500/20 to-orange-500/20 border-amber-500/30",
  question: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
  experience: "from-purple-500/20 to-pink-500/20 border-purple-200",
  learning: "from-green-500/20 to-emerald-500/20 border-green-500/30"
};

export default function Community({ language }: Props) {
  const { user, profile: authProfile } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [category, setCategory] = useState<Post['category']>("daily");
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [commentingPost, setCommentingPost] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, any[]>>({});
  const [newComment, setNewComment] = useState("");
  const [localProfile, setLocalProfile] = useState<any>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [postingError, setPostingError] = useState<string | null>(null);

  // 同步 profile from AuthContext
  useEffect(() => {
    if (authProfile) {
      setLocalProfile(authProfile);
    }
  }, [authProfile]);

  // 如果 AuthContext 没有 profile，确保从 Firestore 加载
  useEffect(() => {
    const ensureProfile = async () => {
      if (user && !localProfile) {
        try {
          const p = await getUserProfile(user.uid);
          if (p) {
            setLocalProfile(p);
          } else {
            // 创建默认 profile
            const defaultProfile: any = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || user.email?.split('@')[0] || 'User',
              photoURL: user.photoURL || undefined,
              language,
              createdAt: Timestamp.now(),
              updatedAt: Timestamp.now(),
              stats: { postsCount: 0, followersCount: 0, followingCount: 0 }
            };
            await updateUserProfile(user.uid, defaultProfile);
            setLocalProfile(defaultProfile);
          }
        } catch (err) {
          console.error("Profile creation error:", err);
          // 有用户但无 profile，创建临时
          setLocalProfile({
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || user.email?.split('@')[0] || 'User',
            language
          });
        }
      }
    };
    ensureProfile();
  }, [user, localProfile, language]);

  const t = {
    id: {
      title: "Komunitas",
      subtitle: "Berbagi dan diskusi dengan pecinta bintang",
      newPost: "Bagikan pemikiran, pertanyaan, atau pengalamanmu...",
      category: "Kategori",
      daily: "Harian",
      question: "Pertanyaan",
      experience: "Pengalaman",
      learning: "Belajar",
      post: "Posting",
      like: "Suka",
      comment: "Komentar",
      noPosts: "Belum ada postingan. Jadilah yang pertama!",
      loginToPost: "🔐 Masuk untuk bergabung dalam diskusi",
      send: "Kirim",
      posting: "Memposting...",
      categories: { daily: "🌟 Harian", question: "❓ Pertanyaan", experience: "💫 Pengalaman", learning: "📚 Belajar" }
    },
    en: {
      title: "Community",
      subtitle: "Share and discuss with astrology lovers",
      newPost: "Share your thoughts, questions, or experiences...",
      category: "Category",
      daily: "Daily",
      question: "Question",
      experience: "Experience",
      learning: "Learning",
      post: "Post",
      like: "Like",
      comment: "Comment",
      noPosts: "No posts yet. Be the first to share!",
      loginToPost: "🔐 Login to join the discussion",
      send: "Send",
      posting: "Posting...",
      categories: { daily: "🌟 Daily", question: "❓ Question", experience: "💫 Experience", learning: "📚 Learning" }
    },
    zh: {
      title: "社区",
      subtitle: "与星座爱好者分享和讨论",
      newPost: "分享你的想法、问题或经验...",
      category: "分类",
      daily: "日常",
      question: "提问",
      experience: "经验",
      learning: "学习",
      post: "发布",
      like: "点赞",
      comment: "评论",
      noPosts: "暂无帖子，成为第一个分享的人吧！",
      loginToPost: "🔐 登录后参与讨论",
      send: "发送",
      posting: "发布中...",
      categories: { daily: "🌟 日常", question: "❓ 提问", experience: "💫 经验", learning: "📚 学习" }
    },
  }[language];

  useEffect(() => {
    loadPosts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const loadedPosts = await getPosts();
      setPosts(loadedPosts);
      
      // 批量获取点赞状态（性能优化）
      if (user && loadedPosts.length > 0) {
        const postIds = loadedPosts.map(p => p.id);
        const liked = await getUserLikedPosts(user.uid, postIds);
        setLikedPosts(liked);
      }
    } catch (err) {
      console.error("Load posts error:", err);
    }
    setIsLoading(false);
  };

  const handlePost = async () => {
    if (!user || !localProfile || !newPost.trim()) {
      setPostingError(language === "zh" ? "请先登录" : language === "id" ? "Silakan login dulu" : "Please login first");
      return;
    }

    setIsPosting(true);
    setPostingError(null);
    
    try {
      await createPost(
        user.uid,
        localProfile.displayName || "User",
        localProfile.photoURL,
        newPost.trim(),
        category
      );
      setNewPost("");
      await loadPosts();
    } catch (err: any) {
      console.error("Post error:", err);
      setPostingError(err.message || "Failed to post");
    }
    
    setIsPosting(false);
  };

  const handleLike = async (postId: string) => {
    if (!user) return;
    if (likedPosts.has(postId)) return;

    try {
      await likePost(postId, user.uid);
      // 本地状态更新，不重新加载帖子（性能优化）
      setLikedPosts(prev => new Set(prev).add(postId));
      setPosts(prev => prev.map(p => 
        p.id === postId ? { ...p, likesCount: (p.likesCount || 0) + 1 } : p
      ));
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const loadComments = async (postId: string) => {
    try {
      const postComments = await getComments(postId);
      setComments(prev => ({ ...prev, [postId]: postComments }));
    } catch (err) {
      console.error("Load comments error:", err);
    }
  };

  const handleComment = async (postId: string) => {
    if (!user || !localProfile || !newComment.trim()) return;

    try {
      await addComment(
        postId,
        user.uid,
        localProfile.displayName || "User",
        localProfile.photoURL,
        newComment.trim()
      );
      setNewComment("");
      // 本地状态更新，不重新加载帖子（性能优化）
      setPosts(prev => prev.map(p => 
        p.id === postId ? { ...p, commentsCount: (p.commentsCount || 0) + 1 } : p
      ));
      loadComments(postId);
    } catch (err) {
      console.error("Comment error:", err);
    }
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return language === "zh" ? "刚刚" : language === "id" ? "Baru saja" : "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)} ${language === "zh" ? "分钟前" : language === "id" ? "menit lalu" : "min ago"}`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} ${language === "zh" ? "小时前" : language === "id" ? "jam lalu" : "h ago"}`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* 发帖框 */}
      {user && localProfile ? (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50/40 via-indigo-900/30 to-purple-900/40 border border-purple-200 shadow-xl shadow-purple-900/20">
          {/* 装饰背景 */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />
          
          <div className="relative p-5">
            {/* 用户信息 */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-amber-500/20">
                {localProfile?.displayName?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <div className="font-semibold text-amber-100">{localProfile?.displayName}</div>
                <div className="text-xs text-purple-400">
                  {language === "zh" ? "正在分享..." : language === "id" ? "Berbagi..." : "Sharing..."}
                </div>
              </div>
            </div>

            {/* 输入框 */}
            <textarea
              value={newPost}
              onChange={e => setNewPost(e.target.value)}
              placeholder={t.newPost}
              className="w-full p-4 bg-purple-950/50 border border-purple-200 rounded-xl text-white placeholder-purple-400/60 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent transition-all"
              rows={3}
            />

            {/* 错误提示 */}
            {postingError && (
              <div className="mt-2 p-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                {postingError}
              </div>
            )}

            {/* 底部操作栏 */}
            <div className="flex items-center justify-between mt-4">
              {/* 分类选择 */}
              <div className="flex items-center gap-2">
                {Object.entries(t.categories).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setCategory(key as Post['category'])}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      category === key 
                        ? "bg-gradient-to-r " + CATEGORY_COLORS[key] + " text-white ring-1 ring-purple-400/50"
                        : "bg-purple-900/30 text-purple-300 hover:bg-purple-800/40"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* 发布按钮 */}
              <button
                onClick={handlePost}
                disabled={!newPost.trim() || isPosting}
                className="px-8 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-purple-600 rounded-xl font-semibold text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
              >
                {isPosting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    {t.posting}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span>✨</span> {t.post}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden p-8 rounded-2xl bg-gradient-to-br from-purple-50/20 via-indigo-900/10 to-purple-900/20 border border-purple-500/10 text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
          <div className="relative">
            <div className="text-6xl mb-4">🔐</div>
            <p className="text-purple-300 text-lg">{t.loginToPost}</p>
          </div>
        </div>
      )}

      {/* 帖子列表 */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-amber-500 rounded-full animate-spin" />
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-purple-400 rounded-full animate-spin animate-reverse" style={{animationDirection: 'reverse', animationDuration: '1.5s'}} />
          </div>
        </div>
      ) : posts.length === 0 ? (
        <div className="relative overflow-hidden p-12 rounded-2xl bg-gradient-to-br from-purple-50/20 via-indigo-900/10 to-purple-900/20 border border-purple-500/10 text-center">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-purple-300 text-lg">{t.noPosts}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post, index) => (
            <div 
              key={post.id} 
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50/30 via-indigo-900/20 to-purple-900/30 border border-purple-200 hover:border-amber-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/20"
              style={{animationDelay: `${index * 50}ms`}}
            >
              {/* 左边装饰条 */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${CATEGORY_COLORS[post.category]}`} />
              
              <div className="p-5 pl-6">
                {/* 作者信息 */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                      {post.authorName.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-purple-800 flex items-center justify-center text-xs">
                      {CATEGORY_ICONS[post.category]}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-amber-100">{post.authorName}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs bg-gradient-to-r ${CATEGORY_COLORS[post.category]}`}>
                        {t.categories[post.category]}
                      </span>
                    </div>
                    <div className="text-xs text-purple-400 flex items-center gap-1">
                      <span>🕐</span> {formatTime(post.createdAt)}
                    </div>
                  </div>
                </div>

                {/* 内容 */}
                <p className="text-purple-700 leading-relaxed whitespace-pre-wrap text-base mb-4">{post.content}</p>

                {/* 操作栏 */}
                <div className="flex items-center gap-6 pt-4 border-t border-purple-500/10">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      likedPosts.has(post.id) 
                        ? "bg-red-500/20 text-red-300" 
                        : "bg-purple-800/30 text-purple-300 hover:bg-purple-700/40 hover:text-amber-600"
                    }`}
                  >
                    <span className="text-lg">{likedPosts.has(post.id) ? "❤️" : "🤍"}</span>
                    <span>{post.likesCount}</span>
                  </button>
                  <button
                    onClick={() => {
                      if (commentingPost === post.id) {
                        setCommentingPost(null);
                      } else {
                        setCommentingPost(post.id);
                        loadComments(post.id);
                      }
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      commentingPost === post.id
                        ? "bg-blue-500/20 text-blue-300"
                        : "bg-purple-800/30 text-purple-300 hover:bg-purple-700/40 hover:text-amber-600"
                    }`}
                  >
                    <span className="text-lg">💬</span>
                    <span>{post.commentsCount}</span>
                  </button>
                </div>

                {/* 评论区 */}
                {commentingPost === post.id && (
                  <div className="mt-4 pt-4 border-t border-purple-500/10 space-y-3">
                    {/* 评论列表 */}
                    {comments[post.id]?.length > 0 && (
                      <div className="space-y-3">
                        {comments[post.id].map(comment => (
                          <div key={comment.id} className="flex gap-3 p-3 rounded-xl bg-purple-900/20">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                              {comment.authorName.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-amber-100">{comment.authorName}</span>
                                <span className="text-xs text-purple-500">{formatTime(comment.createdAt)}</span>
                              </div>
                              <p className="text-sm text-purple-600 mt-1">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 评论输入 */}
                    {user && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newComment}
                          onChange={e => setNewComment(e.target.value)}
                          placeholder={t.comment}
                          className="flex-1 p-3 bg-purple-900/30 border border-purple-200 rounded-xl text-white text-sm placeholder-purple-400/60 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                          onKeyDown={e => {
                            if (e.key === 'Enter' && newComment.trim()) {
                              handleComment(post.id);
                            }
                          }}
                        />
                        <button
                          onClick={() => handleComment(post.id)}
                          disabled={!newComment.trim()}
                          className="px-5 py-2 bg-gradient-to-r from-amber-500/80 to-purple-600/80 rounded-xl text-white text-sm font-medium hover:from-amber-500 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {t.send} 🚀
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}