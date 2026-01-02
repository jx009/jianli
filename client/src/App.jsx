import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import TemplateCenter from './pages/TemplateCenter';
import Editor from './pages/Editor';
import Navbar from './components/Layout/Navbar';

// Layout with Navbar
const MainLayout = () => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <Navbar />
    <div style={{ flex: 1 }}>
      <Outlet />
    </div>
    <footer style={{ textAlign: 'center', padding: '40px', color: '#999', background: '#fafafa', borderTop: '1px solid #eee' }}>
        © 2026 灵感简历 | 助你轻松斩获 Offer
    </footer>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pages with Navbar */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/templates" element={<TemplateCenter />} />
          <Route path="/dashboard" element={<Home />} /> {/* Reuse Home logic which switches to Dashboard view */}
        </Route>

        {/* Editor (Standalone, Fullscreen) */}
        <Route path="/editor/:id" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;