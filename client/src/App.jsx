import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import Template from './pages/Template';
import Editor from './pages/Editor';
import Dashboard from './pages/Dashboard';
import Preview from './pages/Preview';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';

// Layout component for standard pages
const MainLayout = () => (
  <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Header />
    <div style={{ flex: 1 }}>
      <Outlet />
    </div>
    <Footer />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Preview Route (No Layout) */}
        <Route path="/preview/:id" element={<Preview />} />

        {/* Main Application Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/templates" element={<Template />} />
          <Route path="/editor/:id" element={<Editor />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
