import React from 'react';
import { Tabs, message, ColorPicker, Slider, Divider, Badge } from 'antd';
import { 
  AppstoreAddOutlined, 
  ReadOutlined,
  IdcardOutlined,
  ProjectOutlined,
  RocketOutlined,
  LikeOutlined,
  TrophyOutlined,
  TeamOutlined,
  GlobalOutlined,
  CheckCircleFilled
} from '@ant-design/icons';
import useResumeStore from '../../../store/useResumeStore';

// --- Icon Helpers ---
const getIcon = (name) => {
    const map = {
        '教育经历': <ReadOutlined />,
        '工作经历': <IdcardOutlined />,
        '项目经验': <ProjectOutlined />,
        '专业技能': <RocketOutlined />,
        '自我评价': <LikeOutlined />,
        '荣誉奖项': <TrophyOutlined />,
        '志愿服务': <TeamOutlined />,
        '社交主页': <GlobalOutlined />
    };
    return map[name] || <AppstoreAddOutlined />;
};

// --- CSS Miniatures for Templates (The "High-End" look) ---
const TemplateThumbnail = ({ type, selected }) => {
    const border = selected ? '2px solid #24be58' : '1px solid #e0e0e0';
    const shadow = selected ? '0 4px 12px rgba(36, 190, 88, 0.2)' : '0 2px 4px rgba(0,0,0,0.05)';
    
    // Mini CSS Drawings
    const ClassicMini = () => (
        <div style={{ width: '100%', height: '100%', padding: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ height: 8, width: '40%', background: '#333', borderRadius: 2 }}></div>
            <div style={{ height: 4, width: '100%', borderBottom: '1px solid #24be58', marginBottom: 2 }}></div>
            <div style={{ height: 4, width: '80%', background: '#e0e0e0', borderRadius: 2 }}></div>
            <div style={{ height: 4, width: '90%', background: '#e0e0e0', borderRadius: 2 }}></div>
            <div style={{ marginTop: 4, height: 4, width: '30%', background: '#24be58', borderRadius: 2 }}></div>
            <div style={{ height: 20, width: '100%', background: '#f5f5f5', borderRadius: 2 }}></div>
        </div>
    );

    const LeftRightMini = () => (
        <div style={{ width: '100%', height: '100%', display: 'flex' }}>
            <div style={{ width: '35%', background: '#333', height: '100%', padding: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
                 <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#555', alignSelf: 'center', marginBottom: 2 }}></div>
                 <div style={{ height: 2, width: '80%', background: '#666', alignSelf: 'center' }}></div>
                 <div style={{ height: 2, width: '60%', background: '#666', alignSelf: 'center' }}></div>
            </div>
            <div style={{ width: '65%', height: '100%', background: '#fff', padding: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
                 <div style={{ height: 4, width: '90%', borderBottom: '1px solid #333' }}></div>
                 <div style={{ height: 12, width: '100%', background: '#f0f0f0' }}></div>
                 <div style={{ height: 12, width: '100%', background: '#f0f0f0' }}></div>
            </div>
        </div>
    );

    const MinimalMini = () => (
        <div style={{ width: '100%', height: '100%', padding: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
             <div style={{ height: 6, width: '50%', background: '#000' }}></div>
             <div style={{ height: 2, width: '30%', background: '#999', marginBottom: 4 }}></div>
             <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-start' }}>
                 <div style={{ height: 4, width: '20%', background: '#000' }}></div>
                 <div style={{ height: 2, width: '100%', background: '#eee' }}></div>
                 <div style={{ height: 2, width: '100%', background: '#eee' }}></div>
             </div>
        </div>
    );

    return (
        <div style={{ 
            width: '100%', aspectRatio: '210/297', background: '#fff', borderRadius: 8, 
            border, boxShadow: shadow, overflow: 'hidden', position: 'relative', transition: 'all 0.2s',
            cursor: 'pointer'
        }}>
            {selected && <div style={{ position: 'absolute', top: 4, right: 4, color: '#24be58' }}><CheckCircleFilled /></div>}
            {type === 'classic' && <ClassicMini />}
            {type === 'leftRight' && <LeftRightMini />}
            {type === 'minimal' && <MinimalMini />}
        </div>
    );
};

// --- Config Tabs ---

const TemplateSelector = () => {
    const { resume, updateConfig } = useResumeStore();
    const currentId = resume.config.templateId || 'classic';

    const templates = [
        { id: 'classic', name: '经典通用', desc: 'HR最爱，清晰稳重' },
        { id: 'leftRight', name: '左右分栏', desc: '设计师/技术大牛首选' },
        { id: 'minimal', name: '极简黑白', desc: '高端大气，回归内容' },
    ];

    return (
        <div style={{ padding: 16 }}>
            <div style={{ marginBottom: 16, color: '#888', fontSize: 13 }}>选择简历布局</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {templates.map(t => (
                    <div key={t.id} onClick={() => updateConfig('templateId', t.id)}>
                        <TemplateThumbnail type={t.id} selected={currentId === t.id} />
                        <div style={{ marginTop: 8, textAlign: 'center' }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: currentId === t.id ? '#24be58' : '#333' }}>{t.name}</div>
                            <div style={{ fontSize: 11, color: '#999', transform: 'scale(0.9)' }}>{t.desc}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ThemeConfig = () => {
    const { resume, updateConfig } = useResumeStore();
    const { config } = resume;
    const presetColors = ['#24be58', '#1890ff', '#f5222d', '#722ed1', '#fa8c16', '#2f54eb', '#000000', '#595959'];

    return (
        <div style={{ padding: 24 }}>
             <div style={{ marginBottom: 32 }}>
                <h4 style={{ marginBottom: 12, fontSize: 13, color: '#666' }}>主题色</h4>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
                    {presetColors.map(color => (
                        <div key={color} onClick={() => updateConfig('themeColor', color)} style={{ width: 24, height: 24, borderRadius: 4, background: color, cursor: 'pointer', border: config.themeColor === color ? '2px solid #333' : '1px solid #ddd' }} />
                    ))}
                </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12 }}>自定义:</span>
                    <ColorPicker value={config.themeColor} onChange={(val) => updateConfig('themeColor', val.toHexString())} size="small"/>
                 </div>
            </div>
            <Divider style={{ margin: '20px 0' }} />
            <div>
                <h4 style={{ marginBottom: 12, fontSize: 13, color: '#666' }}>间距与行高</h4>
                <Slider min={10} max={50} value={config.moduleMargin} onChange={(val) => updateConfig('moduleMargin', val)} style={{marginBottom: 20}} />
                <Slider min={1.0} max={2.2} step={0.1} value={config.lineHeight} onChange={(val) => updateConfig('lineHeight', val)} />
            </div>
        </div>
    );
};

const ModuleList = () => {
    const addModule = useResumeStore(state => state.addModule);
    const handleAdd = (item) => {
        let type = 'list';
        if (item === '个人总结' || item === '自我评价') type = 'text';
        addModule(type, item);
        message.success(`已添加 ${item}`);
    };

    const modules = ['教育经历', '工作经历', '项目经验', '专业技能', '自我评价', '荣誉奖项', '志愿服务', '社交主页'];

    return (
        <div style={{ padding: 16 }}>
            <div style={{ marginBottom: 16, color: '#888', fontSize: 13 }}>点击添加模块</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {modules.map(item => (
                <div key={item} onClick={() => handleAdd(item)} className="module-card-btn" style={{ border: '1px solid #f0f0f0', padding: '16px 10px', textAlign: 'center', borderRadius: 8, cursor: 'pointer', background: '#fff', fontSize: 13, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
                    <div style={{ fontSize: 20, color: '#555' }}>{getIcon(item)}</div>
                    <span style={{ fontWeight: 500 }}>{item}</span>
                </div>
            ))}
            </div>
        </div>
    );
};

// --- Main Sidebar Component ---
const ModuleSelector = () => {
  const items = [
    { key: 'templates', label: '🗂 模板', children: <TemplateSelector /> },
    { key: 'modules', label: '📝 模块', children: <ModuleList /> },
    { key: 'theme', label: '🎨 样式', children: <ThemeConfig /> },
  ];

  return (
    <div style={{ height: '100%', paddingTop: 6 }}>
      <Tabs defaultActiveKey="templates" items={items} centered size="middle" tabBarStyle={{ margin: 0, borderBottom: '1px solid #f0f0f0' }} />
    </div>
  );
};

export default ModuleSelector;
