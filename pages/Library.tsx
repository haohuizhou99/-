import React, { useState, useEffect } from 'react';
import { getAppState } from '../services/storage';
import { Novel, ReadingHistory } from '../types';
import NovelCard from '../components/NovelCard';
import { Link } from 'react-router-dom';
import { Clock, BookMarked } from 'lucide-react';

const Library: React.FC = () => {
  const [bookshelf, setBookshelf] = useState<Novel[]>([]);
  const [history, setHistory] = useState<(ReadingHistory & { novelTitle: string, chapterTitle: string })[]>([]);

  useEffect(() => {
    const state = getAppState();
    
    // Populate Bookshelf
    const shelfNovels = state.novels.filter(n => state.bookshelf.includes(n.id));
    setBookshelf(shelfNovels);

    // Populate History
    const historyData = state.history.map(h => {
        const novel = state.novels.find(n => n.id === h.novelId);
        const chapter = state.chapters.find(c => c.id === h.chapterId);
        return {
            ...h,
            novelTitle: novel?.title || '未知小说',
            chapterTitle: chapter?.title || '未知章节'
        };
    }).sort((a, b) => b.timestamp - a.timestamp);
    
    setHistory(historyData);
  }, []);

  return (
    <div className="space-y-12">
      <section>
          <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-bold text-slate-900">最近阅读</h2>
          </div>
          
          {history.length === 0 ? (
              <div className="p-8 bg-white rounded-xl border border-dashed border-slate-200 text-center text-slate-400">
                  暂无阅读记录。
              </div>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {history.map(h => (
                      <Link key={`${h.novelId}-${h.chapterId}`} to={`/read/${h.novelId}/${h.chapterId}`} className="flex items-center p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                              <BookMarked className="w-6 h-6" />
                          </div>
                          <div className="ml-4 overflow-hidden">
                              <h3 className="font-bold text-slate-900 truncate">{h.novelTitle}</h3>
                              <p className="text-sm text-slate-500 truncate">{h.chapterTitle}</p>
                              <p className="text-xs text-slate-400 mt-1">{new Date(h.timestamp).toLocaleDateString()}</p>
                          </div>
                      </Link>
                  ))}
              </div>
          )}
      </section>

      <section>
          <div className="flex items-center gap-2 mb-6">
              <BookMarked className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-bold text-slate-900">我的书架</h2>
          </div>
          
          {bookshelf.length === 0 ? (
              <div className="p-12 bg-white rounded-xl border border-dashed border-slate-200 text-center text-slate-400">
                  书架空空如也，快去添加几本吧！
              </div>
          ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {bookshelf.map(novel => (
                      <NovelCard key={novel.id} novel={novel} />
                  ))}
              </div>
          )}
      </section>
    </div>
  );
};

export default Library;