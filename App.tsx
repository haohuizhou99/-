import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import NovelDetail from './pages/NovelDetail';
import Reader from './pages/Reader';
import Library from './pages/Library';
import Dashboard from './pages/author/Dashboard';
import NovelManager from './pages/author/NovelManager';
import Editor from './pages/author/Editor';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Author Routes (No Layout or Different Layout could apply, but using main for simplicity) */}
        
        {/* Editor specifically needs full screen, so we might exclude Layout or handle it inside */}
        <Route path="/read/:novelId/:chapterId" element={<Reader />} />
        
        <Route path="/author/novel/:novelId/chapter/:chapterId" element={
            <div className="bg-slate-50 min-h-screen p-4">
                 <Editor />
            </div>
        } />

        {/* Main Routes with Layout */}
        <Route path="*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/library" element={<Library />} />
              <Route path="/novel/:id" element={<NovelDetail />} />
              
              {/* Author Dashboard Routes */}
              <Route path="/author" element={<Dashboard />} />
              <Route path="/author/novel/:id" element={<NovelManager />} />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </HashRouter>
  );
};

export default App;