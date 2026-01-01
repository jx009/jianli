import React from 'react';
import { Button, Card, Row, Col } from 'antd';
import { Link } from 'react-router-dom';

const templates = [
  { id: 1, title: '高端大气简历模板', cover: '/static/ar60udDP-【双栏】高端大气简历模板 (1).jpg' },
  { id: 2, title: '创意求职简历模板', cover: '/static/oE0EDD99-【双栏】创意求职简历模板 (1).jpg' },
  { id: 3, title: '极简风格简历模板', cover: '/static/3kWvv2dx-【双栏】极简风格简历模板 (1).jpg' },
  { id: 4, title: '靠左风格简历模板', cover: '/static/264SKR6X-【双栏】靠左风格简历模板 (1).jpg' },
  { id: 5, title: '黑白极简简历模板', cover: '/static/mJTKCCGS-黑白极简简历模板 (1).jpg' },
  { id: 6, title: '通用型简历模板', cover: '/static/MO2tY4DI-黑白极简简历模板 (1).jpg' },
];

const Template = () => {
  return (
    <div style={{ padding: '40px 20px', maxWidth: 1200, margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 40, fontSize: 28 }}>简历模板大全</h2>
      <Row gutter={[24, 24]}>
        {templates.map(tpl => (
          <Col key={tpl.id} xs={24} sm={12} md={8} lg={6}>
            <div className="template-card" style={{ position: 'relative', overflow: 'hidden', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'all 0.3s' }}>
                <div style={{ position: 'relative', paddingTop: '141%' }}>
                    <img 
                        src={tpl.cover} 
                        alt={tpl.title} 
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                    <div className="overlay" style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        opacity: 0, transition: 'opacity 0.3s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0}
                    >
                        <Link to={`/editor/${tpl.id}`}>
                            <Button type="primary" shape="round" style={{ background: '#24be58', borderColor: '#24be58' }}>使用模板</Button>
                        </Link>
                    </div>
                </div>
                <div style={{ padding: 12, textAlign: 'center', background: '#fff' }}>
                    <div style={{ fontSize: 14, color: '#333' }}>{tpl.title}</div>
                </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Template;