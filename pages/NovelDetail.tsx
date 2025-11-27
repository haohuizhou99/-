import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAppState, toggleBookshelf, addComment } from '../services/storage';
import { Novel, Chapter, Comment } from '../types';
import { Bookmark, List, Clock, Star, User, MessageSquare, ArrowLeft } from 'lucide-react';

const NovelDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [novel, setNovel] = useState<Novel | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isInBookshelf, setIsInBookshelf] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(5);

  useEffect(() => {
    if (!id) return;
    const state = getAppState();
    const foundNovel = state.novels.find(n => n.id === id);
    const foundChapters = state.chapters
      .filter(c => c.novelId === id && c.isPublished)
      .sort((a, b) => a.order - b.order);
    const foundComments = state.comments
      .filter(c => c.novelId === id)
      .sort((a, b) => b.createdAt - a.createdAt);

    if (foundNovel) {
      setNovel(foundNovel);
      setChapters(foundChapters);
      setComments(foundComments);
      setIsInBookshelf(state.bookshelf.includes(id));
    }
  }, [id]);

  const handleToggleBookshelf = () => {
    if (!id) return;
    toggleBookshelf(id);
    setIsInBookshelf(!isInBookshelf);
  };

  const handleSubmitComment = () => {
    if (!id || !newComment.trim()) return;
    const comment: Comment = {
        id: Date.now().toString(),
        novelId: id,
        username: '访客用户',
        content: newComment,
        rating: userRating,
        createdAt: Date.now()
    };
    addComment(comment);
    setComments([comment, ...comments]);
    setNewComment('');
  };

  const handleBack = () => {
    if (window.history.length > 1) {
        navigate(-1);
    } else {
        navigate('/');
    }
  };

  if (!novel) return <div className="text-center py-20 text-slate-500">未找到小说</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Back Button */}
      <div className="flex items-center">
        <button 
          onClick={handleBack} 
          className="group flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors px-2 py-1 -ml-2 rounded-lg hover:bg-slate-100"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-sm">返回</span>
        </button>
      </div>

      {/* Header Info */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-8">
        <div className="w-full sm:w-48 aspect-[2/3] shrink-0 rounded-lg overflow-hidden shadow-md">
          <img src={novel.coverUrl} alt={novel.title} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full mb-2">
                {novel.category}
            </span>
            <h1 className="text-3xl font-bold font-serif text-slate-900 mb-1">{novel.title}</h1>
            <p className="text-slate-500 font-medium">作者： <span className="text-slate-900">{novel.author}</span></p>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-slate-500 border-y border-slate-100 py-3">
             <div className="flex items-center gap-1.5">
                 <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                 <span className="font-bold text-slate-700">{novel.rating.toFixed(1)}</span>
                 <span>({novel.ratingCount})</span>
             </div>
             <div className="flex items-center gap-1.5">
                 <List className="w-4 h-4" />
                 <span>{chapters.length} 章</span>
             </div>
             <div className="flex items-center gap-1.5">
                 <span className={`w-2 h-2 rounded-full ${novel.status === '连载中' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                 <span>{novel.status}</span>
             </div>
          </div>

          <p className="text-slate-600 leading-relaxed">{novel.description}</p>
          
          <div className="flex flex-wrap gap-2 pt-2">
              {novel.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">#{tag}</span>
              ))}
          </div>

          <div className="flex gap-3 pt-4">
            <Link 
                to={chapters.length > 0 ? `/read/${novel.id}/${chapters[0].id}` : '#'}
                className={`flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg text-center transition-colors shadow-lg shadow-indigo-200 hover:shadow-indigo-300 ${chapters.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                开始阅读
            </Link>
            <button 
                onClick={handleToggleBookshelf}
                className={`px-4 py-2.5 rounded-lg border font-medium transition-all ${
                    isInBookshelf 
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
            >
                <Bookmark className={`w-5 h-5 ${isInBookshelf ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Chapters List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h2 className="font-bold text-lg text-slate-800">目录</h2>
            <span className="text-xs text-slate-500">更新于 {new Date(novel.updatedAt).toLocaleDateString()}</span>
        </div>
        <div className="divide-y divide-slate-50">
            {chapters.length === 0 ? (
                <div className="p-8 text-center text-slate-400">暂无章节发布。</div>
            ) : (
                chapters.map(chapter => (
                    <Link 
                        key={chapter.id} 
                        to={`/read/${novel.id}/${chapter.id}`}
                        className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors group"
                    >
                        <span className="font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">
                            {chapter.title}
                        </span>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                             <span className="hidden sm:inline">{new Date(chapter.publishedAt!).toLocaleDateString()}</span>
                             <Clock className="w-3 h-3" />
                        </div>
                    </Link>
                ))
            )}
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-6">
        <h2 className="font-bold text-xl text-slate-900">书评与讨论</h2>
        
        {/* Add Review Box */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
             <div className="flex items-center gap-2 mb-2">
                 <span className="text-sm font-medium text-slate-700">评价本书：</span>
                 <div className="flex gap-1">
                     {[1,2,3,4,5].map(star => (
                         <button key={star} onClick={() => setUserRating(star)} className="focus:outline-none">
                             <Star className={`w-5 h-5 ${star <= userRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                         </button>
                     ))}
                 </div>
             </div>
             <textarea 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="分享你的看法..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none h-24 text-sm"
             />
             <div className="flex justify-end">
                 <button 
                    onClick={handleSubmitComment}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    disabled={!newComment.trim()}
                 >
                     发布评论
                 </button>
             </div>
        </div>

        {/* Review List */}
        <div className="space-y-4">
            {comments.map(comment => (
                <div key={comment.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                                <User className="w-4 h-4 text-slate-500" />
                            </div>
                            <span className="font-semibold text-sm text-slate-800">{comment.username}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span className="text-sm font-medium text-slate-600">{comment.rating}</span>
                        </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{comment.content}</p>
                    <div className="mt-3 text-xs text-slate-400">
                        {new Date(comment.createdAt).toLocaleDateString()}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default NovelDetail;