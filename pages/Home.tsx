import React, { useState, useEffect } from 'react';
import { getAppState } from '../services/storage';
import { Novel, Category } from '../types';
import NovelCard from '../components/NovelCard';
import { Flame, TrendingUp } from 'lucide-react';

const Home: React.FC = () => {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('全部');

  useEffect(() => {
    const state = getAppState();
    setNovels(state.novels);
  }, []);

  const filteredNovels = activeCategory === '全部' 
    ? novels 
    : novels.filter(n => n.category === activeCategory);

  const featuredNovel = novels[0];

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      {featuredNovel && (
        <section className="relative bg-slate-900 rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0">
             <img src={featuredNovel.coverUrl} className="w-full h-full object-cover opacity-30 blur-sm" alt="Background" />
             <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
          </div>
          <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center">
             <div className="shrink-0 w-32 md:w-48 aspect-[2/3] rounded-lg overflow-hidden shadow-lg border-2 border-slate-700">
                 <img src={featuredNovel.coverUrl} className="w-full h-full object-cover" alt={featuredNovel.title} />
             </div>
             <div className="flex-1 text-center md:text-left text-white space-y-4">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-medium">
                    <Flame className="w-3 h-3" /> 精选推荐
                 </div>
                 <h1 className="text-3xl md:text-5xl font-bold font-serif leading-tight">{featuredNovel.title}</h1>
                 <p className="text-slate-300 line-clamp-2 md:line-clamp-3 max-w-2xl text-lg">{featuredNovel.description}</p>
                 <div className="pt-4">
                     <a href={`#/novel/${featuredNovel.id}`} className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 py-3 rounded-full transition-colors">
                         立即阅读
                     </a>
                 </div>
             </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section>
        <div className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar">
          {['全部', ...Object.values(Category)].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat 
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section>
        <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">热门小说</h2>
        </div>
        
        {filteredNovels.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-400">该分类下暂无小说。</p>
            </div>
        ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredNovels.map(novel => (
                <NovelCard key={novel.id} novel={novel} />
            ))}
            </div>
        )}
      </section>
    </div>
  );
};

export default Home;