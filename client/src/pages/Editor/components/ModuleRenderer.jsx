import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import useResumeStore from '../../../store/useResumeStore';
import { Input } from 'antd';

const BaseInfo = ({ data, onChange }) => {
  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 20 }}>
      <div style={{ flex: 1 }}>
        <Input 
            value={data.name} 
            onChange={e => onChange({ name: e.target.value })} 
            style={{ fontSize: 24, fontWeight: 'bold', border: 'none', padding: 0, background: 'transparent' }} 
            placeholder="姓名"
        />
        <div style={{ display: 'flex', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
            <Input value={data.mobile} onChange={e => onChange({ mobile: e.target.value })} style={{ width: 120 }} placeholder="电话" bordered={false} />
            <Input value={data.email} onChange={e => onChange({ email: e.target.value })} style={{ width: 180 }} placeholder="邮箱" bordered={false} />
            <Input value={data.city} onChange={e => onChange({ city: e.target.value })} style={{ width: 80 }} placeholder="城市" bordered={false} />
        </div>
      </div>
      <div style={{ width: 100, height: 120, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          照片
      </div>
    </div>
  );
};

const ListModule = ({ title, data, onChange, color }) => {
  return (
    <div className="module-item">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10, borderBottom: `2px solid ${color}`, paddingBottom: 5 }}>
        <h3 style={{ margin: 0, color: color }}>{title}</h3>
      </div>
      {data.map((item, index) => (
        <div key={item.id || index} style={{ marginBottom: 15 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>{item.title}</span>
                <span>{item.date}</span>
            </div>
            <div style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>{item.subtitle}</div>
            <div style={{ whiteSpace: 'pre-wrap' }}>{item.desc}</div>
        </div>
      ))}
    </div>
  );
};

const ModuleRenderer = ({ module }) => {
  const { updateModule, resume } = useResumeStore();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: module.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: resume.config.moduleMargin,
    position: 'relative',
    cursor: 'default' // Default cursor, handle has grab
  };

  const handleChange = (newData) => {
    updateModule(module.id, { data: { ...module.data, ...newData } });
  };

  const renderContent = () => {
    switch (module.type) {
      case 'baseInfo':
        return <BaseInfo data={module.data} onChange={handleChange} />;
      case 'list':
        return <ListModule title={module.title} data={module.data} onChange={handleChange} color={resume.config.themeColor} />;
      default:
        return <div>Unknown Module</div>;
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {/* Drag Handle Overlay or similar could go here, for now applying listeners to wrapper might interfere with inputs */}
      {/* Better UX: A small handle on the side */}
      <div {...listeners} style={{ position: 'absolute', left: -30, top: 0, padding: 5, cursor: 'grab', opacity: 0.2 }}>
         :::
      </div>
      {renderContent()}
    </div>
  );
};

export default ModuleRenderer;
