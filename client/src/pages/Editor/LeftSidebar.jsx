import React from 'react';
import { Button } from 'antd';
import { UserOutlined, FileTextOutlined, ProjectOutlined, TrophyOutlined, ToolOutlined } from '@ant-design/icons';
import useResumeStore from '../../store/useResumeStore';

const MODULE_TYPES = [
  { type: 'baseInfo', title: '个人信息', icon: <UserOutlined /> },
  { type: 'list', title: '教育经历', icon: <FileTextOutlined /> },
  { type: 'list', title: '工作经历', icon: <ProjectOutlined /> },
  { type: 'list', title: '项目经历', icon: <TrophyOutlined /> },
  { type: 'text', title: '专业技能', icon: <ToolOutlined /> },
  { type: 'text', title: '自我评价', icon: <UserOutlined /> },
];

const LeftSidebar = () => {
  const { addModule } = useResumeStore();

  return (
    <div style={{
      height: '100%',
      width: '100%',
      backgroundColor: '#fff',
      padding: '20px 10px',
    }}>
      <div className="aside-content">
        <div className="table-bar" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, padding: '0 8px' }}>
          <span className="ant-typography" style={{ fontWeight: 'bold' }}><strong>模块选择</strong></span>
        </div>
        
        {MODULE_TYPES.map((item, index) => (
          <div key={index} className="aside-item" onClick={() => addModule(item.type)} style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            cursor: 'pointer',
            transition: 'background 0.3s',
            borderRadius: 4,
            marginBottom: 4,
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div className="left" style={{ display: 'flex', alignItems: 'center', color: '#333' }}>
              <span style={{ fontSize: 20, marginRight: 8, color: '#c4c4c4' }}>{item.icon}</span>
              <span style={{ fontSize: 14 }}>{item.title}</span>
            </div>
            <div className="right" style={{ marginLeft: 'auto', color: '#24be58', fontSize: 12 }}>
                添加
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftSidebar;