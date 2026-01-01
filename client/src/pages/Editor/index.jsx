import React, { useState, useEffect } from 'react';
import { Layout, Button, Input, message, Spin, Avatar, Modal } from 'antd';
import { 
  SaveOutlined, 
  DownloadOutlined, 
  FileTextOutlined,
  UserOutlined,
  CloudSyncOutlined,
  WechatOutlined
} from '@ant-design/icons';
import { Link, useParams, useNavigate } from 'react-router-dom';
import useResumeStore from '../../store/useResumeStore';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Components
import ModuleSelector from './components/Sidebar/ModuleSelector';
import FormBuilder from './components/FormBuilder';
import Previewer from './components/Previewer';

import './Editor.css';

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { resume, updateConfig } = useResumeStore();
  
  // States
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [user, setUser] = useState(null);
  const [resumeTitle, setResumeTitle] = useState('我的求职简历');
  
  // Login Modal States
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [sceneId, setSceneId] = useState('');
  const [isPolling, setIsPolling] = useState(false);

  // Check Auth & Load Resume (Same as before)
  useEffect(() => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      if (token && savedUser) {
          setUser(JSON.parse(savedUser));
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      if (id && id !== 'new') {
          setLoading(true);
          axios.get(`/api/resumes/${id}`)
              .then(res => {
                  if (res.data.content) useResumeStore.setState({ resume: res.data.content });
                  if (res.data.title) setResumeTitle(res.data.title);
                  setLoading(false);
              })
              .catch(err => { console.error(err); setLoading(false); });
      }
  }, [id]);

  // Login Polling (Same as before)
  useEffect(() => {
      let interval;
      if (isLoginModalOpen && sceneId && isPolling) {
          interval = setInterval(async () => {
              try {
                  const res = await axios.get(`/api/auth/check?sceneId=${sceneId}`);
                  if (res.data.status === 'confirmed') {
                      message.success('登录成功');
                      localStorage.setItem('token', res.data.token);
                      localStorage.setItem('user', JSON.stringify(res.data.user));
                      setUser(res.data.user);
                      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
                      setIsPolling(false);
                      setIsLoginModalOpen(false);
                  }
              } catch (error) {}
          }, 2000);
      }
      return () => clearInterval(interval);
  }, [isLoginModalOpen, sceneId, isPolling]);

  // Handlers
  const handleLoginClick = async () => {
      setIsLoginModalOpen(true);
      setQrCodeUrl(''); 
      try {
          const res = await axios.get('/api/auth/wechat/qrcode');
          setQrCodeUrl(res.data.url);
          setSceneId(res.data.sceneId);
          setIsPolling(true);
      } catch (error) { message.error('获取登录二维码失败'); }
  };

  const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
      message.info('已退出登录');
  };

  const handleSave = async () => {
    if (!user) {
        message.warning('请先登录后再保存简历');
        handleLoginClick();
        return;
    }
    setSaving(true);
    try {
        if (id && id !== 'new') {
            await axios.put(`/api/resumes/${id}`, { title: resumeTitle, content: resume });
            message.success('保存成功');
        } else {
            const res = await axios.post('/api/resumes', { title: resumeTitle, content: resume });
            message.success('创建成功');
            navigate(`/editor/${res.data.id}`, { replace: true });
        }
        setSaving(false);
    } catch (error) { setSaving(false); message.error('保存失败'); }
  };

  // PDF Export Logic
  const handleDownload = async () => {
      setExporting(true);
      const element = document.querySelector('.a4-paper'); // Select the resume container
      if (!element) {
          message.error('无法找到简历内容');
          setExporting(false);
          return;
      }

      try {
          // 1. html2canvas to PNG
          const canvas = await html2canvas(element, {
              scale: 2, // Improve resolution
              useCORS: true, // Handle external images (like user avatar)
              logging: false,
              backgroundColor: '#ffffff'
          });
          const imgData = canvas.toDataURL('image/png');

          // 2. jsPDF to PDF
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const imgProps = pdf.getImageProperties(imgData);
          
          // Calculate height based on A4 width
          const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
          
          let heightLeft = imgHeight;
          let position = 0;

          // Multi-page logic
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
          heightLeft -= pdfHeight;

          while (heightLeft >= 0) {
              position = heightLeft - imgHeight;
              pdf.addPage();
              pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
              heightLeft -= pdfHeight;
          }

          pdf.save(`${resumeTitle || 'resume'}.pdf`);
          message.success('导出成功');
      } catch (error) {
          console.error(error);
          message.error('导出失败，请重试');
      } finally {
          setExporting(false);
      }
  };

  if (loading) return <div className="loading-screen"><Spin size="large" tip="正在加载简历..." /></div>;

  return (
    <div className="editor-layout">
        <header className="editor-header">
            <div className="header-left">
                <Link to="/" className="brand-logo" style={{ textDecoration: 'none' }}>
                    <FileTextOutlined className="logo-icon" />
                    <span>职达简历</span>
                </Link>
                <div style={{ width: 1, height: 20, background: '#eee', margin: '0 16px' }} />
                <div className="resume-title-edit">
                    <Input 
                        bordered={false} 
                        value={resumeTitle} 
                        onChange={e => setResumeTitle(e.target.value)}
                        style={{ width: 200, fontWeight: 500 }}
                    />
                    {saving ? <span style={{fontSize: 12, color: '#999'}}><CloudSyncOutlined spin /> 保存中...</span> : <span style={{fontSize: 12, color: '#ccc'}}>已保存</span>}
                </div>
            </div>
            <div className="header-right">
                <Button icon={<SaveOutlined />} onClick={handleSave} type="text">保存</Button>
                <Button 
                    type="primary" 
                    icon={exporting ? <LoadingOutlined /> : <DownloadOutlined />} 
                    onClick={handleDownload} 
                    disabled={exporting}
                    style={{ marginLeft: 12, background: '#24be58', borderColor: '#24be58' }}
                >
                    {exporting ? '生成中...' : '导出 PDF'}
                </Button>
                <div style={{ marginLeft: 24, cursor: 'pointer' }}>
                   {user ? (
                       <div onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                           <Avatar icon={<UserOutlined />} src={user.avatar} style={{ backgroundColor: '#87d068' }} />
                           <span style={{ fontSize: 13, color: '#666' }}>{user.nickname}</span>
                       </div>
                   ) : (
                       <Button type="link" onClick={handleLoginClick} style={{ color: '#666' }}>登录 / 注册</Button>
                   )}
                </div>
            </div>
        </header>

        <div className="editor-workspace">
            <aside className="editor-sidebar-left"><ModuleSelector /></aside>
            <div className="editor-form-area"><div className="form-container"><FormBuilder /></div></div>
            <div className="editor-preview-area"><div className="a4-paper"><Previewer /></div></div>
        </div>

        <Modal 
            title="微信扫码登录" 
            open={isLoginModalOpen} 
            onCancel={() => setIsLoginModalOpen(false)}
            footer={null}
            width={360}
            centered
        >
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                {qrCodeUrl ? (
                    <>
                        <div style={{ marginBottom: 16 }}>
                            <img src={qrCodeUrl} alt="WeChat QR" style={{ width: 200, height: 200 }} />
                        </div>
                        <p style={{ color: '#999', fontSize: 13 }}>
                            请使用微信扫描二维码<br/>关注公众号自动登录
                        </p>
                        <div style={{ marginTop: 20, fontSize: 12, color: '#ddd' }}>(开发模式: 2秒后自动登录)</div>
                    </>
                ) : ( <Spin tip="正在获取二维码..." /> )}
            </div>
        </Modal>
    </div>
  );
};

export default Editor;