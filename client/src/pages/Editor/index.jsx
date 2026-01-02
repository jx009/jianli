import React, { useState, useEffect } from 'react';
import { Button, Input, message, Spin, Avatar, Modal, Tooltip, Divider } from 'antd';
import { 
  SaveOutlined, 
  DownloadOutlined, 
  FileTextOutlined,
  UserOutlined,
  CloudSyncOutlined,
  LeftOutlined,
  HomeOutlined,
  SafetyCertificateOutlined
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
  
  // Login Modal States (Simplified for Code Login)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Check Auth & Load Resume
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

  // Handlers
  const handleLoginClick = () => {
      setIsLoginModalOpen(true);
      setVerifyCode('');
  };

  const handleSubmitCode = async () => {
      if (!verifyCode) { message.warning('请输入验证码'); return; }
      setLoggingIn(true);
      try {
          const res = await axios.post('/api/auth/login-by-code', { code: verifyCode });
          message.success('登录成功');
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.user));
          setUser(res.data.user);
          axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
          setIsLoginModalOpen(false);
      } catch (error) {
          message.error(error.response?.data?.error || '登录失败');
      } finally {
          setLoggingIn(false);
      }
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

    // Generate Thumbnail
    let thumbnail = null;
    try {
        const element = document.querySelector('.a4-paper');
        if (element) {
            const canvas = await html2canvas(element, { 
                scale: 0.3, 
                useCORS: true, 
                logging: false,
                backgroundColor: '#ffffff'
            });
            thumbnail = canvas.toDataURL('image/jpeg', 0.6);
        }
    } catch (e) {
        console.error('Thumbnail generation failed', e);
    }

    try {
        const payload = { title: resumeTitle, content: resume, thumbnail };
        if (id && id !== 'new') {
            await axios.put(`/api/resumes/${id}`, payload);
            message.success('保存成功');
        } else {
            const res = await axios.post('/api/resumes', payload);
            message.success('创建成功');
            navigate(`/editor/${res.data.id}`, { replace: true });
        }
        setSaving(false);
    } catch (error) { setSaving(false); message.error('保存失败'); }
  };

  const handleDownload = async () => {
      setExporting(true);
      const element = document.querySelector('.a4-paper');
      if (!element) { message.error('无法找到简历内容'); setExporting(false); return; }
      try {
          const canvas = await html2canvas(element, { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' });
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const imgProps = pdf.getImageProperties(imgData);
          const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
          let heightLeft = imgHeight;
          let position = 0;
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
      } catch (error) { console.error(error); message.error('导出失败，请重试'); } finally { setExporting(false); }
  };

  if (loading) return <div className="loading-screen"><Spin size="large" tip="正在加载简历..." /></div>;

  return (
    <div className="editor-layout">
        <header className="editor-header">
            <div className="header-left">
                <Tooltip title="返回首页">
                    <Button type="text" icon={<LeftOutlined />} onClick={() => navigate('/')} style={{ marginRight: 8, color: '#666' }}/>
                </Tooltip>
                <div className="brand-logo" onClick={() => navigate('/')}>
                    <FileTextOutlined className="logo-icon" />
                    <span>灵感简历</span>
                </div>
                <div style={{ width: 1, height: 20, background: '#eee', margin: '0 16px' }} />
                <div className="resume-title-edit">
                    <Input bordered={false} value={resumeTitle} onChange={e => setResumeTitle(e.target.value)} style={{ width: 240, fontWeight: 500, fontSize: 15 }} placeholder="请输入简历标题"/>
                    {saving ? <span style={{fontSize: 12, color: '#999'}}><CloudSyncOutlined spin /></span> : <span style={{fontSize: 12, color: '#ccc'}}>已保存</span>}
                </div>
            </div>

            <div className="header-right">
                <Button icon={<SaveOutlined />} onClick={handleSave} type="text" style={{marginRight: 8}}>保存</Button>
                <Button type="primary" icon={exporting ? <Spin size="small" /> : <DownloadOutlined />} onClick={handleDownload} disabled={exporting} style={{ background: '#24be58', borderColor: '#24be58', borderRadius: 6, fontWeight: 500 }}>
                    {exporting ? '生成中...' : '导出 PDF'}
                </Button>
                <div style={{ marginLeft: 24, cursor: 'pointer' }}>
                   {user ? (
                       <div onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                           <Avatar icon={<UserOutlined />} src={user.avatar} style={{ backgroundColor: '#24be58' }} size="small" />
                           <span style={{ fontSize: 13, color: '#666' }}>{user.nickname}</span>
                       </div>
                   ) : (
                       <Button type="link" onClick={handleLoginClick} style={{ color: '#666' }}>登录</Button>
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
            title="关注公众号登录" 
            open={isLoginModalOpen} 
            onCancel={() => setIsLoginModalOpen(false)}
            footer={null}
            width={380}
            centered
        >
             <div style={{ textAlign: 'center', padding: '10px 0' }}>
                 <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, display: 'inline-block', marginBottom: 20 }}>
                    {/* Placeholder for QR Code */}
                    <img src="/static/wechat_qr.jpg" alt="WeChat QR" style={{ width: 180, height: 180 }} />
                 </div>
                 
                 <p style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>
                     请扫码关注公众号<br/>
                     回复 <span style={{ color: '#24be58', fontWeight: 'bold' }}>登录</span> 获取验证码
                 </p>

                 <div style={{ display: 'flex', gap: 10 }}>
                     <Input 
                        prefix={<SafetyCertificateOutlined style={{color:'#999'}} />}
                        placeholder="请输入验证码" 
                        size="large" 
                        value={verifyCode}
                        onChange={e => setVerifyCode(e.target.value)}
                        onPressEnter={handleSubmitCode}
                        maxLength={6}
                        style={{ textAlign: 'center', letterSpacing: 2 }}
                     />
                     <Button type="primary" size="large" onClick={handleSubmitCode} loading={loggingIn} style={{ background: '#24be58', borderColor: '#24be58', minWidth: 100 }}>登录</Button>
                 </div>
                 
                 <div style={{ marginTop: 20, fontSize: 12, color: '#ddd' }}>(开发测试: 输入 123456 直接登录)</div>
            </div>
        </Modal>
    </div>
  );
};

export default Editor;