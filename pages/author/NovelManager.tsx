import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAppState } from '../../services/storage';
import { Novel, Chapter } from '../../types';
import { Plus, FileText, ArrowLeft, Settings } from 'lucide-react';

const NovelManager: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [novel, setNovel] = useState<Novel | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    if (!id) return;
    const state = getAppState();
    const foundNovel = state.novels.find(n => n.id === id);
    const foundChapters = state.chapters
        .filter(c => c.novelId === id)
        .sort((a, b) => a.order - b.order); // Ideally sort by order, here simple
    
    setNovel(foundNovel || null);
    setChapters(foundChapters);
  }, [id]);

  if (!novel) return <div>Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
       <div className="flex items-center gap-4 mb-8">
           <Link to="/author" className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
               <ArrowLeft className="w-6 h-6" />
           </Link>
           <div>
               <h1 className="text-2xl font-bold text-slate-900">{novel.title}</h1>
               <p className="text-slate-500">章节管理</p>
           </div>
           <div className="ml-auto">
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
                    <Settings className="w-4 h-4" /> 设置
                </button>
           </div>
       </div>

       <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
           <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <h2 className="font-bold text-slate-800">章节列表</h2>
               <Link 
                 to={`/author/novel/${id}/chapter/new`}
                 className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
               >
                   <Plus className="w-4 h-4" /> 新建章节
               </Link>
           </div>
           
           <div className="divide-y divide-slate-100">
               {chapters.length === 0 ? (
                   <div className="p-12 text-center text-slate-400">
                       <FileText className="w-12 h-12 mx-auto mb-4 text-slate-200" />
                       <p>暂无章节，开始写作吧！</p>
                   </div>
               ) : (
                   chapters.map(chapter => (
                       <div key={chapter.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                           <div>
                               <h3 className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">{chapter.title}</h3>
                               <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                                   <span className={chapter.isPublished ? 'text-green-600 bg-green-50 px-2 py-0.5 rounded' : 'text-amber-600 bg-amber-50 px-2 py-0.5 rounded'}>
                                       {chapter.isPublished ? '已发布' : '草稿'}
                                   </span>
                                   <span>{chapter.wordCount} 字</span>
                                   {chapter.publishedAt && <span>{new Date(chapter.publishedAt).toLocaleDateString()}</span>}
                               </div>
                           </div>
                           <Link 
                             to={`/author/novel/${id}/chapter/${chapter.id}`}
                             className="px-4 py-2 text-sm text-indigo-600 font-medium hover:bg-indigo-50 rounded-lg transition-colors"
                           >
                               编辑
                           </Link>
                       </div>
                   ))
               )}
           </div>
       </div>
    </div>
  );
};

export default NovelManager;