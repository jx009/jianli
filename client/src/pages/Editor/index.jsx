import React, { useEffect, useState } from 'react';
import useResumeStore from '../../store/useResumeStore';
import LeftSidebar from './LeftSidebar';
import Canvas from './Canvas';
import ConfigPanel from './ConfigPanel';
import { Button, message, Spin } from 'antd';
import { SaveOutlined, DownloadOutlined, LeftOutlined } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

// 引入原站样式，虽然类名是混淆的，但部分全局样式可能有用
// 关键是我们要自己写一套稳的 layout
import './Editor.css'; 

const Editor = () => {
  const { id } = useParams();
  const { resume } = useResumeStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
        axios.get(`/api/resumes/${id}`)
            .then(res => {
                if (res.data.content && res.data.content.modules) {
                    useResumeStore.setState({ resume: res.data.content });
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }
  }, [id]);

  const handleSave = async () => {
    try {
        await axios.put(`/api/resumes/${id}`, {
            title: '我的简历', 
            content: resume
        });
        message.success('保存成功');
    } catch (error) {
        message.error('保存失败');
    }
  };

  const handleDownload = () => {
      window.open(`/api/resumes/${id}/pdf`, '_blank');
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spin size="large" tip="正在加载简历..." /></div>;

  return (
    <div className="editor-layout">
        {/* 顶部导航栏 */}
        <header className="editor-header">
            <div className="header-left">
                <Link to="/dashboard" className="back-link">
                    <LeftOutlined /> 返回我的简历
                </Link>
            </div>
            <div className="header-center">
                <strong>简历编辑器</strong>
            </div>
            <div className="header-right">
                <Button icon={<SaveOutlined />} onClick={handleSave} style={{ marginRight: 10 }}>保存</Button>
                <Button type="primary" icon={<DownloadOutlined />} onClick={handleDownload} style={{ background: '#24be58', borderColor: '#24be58' }}>
                    导出 PDF
                </Button>
            </div>
        </header>

        {/* 主体工作区 */}
        <div className="editor-workspace">
            {/* 左侧：模块选择 (固定宽度) */}
            <aside className="editor-sidebar-left">
                <LeftSidebar />
            </aside>

            {/* 中间：画布 (自适应宽度，滚动) */}
            <main className="editor-canvas-area">
                <div className="canvas-wrapper">
                    <Canvas />
                </div>
            </main>

            {/* 右侧：配置面板 (固定宽度) */}
            <aside className="editor-sidebar-right">
                <ConfigPanel />
            </aside>
        </div>
    </div>
  );
};

export default Editor;