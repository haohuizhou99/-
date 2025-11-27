import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAppState, updateHistory } from '../services/storage';
import { Novel, Chapter } from '../types';
import { ArrowLeft, ArrowRight, Home, Settings } from 'lucide-react';

const Reader: React.FC = () => {
  const { novelId, chapterId } = useParams<{ novelId: string; chapterId: string }>();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [novel, setNovel] = useState<Novel | null>(null);
  const [prevChapterId, setPrevChapterId] = useState<string | null>(null);
  const [nextChapterId, setNextChapterId] = useState<string | null>(null);
  
  // Customization State
  const [fontSize, setFontSize] = useState(18);
  const [theme, setTheme] = useState<'light' | 'sepia' | 'dark'>('light');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (!novelId || !chapterId) return;
    const state = getAppState();
    const foundNovel = state.novels.find(n => n.id === novelId);
    const chapters = state.chapters
        .filter(c => c.novelId === novelId && c.isPublished)
        .sort((a, b) => a.order - b.order);
    
    const currentChapter = chapters.find(c => c.id === chapterId);
    
    if (foundNovel && currentChapter) {
        setNovel(foundNovel);
        setChapter(currentChapter);
        
        // Find Prev/Next
        const currentIndex = chapters.findIndex(c => c.id === chapterId);
        setPrevChapterId(currentIndex > 0 ? chapters[currentIndex - 1].id : null);
        setNextChapterId(currentIndex < chapters.length - 1 ? chapters[currentIndex + 1].id : null);

        // Update History
        updateHistory(novelId, chapterId);
        
        // Scroll to top
        window.scrollTo(0, 0);
    }
  }, [novelId, chapterId]);

  if (!chapter || !novel) return <div className="h-screen flex items-center justify-center text-slate-400">加载中...</div>;

  const themeClasses = {
      light: 'bg-white text-slate-800',
      sepia: 'bg-[#f4ecd8] text-[#5b4636]',
      dark: 'bg-slate-900 text-slate-300'
  };

  const themeNames = {
      light: '日间',
      sepia: '护眼',
      dark: '夜间'
  };

  return (
    <div className={`min-h-screen ${themeClasses[theme]} transition-colors duration-300`}>
      {/* Sticky Header */}
      <div className={`sticky top-0 z-40 border-b shadow-sm transition-colors duration-300 ${
          theme === 'dark' ? 'bg-slate-900/95 border-slate-800' : 
          theme === 'sepia' ? 'bg-[#f4ecd8]/95 border-[#e8dfc4]' : 
          'bg-white/95 border-slate-100'
      } backdrop-blur-sm`}>
          <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
              {/* Back Button with History Pop Logic */}
              <button 
                  onClick={() => navigate(-1)} 
                  className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity focus:outline-none"
              >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="hidden sm:inline line-clamp-1 max-w-[150px]">{novel.title}</span>
              </button>
              
              <div className="flex items-center gap-4">
                  <button onClick={() => setShowSettings(!showSettings)} className="p-2 rounded-full hover:bg-black/5">
                      <Settings className="w-5 h-5" />
                  </button>
                  <Link to="/" className="p-2 rounded-full hover:bg-black/5">
                      <Home className="w-5 h-5" />
                  </Link>
              </div>
          </div>
          
          {/* Settings Dropdown */}
          {showSettings && (
              <div className="absolute right-4 top-14 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-4 text-slate-800 transform origin-top-right animate-in fade-in zoom-in-95 duration-200">
                  <div className="space-y-4">
                      <div>
                          <label className="text-xs font-semibold text-slate-400 uppercase mb-2 block">主题</label>
                          <div className="flex gap-2">
                              {(['light', 'sepia', 'dark'] as const).map((t) => (
                                  <button 
                                    key={t}
                                    onClick={() => setTheme(t)}
                                    className={`flex-1 py-2 rounded-lg border text-xs font-medium ${
                                        theme === t ? 'ring-2 ring-indigo-500 border-transparent' : 'border-slate-200 hover:bg-slate-50'
                                    } ${
                                        t === 'light' ? 'bg-white' : t === 'sepia' ? 'bg-[#f4ecd8]' : 'bg-slate-800 text-white'
                                    }`}
                                  >
                                      {themeNames[t]}
                                  </button>
                              ))}
                          </div>
                      </div>
                      <div>
                          <label className="text-xs font-semibold text-slate-400 uppercase mb-2 block">字号</label>
                          <div className="flex items-center gap-3 bg-slate-100 rounded-lg p-1">
                              <button onClick={() => setFontSize(Math.max(14, fontSize - 2))} className="p-2 flex-1 hover:bg-white rounded shadow-sm text-xs">
                                  A-
                              </button>
                              <span className="text-xs font-medium w-8 text-center">{fontSize}</span>
                              <button onClick={() => setFontSize(Math.min(32, fontSize + 2))} className="p-2 flex-1 hover:bg-white rounded shadow-sm text-lg">
                                  A+
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          )}
      </div>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12 sm:px-8 sm:py-16">
          <h1 className="text-3xl sm:text-4xl font-bold font-serif mb-12 text-center">{chapter.title}</h1>
          <div 
            className="font-serif leading-loose whitespace-pre-wrap selection:bg-indigo-200 selection:text-indigo-900"
            style={{ fontSize: `${fontSize}px` }}
          >
              {chapter.content}
          </div>
      </main>

      {/* Navigation Footer */}
      <div className={`border-t py-8 mt-12 ${
           theme === 'dark' ? 'border-slate-800' : 
           theme === 'sepia' ? 'border-[#e8dfc4]' : 
           'border-slate-100'
      }`}>
          <div className="max-w-3xl mx-auto px-6 flex justify-between items-center">
              <button 
                onClick={() => prevChapterId && navigate(`/read/${novelId}/${prevChapterId}`)}
                disabled={!prevChapterId}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                    !prevChapterId ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black/5 active:scale-95'
                }`}
              >
                  <ArrowLeft className="w-5 h-5" /> 上一章
              </button>
              
              <button 
                onClick={() => nextChapterId && navigate(`/read/${novelId}/${nextChapterId}`)}
                disabled={!nextChapterId}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                    !nextChapterId ? 'opacity-30 cursor-not-allowed' : 
                    theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 
                    'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200'
                }`}
              >
                  下一章 <ArrowRight className="w-5 h-5" />
              </button>
          </div>
      </div>
    </div>
  );
};

export default Reader;