import React, { useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import useResumeStore from '../../../store/useResumeStore';
import { Button, Popconfirm, Tooltip } from 'antd';
import { DeleteOutlined, DragOutlined, PlusOutlined, FormOutlined } from '@ant-design/icons';
import ContentEditable from 'react-contenteditable';

// ----------------------------------------------------------------------
// 1. 基础信息模块 (BaseInfo) - 复刻原站 .base-info 结构
// ----------------------------------------------------------------------
const BaseInfo = ({ data, onChange, themeColor }) => {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="resume-item base-info" style={{ padding: '30px 40px 10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, paddingRight: '20px' }}>
          {/* 姓名 */}
          <div style={{ marginBottom: '15px' }}>
            <ContentEditable
              className="user-name"
              html={data.name}
              disabled={false}
              onChange={(e) => handleChange('name', e.target.value)}
              tagName="h1"
              style={{ 
                fontSize: '32px', 
                fontWeight: '600', 
                color: '#333', 
                marginBottom: '5px',
                lineHeight: '1.2',
                letterSpacing: '2px'
              }}
            />
          </div>

          {/* 求职意向 */}
          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#666', marginRight: '10px' }}>求职意向：</span>
            <ContentEditable
              className="job-target"
              html={data.job}
              disabled={false}
              onChange={(e) => handleChange('job', e.target.value)}
              tagName="span"
              style={{ 
                fontSize: '15px', 
                color: '#333', 
                borderBottom: '1px solid transparent',
                minWidth: '100px',
                display: 'inline-block'
              }}
            />
          </div>

          {/* 基础信息行 (电话、邮箱、城市、年龄) */}
          <div className="info-labels" style={{ display: 'flex', flexWrap: 'wrap', gap: '25px', fontSize: '13px', color: '#666' }}>
            <div className="info-block" style={{ display: 'flex', alignItems: 'center' }}>
               <span className="icon" style={{ marginRight: '5px' }}>📞</span>
               <ContentEditable html={data.mobile} onChange={e => handleChange('mobile', e.target.value)} tagName="span" />
            </div>
            <div className="info-block" style={{ display: 'flex', alignItems: 'center' }}>
               <span className="icon" style={{ marginRight: '5px' }}>✉️</span>
               <ContentEditable html={data.email} onChange={e => handleChange('email', e.target.value)} tagName="span" />
            </div>
            <div className="info-block" style={{ display: 'flex', alignItems: 'center' }}>
               <span className="icon" style={{ marginRight: '5px' }}>📍</span>
               <ContentEditable html={data.city} onChange={e => handleChange('city', e.target.value)} tagName="span" />
            </div>
            <div className="info-block" style={{ display: 'flex', alignItems: 'center' }}>
               <span className="icon" style={{ marginRight: '5px' }}>🎂</span>
               <ContentEditable html={data.age} onChange={e => handleChange('age', e.target.value)} tagName="span" />
            </div>
          </div>
        </div>

        {/* 头像 */}
        <div className="user-avatar" style={{ 
            width: '100px', 
            height: '130px', 
            backgroundColor: '#f2f2f2', 
            backgroundImage: data.avatar ? `url(${data.avatar})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#aaa',
            fontSize: '12px',
            cursor: 'pointer',
            border: '1px dashed #e0e0e0'
        }}>
            {!data.avatar && <span>上传照片</span>}
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// 2. 列表模块 (ListModule) - 教育、工作、项目
// ----------------------------------------------------------------------
const ListModule = ({ title, data, onChange, color }) => {
  const updateItem = (index, field, value) => {
    const newData = [...data];
    newData[index][field] = value;
    onChange(newData);
  };

  const addItem = () => {
    onChange([...data, { 
      id: Date.now(), 
      title: '组织名称', 
      subtitle: '职位/角色', 
      date: '20xx.xx - 20xx.xx', 
      desc: '在这里输入详细描述...' 
    }]);
  };

  const deleteItem = (index) => {
    const newData = [...data];
    newData.splice(index, 1);
    onChange(newData);
  };

  return (
    <div className="resume-item list-module" style={{ padding: '0 40px 10px' }}>
      {/* 模块标题 */}
      <div className="section-title" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          borderBottom: `1px solid ${color}`, 
          paddingBottom: '8px', 
          marginBottom: '15px' 
      }}>
        <span className="title-icon" style={{ 
            width: '24px', 
            height: '24px', 
            backgroundColor: color, 
            color: '#fff', 
            borderRadius: '50%', 
            textAlign: 'center', 
            lineHeight: '24px', 
            fontSize: '14px', 
            marginRight: '10px',
            fontWeight: 'bold'
        }}>
            {title.charAt(0)}
        </span>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: color }}>{title}</h3>
      </div>

      {/* 列表内容 */}
      {data.map((item, index) => (
        <div key={index} className="list-item-row" style={{ marginBottom: '20px', position: 'relative' }}>
          
          {/* 第一行：主标题 + 日期 */}
          <div className="row-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <ContentEditable
              html={item.title}
              onChange={e => updateItem(index, 'title', e.target.value)}
              tagName="div"
              style={{ fontSize: '15px', fontWeight: 'bold', color: '#333', minWidth: '150px' }}
            />
            <ContentEditable
              html={item.date}
              onChange={e => updateItem(index, 'date', e.target.value)}
              tagName="div"
              style={{ fontSize: '14px', color: '#666', textAlign: 'right' }}
            />
          </div>

          {/* 第二行：副标题 */}
          <div className="row-subheader" style={{ marginBottom: '8px' }}>
            <ContentEditable
              html={item.subtitle}
              onChange={e => updateItem(index, 'subtitle', e.target.value)}
              tagName="div"
              style={{ fontSize: '14px', color: '#333', fontWeight: '500' }}
            />
          </div>

          {/* 第三行：详情描述 */}
          <div className="row-desc">
            <ContentEditable
              html={item.desc}
              onChange={e => updateItem(index, 'desc', e.target.value)}
              tagName="div"
              style={{ 
                  fontSize: '14px', 
                  color: '#555', 
                  lineHeight: '1.7', 
                  whiteSpace: 'pre-wrap',
                  textAlign: 'justify' 
              }}
            />
          </div>

          {/* 悬浮操作项 */}
          <div className="item-ops" style={{ position: 'absolute', right: '-25px', top: '0', opacity: 0, transition: 'opacity 0.2s' }}>
             <Tooltip title="删除此条">
                <DeleteOutlined onClick={() => deleteItem(index)} style={{ color: '#ff4d4f', cursor: 'pointer' }} />
             </Tooltip>
          </div>
          <style>{` .list-item-row:hover .item-ops { opacity: 1 !important; } `}</style>
        </div>
      ))}

      {/* 底部添加按钮 */}
      <div className="add-btn-wrapper" style={{ textAlign: 'center', marginTop: '10px', opacity: 0, transition: 'opacity 0.2s' }}>
          <Button type="dashed" size="small" icon={<PlusOutlined />} onClick={addItem} style={{ color: color, borderColor: color }}>
              添加一条
          </Button>
      </div>
      <style>{` .list-module:hover .add-btn-wrapper { opacity: 1 !important; } `}</style>
    </div>
  );
};

// ----------------------------------------------------------------------
// 3. 文本模块 (TextModule) - 技能、评价
// ----------------------------------------------------------------------
const TextModule = ({ title, data, onChange, color }) => {
    return (
      <div className="resume-item text-module" style={{ padding: '0 40px 10px' }}>
        <div className="section-title" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            borderBottom: `1px solid ${color}`, 
            paddingBottom: '8px', 
            marginBottom: '15px' 
        }}>
          <span className="title-icon" style={{ 
              width: '24px', 
              height: '24px', 
              backgroundColor: color, 
              color: '#fff', 
              borderRadius: '50%', 
              textAlign: 'center', 
              lineHeight: '24px', 
              fontSize: '14px', 
              marginRight: '10px',
              fontWeight: 'bold'
          }}>
              {title.charAt(0)}
          </span>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: color }}>{title}</h3>
        </div>
        
        <div className="text-content">
            <ContentEditable
                html={data.content}
                onChange={e => onChange({ content: e.target.value })}
                tagName="div"
                style={{ 
                    fontSize: '14px', 
                    color: '#555', 
                    lineHeight: '1.8', 
                    whiteSpace: 'pre-wrap', 
                    minHeight: '60px',
                    textAlign: 'justify'
                }}
            />
        </div>
      </div>
    );
};

// ----------------------------------------------------------------------
// 主渲染入口
// ----------------------------------------------------------------------
const ModuleRenderer = ({ module }) => {
  const { updateModule, resume, removeModule } = useResumeStore();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: module.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: `${resume.config.moduleMargin}px`,
    position: 'relative',
    opacity: isDragging ? 0.4 : 1,
    cursor: 'default' // 内容区默认鼠标
  };

  const handleChange = (newData) => {
    updateModule(module.id, { data: newData });
  };

  const renderContent = () => {
    switch (module.type) {
      case 'baseInfo':
        return <BaseInfo data={module.data} onChange={handleChange} themeColor={resume.config.themeColor} />;
      case 'list':
        return <ListModule title={module.title} data={module.data} onChange={handleChange} color={resume.config.themeColor} />;
      case 'text':
        return <TextModule title={module.title} data={module.data} onChange={handleChange} color={resume.config.themeColor} />;
      default:
        return null;
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="module-container">
      {/* 侧边操作栏 - 仅 Hover 显示 */}
      <div className="module-toolbar" style={{
          position: 'absolute',
          left: '-45px',
          top: '0',
          width: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          paddingTop: '10px',
          opacity: 0,
          transition: 'opacity 0.2s',
          zIndex: 10
      }}>
          {/* 拖拽手柄 */}
          <div {...attributes} {...listeners} className="tool-btn drag-btn" style={{ cursor: 'grab' }}>
              <DragOutlined style={{ fontSize: '16px', color: '#666' }} />
          </div>
          
          {/* 编辑标题 (暂留接口) */}
          <div className="tool-btn edit-btn" style={{ cursor: 'pointer' }}>
             <FormOutlined style={{ fontSize: '16px', color: '#666' }} />
          </div>

          {/* 删除 */}
          <Popconfirm title="确定删除该模块？" onConfirm={() => removeModule(module.id)} okText="确定" cancelText="取消">
            <div className="tool-btn delete-btn" style={{ cursor: 'pointer' }}>
                <DeleteOutlined style={{ fontSize: '16px', color: '#ff4d4f' }} />
            </div>
          </Popconfirm>
      </div>

      {/* 模块内容区 - 增加一个透明边框用于 Hover 高亮 */}
      <div className="module-content-wrapper" style={{
          border: '1px dashed transparent',
          borderRadius: '4px',
          transition: 'all 0.2s'
      }}>
        {renderContent()}
      </div>

      {/* 注入局部样式 */}
      <style>{`
        .module-container:hover .module-toolbar {
            opacity: 1 !important;
        }
        .module-container:hover .module-content-wrapper {
            border-color: ${resume.config.themeColor}80 !important;
            background-color: ${resume.config.themeColor}05;
        }
        .tool-btn {
            width: 32px; 
            height: 32px; 
            background: #fff; 
            border-radius: 50%; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.1); 
            display: flex; 
            align-items: center; 
            justify-content: center;
        }
        .tool-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
};

export default ModuleRenderer;
