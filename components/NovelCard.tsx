import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Eye } from 'lucide-react';
import { Novel } from '../types';

interface NovelCardProps {
  novel: Novel;
}

const NovelCard: React.FC<NovelCardProps> = ({ novel }) => {
  return (
    <Link to={`/novel/${novel.id}`} className="group flex flex-col bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 overflow-hidden h-full">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img 
          src={novel.coverUrl} 
          alt={novel.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium">
          {novel.category}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">{novel.title}</h3>
        <p className="text-sm text-slate-500 mb-2">{novel.author}</p>
        <p className="text-xs text-slate-400 line-clamp-2 mb-4 flex-1">{novel.description}</p>
        
        <div className="flex items-center justify-between text-xs text-slate-500 mt-auto pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="font-medium text-slate-700">{novel.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{novel.views.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NovelCard;