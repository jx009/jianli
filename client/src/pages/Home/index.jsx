import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="ant-layout-content" style={{ minHeight: 'calc(100vh - 118px)' }}>
      <div className="hero-section" style={{ 
          textAlign: 'center', 
          padding: '120px 0 80px',
          backgroundImage: 'url(/static/topBg.3604cadd.svg)', 
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center top',
          backgroundSize: 'contain'
      }}>
        <h1 style={{ fontSize: 48, fontWeight: 600, marginBottom: 24, color: '#333' }}>
          写简历从未如此简单
        </h1>
        <p style={{ fontSize: 20, color: '#666', marginBottom: 48 }}>
          1 分钟生成精美的个人简历，写简历从未如此简单 - 老鱼简历
        </p>
        <div>
          <Link to="/templates">
            <Button type="primary" size="large" shape="round" style={{ height: 52, padding: '0 40px', fontSize: 18, background: '#24be58', borderColor: '#24be58' }}>
              免费制作简历
            </Button>
          </Link>
        </div>
        <div style={{ marginTop: 60 }}>
            <img src="/static/UXfKqrTp-laoyujianli-article.webp" alt="Demo" style={{ maxWidth: '80%', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', borderRadius: 8 }} />
        </div>
      </div>
      
      <div className="feature-section" style={{ padding: '80px 0', background: '#fff', textAlign: 'center' }}>
          <h2 style={{ fontSize: 32, marginBottom: 60 }}>为什么选择我们</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, maxWidth: 1200, margin: '0 auto' }}>
              {[
                  { title: '海量模板', desc: '各行各业，应有尽有' },
                  { title: '极速生成', desc: '所见即所得，一键导出' },
                  { title: '完全免费', desc: '致力打造最好用的免费简历工具' }
              ].map((item, index) => (
                  <div key={index} style={{ width: 300, padding: 30, borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                      <h3 style={{ fontSize: 20, marginBottom: 16 }}>{item.title}</h3>
                      <p style={{ color: '#888' }}>{item.desc}</p>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};

export default Home;