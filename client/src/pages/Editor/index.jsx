import React, { useEffect } from 'react';
import useResumeStore from '../../store/useResumeStore';
import Sidebar from './Sidebar';
import Canvas from './Canvas';
import ConfigPanel from './ConfigPanel';
import { Button, message, Spin } from 'antd';
import { SaveOutlined, DownloadOutlined, LeftOutlined } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const Editor = () => {
  const { id } = useParams();
  const { resume, loadResume } = useResumeStore();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    if (id) {
        axios.get(`/api/resumes/${id}`)
            .then(res => {
                // If content is empty/new, might rely on store defaults, but normally we load it
                // Assuming loadResume action exists or we just direct set
                // For now, let's just assume store has a 'setResume'
                useResumeStore.setState({ resume: res.data.content });
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
            title: '我的简历', // Should allow editing title
            content: resume
        });
        message.success('保存成功');
    } catch (error) {
        message.error('保存失败');
    }
  };

  const handleDownload = () => {
      window.open(`http://localhost:3000/api/resumes/${id}/pdf`, '_blank');
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: 100 }}><Spin size="large" /></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div style={{ height: 50, background: '#fff', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', padding: '0 20px', justifyContent: 'space-between' }}>
            <Link to="/dashboard"><Button icon={<LeftOutlined />} type="text">返回</Button></Link>
            <div style={{ fontWeight: 'bold' }}>简历编辑器</div>
            <div style={{ display: 'flex', gap: 10 }}>
                <Button icon={<SaveOutlined />} onClick={handleSave}>保存</Button>
                <Button type="primary" icon={<DownloadOutlined />} onClick={handleDownload}>导出 PDF</Button>
            </div>
        </div>
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', background: '#f0f2f5' }}>
            <div style={{ width: 280, background: '#fff', borderRight: '1px solid #e8e8e8', display: 'flex', flexDirection: 'column' }}>
                <Sidebar />
            </div>
            
            <div style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', padding: '40px' }}>
                <Canvas />
            </div>
            
            <div style={{ width: 320, background: '#fff', borderLeft: '1px solid #e8e8e8', padding: 20 }}>
                <ConfigPanel />
            </div>
        </div>
    </div>
  );
};

export default Editor;
