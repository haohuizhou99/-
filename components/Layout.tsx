import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, PenTool, Search, Library, User, Feather } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isAuthorMode = location.pathname.startsWith('/author');

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <header className="flex-none z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-3 group">
              {/* Ultra Cool Logo Container */}
              <div className="relative flex items-center justify-center w-10 h-10">
                <div className="absolute inset-0 bg-indigo-600 rounded-xl rotate-6 group-hover:rotate-12 transition-transform duration-500 opacity-20 blur-[1px]"></div>
                <div className="absolute inset-0 bg-purple-600 rounded-xl -rotate-3 group-hover:-rotate-6 transition-transform duration-500 opacity-20 blur-[1px]"></div>
                <div className="relative bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-2 rounded-xl shadow-lg shadow-indigo-200 group-hover:shadow-indigo-400 group-hover:scale-105 transition-all duration-300">
                  <Feather className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
              </div>
              {/* Text Logo with Gradient */}
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight flex items-baseline gap-1" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-300">墨韵</span>
                  <span className="text-sm font-bold text-slate-400 italic">小说</span>
                </span>
              </div>
            </Link>
            
            {!isAuthorMode && (
              <nav className="hidden md:flex gap-8">
                <Link to="/" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors text-sm uppercase tracking-wider relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 after:transition-all hover:after:w-full">发现</Link>
                <Link to="/library" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors text-sm uppercase tracking-wider relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 after:transition-all hover:after:w-full">书架</Link>
              </nav>
            )}
            {isAuthorMode && (
                 <nav className="hidden md:flex gap-8">
                 <Link to="/author" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors text-sm uppercase tracking-wider relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 after:transition-all hover:after:w-full">工作台</Link>
               </nav>
            )}
          </div>

          <div className="flex items-center gap-4">
             {!isAuthorMode ? (
                 <div className="relative hidden sm:block group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="搜索..." 
                        className="pl-9 pr-4 py-2 bg-slate-100 border border-transparent focus:bg-white focus:border-indigo-100 rounded-full text-sm focus:ring-2 focus:ring-indigo-100 w-48 focus:w-64 transition-all duration-300 outline-none placeholder:text-slate-400"
                    />
                 </div>
             ) : null}

            <Link 
              to={isAuthorMode ? "/" : "/author"} 
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                isAuthorMode 
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:shadow-inner' 
                  : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-md hover:shadow-indigo-500/30 transform hover:-translate-y-0.5'
              }`}
            >
              {isAuthorMode ? (
                <>
                   <User className="w-4 h-4" /> <span className="hidden sm:inline">退出作者模式</span>
                </>
              ) : (
                <>
                  <PenTool className="w-4 h-4" /> <span>创作</span>
                </>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full">
            {children}
        </div>
      </main>
      
      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-slate-200 py-3 px-6 flex justify-between items-center z-50">
           <Link to="/" className="flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-slate-400 hover:text-indigo-600 transition-colors">
               <BookOpen className="w-6 h-6 mb-0.5" />
               首页
           </Link>
           <Link to="/library" className="flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-slate-400 hover:text-indigo-600 transition-colors">
               <Library className="w-6 h-6 mb-0.5" />
               书架
           </Link>
           <Link to="/author" className="flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-slate-400 hover:text-indigo-600 transition-colors">
               <PenTool className="w-6 h-6 mb-0.5" />
               创作
           </Link>
      </div>
    </div>
  );
};

export default Layout;