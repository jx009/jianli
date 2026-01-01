import React from 'react';
import { Button } from 'antd';
import useResumeStore from '../../store/useResumeStore';
import { PlusOutlined, DeleteOutlined, HolderOutlined } from '@ant-design/icons';

const Sidebar = () => {
  const { resume, addModule, removeModule } = useResumeStore();

  return (
    <div style={{ padding: 20 }}>
      <h3>模块管理</h3>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        <Button onClick={() => addModule('list')} icon={<PlusOutlined />}>列表模块</Button>
        <Button onClick={() => addModule('text')} icon={<PlusOutlined />}>文本模块</Button>
      </div>
      
      <div className="module-list">
        {resume.modules.map(module => (
          <div key={module.id} style={{ 
            padding: '10px', 
            marginBottom: 8, 
            background: '#f5f5f5', 
            borderRadius: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span><HolderOutlined style={{ marginRight: 8, color: '#999' }} />{module.title}</span>
            <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
                onClick={() => removeModule(module.id)} 
                size="small"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
