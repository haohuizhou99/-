import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAppState, updateChapter } from '../../services/storage';
import { generateStoryContinuation, generateChapterOutline } from '../../services/geminiService';
import { Novel, Chapter } from '../../types';
import { Save, Sparkles, ArrowLeft, Upload, Clock } from 'lucide-react';

const Editor: React.FC = () => {
  const { novelId, chapterId } = useParams<{ novelId: string; chapterId?: string }>();
  const navigate = useNavigate();
  
  const [novel, setNovel] = useState<Novel | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiPromptType, setAiPromptType] = useState<'continue' | 'outline' | null>(null);

  useEffect(() => {
    if (!novelId) return;
    const state = getAppState();
    const foundNovel = state.novels.find(n => n.id === novelId);
    setNovel(foundNovel || null);

    if (chapterId && chapterId !== 'new') {
        const foundChapter = state.chapters.find(c => c.id === chapterId);
        if (foundChapter) {
            setTitle(foundChapter.title);
            setContent(foundChapter.content);
            setIsPublished(foundChapter.isPublished);
        }
    } else {
        // Prepare new chapter defaults
        const existingChapters = state.chapters.filter(c => c.novelId === novelId);
        setTitle(`第 ${existingChapters.length + 1} 章`);
    }
  }, [novelId, chapterId]);

  const handleSave = () => {
      if (!novelId) return;
      
      const newChapter: Chapter = {
          id: chapterId && chapterId !== 'new' ? chapterId : `c-${Date.now()}`,
          novelId,
          title,
          content,
          wordCount: content.trim().split(/\s+/).length,
          order: 999, // Simplified order logic for demo
          isPublished,
          publishedAt: isPublished ? Date.now() : undefined
      };
      
      updateChapter(newChapter);
      navigate(`/author/novel/${novelId}`);
  };

  const handleAiAssist = async () => {
      if (isAiLoading) return;
      setIsAiLoading(true);

      let result = '';
      if (aiPromptType === 'continue') {
          result = await generateStoryContinuation(content);
          if (result) setContent(prev => prev + '\n\n' + result);
      } else if (aiPromptType === 'outline') {
          result = await generateChapterOutline(title, novel?.description || '');
          if (result) setContent(prev => prev + '\n\n' + result);
      }

      setIsAiLoading(false);
      setAiPromptType(null);
  };

  if (!novel) return <div>加载中...</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      {/* Editor Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-4">
              <button onClick={() => navigate(`/author/novel/${novelId}`)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                  <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-xl font-bold text-slate-900 placeholder-slate-400 border-none focus:ring-0 p-0 bg-transparent w-full"
                    placeholder="章节标题"
                  />
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                      <span>{content.trim().split(/\s+/).length} 字</span>
                      <span>•</span>
                      <span className={isPublished ? 'text-green-600' : 'text-amber-600'}>
                          {isPublished ? '已发布' : '草稿'}
                      </span>
                  </div>
              </div>
          </div>

          <div className="flex items-center gap-3">
              <div className="relative">
                  <button 
                    onClick={() => setAiPromptType(aiPromptType ? null : 'continue')}
                    className="flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-sm font-medium transition-colors border border-purple-100"
                  >
                      <Sparkles className="w-4 h-4" /> AI 助手
                  </button>
                  {aiPromptType && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-100 p-1 z-50">
                          <button 
                            onClick={() => { setAiPromptType('continue'); handleAiAssist(); }}
                            className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md"
                          >
                              续写故事
                          </button>
                          <button 
                            onClick={() => { setAiPromptType('outline'); handleAiAssist(); }}
                            className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md"
                          >
                              生成大纲
                          </button>
                      </div>
                  )}
              </div>

              <button 
                onClick={() => setIsPublished(!isPublished)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isPublished ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                  {isPublished ? <Upload className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  {isPublished ? '已发布' : '草稿模式'}
              </button>

              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all"
              >
                  <Save className="w-4 h-4" /> 保存
              </button>
          </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative bg-white rounded-xl border border-slate-200 shadow-inner overflow-hidden">
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full p-8 resize-none outline-none font-serif text-lg leading-relaxed text-slate-800 placeholder-slate-300"
            placeholder="开始创作你的杰作..."
          />
          {isAiLoading && (
              <div className="absolute bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm animate-pulse">
                  <Sparkles className="w-4 h-4" /> 生成中...
              </div>
          )}
      </div>
    </div>
  );
};

export default Editor;