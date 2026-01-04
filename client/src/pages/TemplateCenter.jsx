import React, { useRef, useEffect, useState } from 'react';
import { Button, Tag } from 'antd';
import { CheckCircleFilled, ThunderboltFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TEMPLATES } from '../templates';
import { DEFAULT_MODULES, DEFAULT_CONFIG } from '../store/useResumeStore';

// Mock Data for beautiful preview
const MOCK_DATA = {
    config: { ...DEFAULT_CONFIG, themeColor: '#24be58' },
    modules: [
        {
            id: 'base-info', type: 'baseInfo', data: {
                name: '李小明', job: '高级产品经理', mobile: '13812345678', email: 'hello@example.com', age: '28岁', city: '上海', avatar: ''
            }
        },
        {
            id: 'edu', type: 'list', title: '教育经历', data: [
                { id: '1', title: '复旦大学', subtitle: '软件工程 / 硕士', date: '2015-2018', desc: '主修课程：人机交互、系统架构设计。获得校一等奖学金。' }
            ]
        },
        {
            id: 'work', type: 'list', title: '工作经历', data: [
                { id: '1', title: '某知名互联网大厂', subtitle: '高级产品经理', date: '2020-至今', desc: '负责公司核心SaaS产品的规划与迭代，主导了版本重构，DAU提升了40%。' },
                { id: '2', title: '创新科技公司', subtitle: '产品专员', date: '2018-2020', desc: '从0到1孵化了内部工具平台，极大提升了研发效率。' }
            ]
        },
        {
            id: 'skill', type: 'text', title: '个人优势', data: {
                content: '1. 具备5年B端产品设计经验，熟悉SaaS商业模式。\n2. 擅长数据分析与用户调研，能敏锐洞察用户痛点。\n3. 优秀的团队协作与沟通能力。'
            }
        }
    ]
};

const ScaledPreviewWrapper = ({ TemplateComponent, themeColor }) => {
    // A4 ratio: 210mm / 297mm = 0.707
    // Container width: 100% (parent) -> we scale content to fit width
    const containerRef = useRef(null);
    const [scale, setScale] = useState(0.3);

    useEffect(() => {
        // Calculate scale based on container width vs A4 width (approx 794px at 96dpi)
        // Or simpler: fixed scale 0.35 fits well in small cards
        if(containerRef.current) {
            const width = containerRef.current.offsetWidth;
            setScale(width / 794); 
        }
    }, []);

    // Clone data to inject theme color specific to template
    const previewData = {
        ...MOCK_DATA,
        config: { ...MOCK_DATA.config, themeColor: themeColor || '#24be58' }
    };

    return (
        <div ref={containerRef} style={{ 
            width: '100%', 
            aspectRatio: '210/297', 
            background: '#fff', 
            borderRadius: 8, 
            overflow: 'hidden', 
            position: 'relative',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
            border: '1px solid #eee'
        }}>
            <div style={{
                width: '794px', // Standard A4 Width (px)
                height: '1123px', // Standard A4 Height (px)
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                pointerEvents: 'none', // Disable interaction
                backgroundColor: '#fff'
            }}>
                <TemplateComponent resume={previewData} />
            </div>
        </div>
    );
};

const TemplateCenter = () => {
  const navigate = useNavigate();

  const handleUseTemplate = async (templateId) => {
    const token = localStorage.getItem('token');
    if (!token) {
        navigate(`/editor/new?template=${templateId}`);
        return;
    }
    
    try {
        const res = await axios.post('/api/resumes', { 
            title: '我的简历', 
            content: { 
              config: { ...DEFAULT_CONFIG, templateId },
              modules: DEFAULT_MODULES
            }
        });
        navigate(`/editor/${res.data.id}`);
    } catch (error) {
         navigate(`/editor/new?template=${templateId}`);
    }
  };

  const templateList = [
      {
          id: 'classic', 
          name: '经典通用版', 
          tags: ['HR推荐', '稳重', '国企'], 
          desc: '标准的上下结构布局，信息层级清晰，适合大多数求职场景，尤其是国企、事业单位。',
          themeColor: '#24be58'
      },
      {
          id: 'modernHeader', 
          name: '现代商务版', 
          tags: ['互联网', '运营', '产品'], 
          desc: '顶部采用大面积色块展示个人信息，视觉焦点突出，既专业又不失设计感，适合互联网行业。',
          themeColor: '#1890ff' // Blue for this preview
      },
      {
          id: 'leftRight', 
          name: '精英双栏版', 
          tags: ['设计师', '程序员', '时尚'], 
          desc: '左侧深色侧边栏展示个人信息，右侧展示详细经历。视觉冲击力强，适合创意类岗位。',
          themeColor: '#2c3e50'
      },
      {
          id: 'minimal', 
          name: '极简黑白版', 
          tags: ['外企', '学术', '高端'], 
          desc: '去繁就简，无图标设计，依靠排版和留白体现质感。适合外企、学术研究或高端管理岗。',
          themeColor: '#000'
      }
  ];

  return (
    <div style={{ padding: '60px 20px', background: '#f8f9fa', minHeight: 'calc(100vh - 70px)' }}>
        <div className="container" style={{ maxWidth: 1000 }}>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
                <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16 }}>挑选你的简历模板</h1>
                <p style={{ fontSize: 18, color: '#666' }}>所有模板均由资深 HR 审核，助你提升 200% 面试通过率</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40 }}>
                {templateList.map(t => {
                    const TemplateConfig = TEMPLATES[t.id];
                    if (!TemplateConfig) return null;
                    const Component = TemplateConfig.component;

                    return (
                        <div key={t.id} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', transition: 'all 0.3s', cursor: 'default', border: '1px solid #eee' }} 
                             onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-8px)'}
                             onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            {/* Scaled Real Preview */}
                            <div style={{ background: '#f5f7fa', padding: '30px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', height: 320, overflow: 'hidden' }}>
                                <div style={{ width: '100%', maxWidth: 220 }}>
                                    <ScaledPreviewWrapper TemplateComponent={Component} themeColor={t.themeColor} />
                                </div>
                            </div>
                            
                            {/* Info Area */}
                            <div style={{ padding: 24 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                    <h3 style={{ margin: 0, fontSize: 18 }}>{t.name}</h3>
                                    {t.id === 'classic' && <Tag color="green">热门</Tag>}
                                </div>
                                <div style={{ marginBottom: 16 }}>
                                    {t.tags.map(tag => <Tag key={tag} bordered={false} style={{ background: '#f5f5f5', color: '#666' }}>{tag}</Tag>)}
                                </div>
                                <p style={{ color: '#888', fontSize: 13, lineHeight: 1.6, height: 42, marginBottom: 24, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
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
                    );
                })}
            </div>
        </div>
    </div>
  );
};

export default TemplateCenter;