import React, { useState } from 'react';
import { Card, Button, Form, Input, Row, Col, Modal, Upload, message, Collapse } from 'antd';
import { 
    DeleteOutlined, 
    PlusOutlined, 
    DragOutlined,
    HolderOutlined,
    LoadingOutlined,
    PlusOutlined as UploadIcon,
    CaretRightOutlined,
    DownOutlined,
    UpOutlined
} from '@ant-design/icons';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import useResumeStore from '../../../store/useResumeStore';

const { TextArea } = Input;
const { Panel } = Collapse;

// Helper for cleaner inputs
const StyledInput = (props) => (
    <Input 
        {...props} 
        style={{ 
            borderRadius: 6, 
            padding: '6px 11px', 
            borderColor: '#e8e8e8',
            ...props.style 
        }} 
    />
);

// --- Sub Components ---

const BaseInfoForm = ({ moduleId, data }) => {
    const updateModuleData = useResumeStore(state => state.updateModuleData);
    const [loading, setLoading] = useState(false);

    const handleChange = (key, value) => updateModuleData(moduleId, { [key]: value });

    const handleUploadChange = (info) => {
        if (info.file.status === 'uploading') { setLoading(true); return; }
        if (info.file.status === 'done') {
            setLoading(false);
            updateModuleData(moduleId, { avatar: info.file.response.url });
            message.success('上传成功');
        } else if (info.file.status === 'error') {
            setLoading(false);
            message.error('上传失败');
        }
    };

    return (
        <Form layout="vertical" size="middle">
            <Row gutter={24}>
                <Col span={24} style={{ marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
                     <Upload
                        name="file"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action="/api/upload" 
                        onChange={handleUploadChange}
                        style={{ borderRadius: '50%' }} // Make it roundish
                    >
                        {data.avatar ? <img src={data.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} /> : (
                            <div>
                                {loading ? <LoadingOutlined /> : <UploadIcon />}
                                <div style={{ marginTop: 8, fontSize: 12 }}>上传照片</div>
                            </div>
                        )}
                    </Upload>
                </Col>

                <Col span={12}><Form.Item label="姓名"><StyledInput value={data.name} onChange={e => handleChange('name', e.target.value)} /></Form.Item></Col>
                <Col span={12}><Form.Item label="求职意向"><StyledInput value={data.job} onChange={e => handleChange('job', e.target.value)} /></Form.Item></Col>
                <Col span={12}><Form.Item label="手机号"><StyledInput value={data.mobile} onChange={e => handleChange('mobile', e.target.value)} /></Form.Item></Col>
                <Col span={12}><Form.Item label="邮箱"><StyledInput value={data.email} onChange={e => handleChange('email', e.target.value)} /></Form.Item></Col>
                <Col span={12}><Form.Item label="所在城市"><StyledInput value={data.city} onChange={e => handleChange('city', e.target.value)} /></Form.Item></Col>
                <Col span={12}><Form.Item label="年龄/生日"><StyledInput value={data.age} onChange={e => handleChange('age', e.target.value)} /></Form.Item></Col>
            </Row>
        </Form>
    );
};

const ListModuleForm = ({ moduleId, data }) => {
    const { updateListItem, addListItem, removeListItem } = useResumeStore();
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {data.map((item, idx) => (
                <div key={item.id} style={{ background: '#f9f9f9', padding: 16, borderRadius: 8, border: '1px solid #eee', position: 'relative' }}>
                    <Button type="text" danger icon={<DeleteOutlined />} size="small" style={{ position: 'absolute', right: 8, top: 8, zIndex: 1, opacity: 0.6 }} onClick={() => removeListItem(moduleId, item.id)} />
                    
                    <Form layout="vertical" size="small">
                        <Row gutter={16}>
                            <Col span={16}>
                                <Form.Item style={{marginBottom:8}} label="标题">
                                    <StyledInput style={{fontWeight:500}} value={item.title} onChange={e => updateListItem(moduleId, item.id, { title: e.target.value })} placeholder="例如：某某科技公司" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item style={{marginBottom:8}} label="时间">
                                    <StyledInput value={item.date} onChange={e => updateListItem(moduleId, item.id, { date: e.target.value })} placeholder="2020.01 - 至今" />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item style={{marginBottom:8}} label="副标题">
                                    <StyledInput value={item.subtitle} onChange={e => updateListItem(moduleId, item.id, { subtitle: e.target.value })} placeholder="例如：高级前端工程师" />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item style={{marginBottom:0}} label="描述">
                                    <TextArea 
                                        value={item.desc} 
                                        onChange={e => updateListItem(moduleId, item.id, { desc: e.target.value })} 
                                        placeholder="详细描述你的工作内容、成就..." 
                                        autoSize={{ minRows: 3 }} 
                                        style={{ borderRadius: 6, borderColor: '#e8e8e8', padding: '8px 11px' }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>
            ))}
            <Button type="dashed" block icon={<PlusOutlined />} onClick={() => addListItem(moduleId)} style={{ height: 40, borderRadius: 8 }}>添加一项</Button>
        </div>
    );
};

const TextModuleForm = ({ moduleId, data }) => {
    const updateModuleData = useResumeStore(state => state.updateModuleData);
    return (
        <Form layout="vertical">
            <Form.Item style={{ marginBottom: 0 }}>
                <TextArea 
                    value={data.content} 
                    onChange={e => updateModuleData(moduleId, { content: e.target.value })} 
                    placeholder="在这里输入内容..." 
                    autoSize={{ minRows: 6 }} 
                    style={{ borderRadius: 6, borderColor: '#e8e8e8', padding: '12px' }}
                />
            </Form.Item>
        </Form>
    );
};

const SortableItem = ({ module, index }) => {
    const { removeModule } = useResumeStore();
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: module.id });
    
    // Collapsed state logic could be added here, but for now we keep it expanded by default for editability

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        marginBottom: 24,
        position: 'relative',
        zIndex: isDragging ? 999 : 1,
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        Modal.confirm({
            title: `确认删除 "${module.title}" 模块吗？`,
            okType: 'danger',
            onOk: () => removeModule(module.id)
        });
    };

    return (
        <div ref={setNodeRef} style={style}>
            <Collapse 
                defaultActiveKey={['1']} 
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                style={{ background: '#fff', borderRadius: 12, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            >
                <Panel 
                    header={
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0' }}>
                            <div {...attributes} {...listeners} style={{ cursor: 'grab', color: '#ccc', display: 'flex', alignItems: 'center', padding: 4 }} onClick={e => e.stopPropagation()}>
                                <HolderOutlined style={{ fontSize: 16 }} />
                            </div>
                            <span style={{ fontWeight: 600, fontSize: 15 }}>{module.title}</span>
                        </div>
                    }
                    key="1"
                    extra={module.id !== 'base-info' && (
                        <Button type="text" icon={<DeleteOutlined />} danger size="small" onClick={handleDelete} style={{ opacity: 0.5 }} />
                    )}
                    style={{ borderBottom: 'none', borderRadius: 12 }}
                >
                    <div style={{ padding: '0 8px 12px 8px' }}>
                        {module.type === 'baseInfo' && <BaseInfoForm moduleId={module.id} data={module.data} />}
                        {module.type === 'list' && <ListModuleForm moduleId={module.id} data={module.data} />}
                        {module.type === 'text' && <TextModuleForm moduleId={module.id} data={module.data} />}
                    </div>
                </Panel>
            </Collapse>
        </div>
    );
};

const FormBuilder = () => {
  const { resume, reorderModules } = useResumeStore();
  const { modules } = resume;
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
        const oldIndex = modules.findIndex((item) => item.id === active.id);
        const newIndex = modules.findIndex((item) => item.id === over.id);
        reorderModules(arrayMove(modules, oldIndex, newIndex));
    }
  };

  return (
    <div style={{ paddingBottom: 120 }}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={modules.map(m => m.id)} strategy={verticalListSortingStrategy}>
                {modules.map((module, index) => (
                    <SortableItem key={module.id} module={module} index={index} />
                ))}
            </SortableContext>
        </DndContext>
        
        {/* Empty State / Bottom Prompt */}
        <div style={{ 
            textAlign: 'center', 
            color: '#999', 
            padding: '32px 0', 
            border: '2px dashed #eee', 
            borderRadius: 12,
            marginTop: 20
        }}>
            <PlusOutlined style={{ fontSize: 24, marginBottom: 8, color: '#ddd' }} />
            <p style={{ margin: 0, fontSize: 13 }}>点击左侧模块库，添加更多内容</p>
        </div>
    </div>
  );
};

export default FormBuilder;
