import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAppState, updateNovel } from '../../services/storage';
import { Novel, Category, NovelStatus } from '../../types';
import { Plus, Edit2, Eye, Book, MoreVertical } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // New Novel State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCat, setNewCat] = useState<Category>(Category.FANTASY);

  useEffect(() => {
    const state = getAppState();
    // In a real app, filter by current user. Here we show all for demo purposes.
    setNovels(state.novels);
  }, []);

  const handleCreateNovel = () => {
      if (!newTitle.trim()) return;
      
      const newNovel: Novel = {
          id: Date.now().toString(),
          title: newTitle,
          author: '当前用户', // Mock
          description: newDesc,
          coverUrl: `https://picsum.photos/300/450?random=${Date.now()}`,
          category: newCat,
          tags: [],
          status: NovelStatus.ONGOING,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          views: 0,
          rating: 0,
          ratingCount: 0
      };
      
      updateNovel(newNovel);
      setNovels([...novels, newNovel]);
      setShowCreateModal(false);
      setNewTitle('');
      setNewDesc('');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">作者工作台</h1>
            <p className="text-slate-500">管理你的作品和查看数据。</p>
        </div>
        <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
        >
            <Plus className="w-5 h-5" /> 创建作品
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {novels.map(novel => (
              <div key={novel.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="flex p-4 gap-4">
                      <div className="w-20 aspect-[2/3] rounded bg-slate-100 shrink-0 overflow-hidden">
                          <img src={novel.coverUrl} alt={novel.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-900 truncate">{novel.title}</h3>
                          <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded mt-1">{novel.category}</span>
                          <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                              <div className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" /> {novel.views}
                              </div>
                              <div className="flex items-center gap-1">
                                  <Book className="w-3 h-3" /> {novel.rating.toFixed(1)}
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="mt-auto border-t border-slate-100 p-3 bg-slate-50 flex justify-end gap-2">
                      <Link 
                        to={`/author/novel/${novel.id}`} 
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-700 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                      >
                          <Edit2 className="w-3 h-3" /> 管理与写作
                      </Link>
                  </div>
              </div>
          ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                  <h2 className="text-xl font-bold text-slate-900">创建新作品</h2>
                  
                  <div className="space-y-3">
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">书名</label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={newTitle}
                            onChange={e => setNewTitle(e.target.value)}
                            placeholder="请输入书名"
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">分类</label>
                          <select 
                             className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                             value={newCat}
                             onChange={e => setNewCat(e.target.value as Category)}
                          >
                              {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">简介</label>
                          <textarea 
                             className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none"
                             value={newDesc}
                             onChange={e => setNewDesc(e.target.value)}
                             placeholder="这是一个怎样的故事？"
                          />
                      </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                      <button 
                        onClick={() => setShowCreateModal(false)}
                        className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                      >
                          取消
                      </button>
                      <button 
                        onClick={handleCreateNovel}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                        disabled={!newTitle.trim()}
                      >
                          创建作品
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Dashboard;