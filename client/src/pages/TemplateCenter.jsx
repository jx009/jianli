import React from 'react';
import { Button, Tag } from 'antd';
import { CheckCircleFilled, ThunderboltFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- Reusing the Mini-Drawings but Scaled Up ---
const TemplatePreview = ({ type }) => {
    const scale = 1.5;
    
    const ClassicMini = () => (
        <div style={{ width: '100%', height: '100%', padding: 12, display: 'flex', flexDirection: 'column', gap: 8, background: '#fff' }}>
            <div style={{ height: 16, width: '40%', background: '#333', borderRadius: 2 }}></div>
            <div style={{ height: 6, width: '100%', borderBottom: '2px solid #24be58', marginBottom: 4 }}></div>
            <div style={{ height: 6, width: '80%', background: '#e0e0e0', borderRadius: 2 }}></div>
            <div style={{ height: 6, width: '90%', background: '#e0e0e0', borderRadius: 2 }}></div>
            <div style={{ marginTop: 8, height: 6, width: '30%', background: '#24be58', borderRadius: 2 }}></div>
            <div style={{ height: 40, width: '100%', background: '#f5f5f5', borderRadius: 2 }}></div>
            <div style={{ marginTop: 8, height: 6, width: '30%', background: '#24be58', borderRadius: 2 }}></div>
            <div style={{ height: 40, width: '100%', background: '#f5f5f5', borderRadius: 2 }}></div>
        </div>
    );

    const LeftRightMini = () => (
        <div style={{ width: '100%', height: '100%', display: 'flex', background: '#fff' }}>
            <div style={{ width: '35%', background: '#2c3e50', height: '100%', padding: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                 <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', alignSelf: 'center', marginBottom: 4 }}></div>
                 <div style={{ height: 4, width: '80%', background: 'rgba(255,255,255,0.4)', alignSelf: 'center' }}></div>
                 <div style={{ height: 4, width: '60%', background: 'rgba(255,255,255,0.4)', alignSelf: 'center' }}></div>
                 <div style={{ marginTop: 10, height: 2, width: '100%', background: 'rgba(255,255,255,0.1)' }}></div>
            </div>
            <div style={{ width: '65%', height: '100%', padding: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                 <div style={{ height: 6, width: '90%', borderBottom: '2px solid #2c3e50' }}></div>
                 <div style={{ height: 24, width: '100%', background: '#f0f0f0' }}></div>
                 <div style={{ height: 6, width: '90%', borderBottom: '2px solid #2c3e50', marginTop: 8 }}></div>
                 <div style={{ height: 24, width: '100%', background: '#f0f0f0' }}></div>
            </div>
        </div>
    );

    const MinimalMini = () => (
        <div style={{ width: '100%', height: '100%', padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: '#fff' }}>
             <div style={{ height: 12, width: '50%', background: '#000' }}></div>
             <div style={{ height: 4, width: '30%', background: '#999', marginBottom: 8 }}></div>
             <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
                 <div style={{ height: 6, width: '20%', background: '#000' }}></div>
                 <div style={{ height: 4, width: '100%', background: '#eee' }}></div>
                 <div style={{ height: 4, width: '100%', background: '#eee' }}></div>
                 <div style={{ height: 4, width: '100%', background: '#eee' }}></div>
             </div>
        </div>
    );

    return (
        <div style={{ width: '100%', aspectRatio: '210/297', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
            {type === 'classic' && <ClassicMini />}
            {type === 'leftRight' && <LeftRightMini />}
            {type === 'minimal' && <MinimalMini />}
        </div>
    );
};

import { DEFAULT_MODULES, DEFAULT_CONFIG } from '../store/useResumeStore';

const TemplateCenter = () => {
  const navigate = useNavigate();

  const handleUseTemplate = async (templateId) => {
    // Check login logic could be here, but for now we let Editor handle it or redirect to login
    const token = localStorage.getItem('token');
    if (!token) {
        // Create a temporary "new" resume for non-logged in users (or redirect to login)
        // For better UX, let's create a draft
        navigate(`/editor/new?template=${templateId}`);
        return;
    }
    
    try {
        // Create resume with specific template
        const res = await axios.post('/api/resumes', { 
            title: '我的简历', 
            content: { 
              config: { ...DEFAULT_CONFIG, templateId },
              modules: DEFAULT_MODULES
            }
        });
        navigate(`/editor/${res.data.id}`);
    } catch (error) {
        // If not logged in, just go to new editor
         navigate(`/editor/new?template=${templateId}`);
    }
  };

  const templates = [
      { 
          id: 'classic', 
          name: '经典通用版', 
          tags: ['HR推荐', '稳重', '国企'], 
          desc: '标准的上下结构布局，信息层级清晰，适合大多数求职场景，尤其是国企、事业单位。' 
      },
      { 
          id: 'leftRight', 
          name: '精英双栏版', 
          tags: ['设计师', '程序员', '时尚'], 
          desc: '左侧深色侧边栏展示个人信息，右侧展示详细经历。视觉冲击力强，适合创意类岗位。' 
      },
      { 
          id: 'minimal', 
          name: '极简黑白版', 
          tags: ['外企', '学术', '高端'], 
          desc: '去繁就简，无图标设计，依靠排版和留白体现质感。适合外企、学术研究或高端管理岗。' 
      }
  ];

  return (
    <div style={{ padding: '60px 20px', background: '#f8f9fa', minHeight: 'calc(100vh - 70px)' }}>
        <div className="container" style={{ maxWidth: 1000 }}>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
                <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16 }}>挑选你的简历模板</h1>
                <p style={{ fontSize: 18, color: '#666' }}>所有模板均由资深 HR 审核，助你提升 200% 面试通过率</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>
                {templates.map(t => (
                    <div key={t.id} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', transition: 'transform 0.3s', cursor: 'default' }} 
                         onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-8px)'}
                         onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        {/* Preview Area */}
                        <div style={{ background: '#eef2f5', padding: '40px 50px', display: 'flex', justifyContent: 'center' }}>
                            <div style={{ width: '100%', maxWidth: 220 }}>
                                <TemplatePreview type={t.id} />
                            </div>
                        </div>
                        
                        {/* Info Area */}
                        <div style={{ padding: 24 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <h3 style={{ margin: 0, fontSize: 18 }}>{t.name}</h3>
                                {t.id === 'classic' && <Tag color="green">热门</Tag>}
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                {t.tags.map(tag => <Tag key={tag} bordered={false} style={{ background: '#f5f5f5' }}>{tag}</Tag>)}
                            </div>
                            <p style={{ color: '#888', fontSize: 13, lineHeight: 1.6, height: 42, marginBottom: 24 }}>
                                {t.desc}
                            </p>
                            <Button 
                                type="primary" 
                                block 
                                size="large" 
                                icon={<ThunderboltFilled />} 
                                onClick={() => handleUseTemplate(t.id)}
                                style={{ background: '#24be58', borderColor: '#24be58', borderRadius: 8, fontWeight: 600, height: 44 }}
                            >
                                立即使用
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default TemplateCenter;
