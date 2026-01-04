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
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import useResumeStore from '../../store/useResumeStore';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Components
import ModuleSelector from './components/Sidebar/ModuleSelector';
import FormBuilder from './components/FormBuilder';
import Previewer from './components/Previewer';
import FreeEditor from './FreeEditor';

import './Editor.css';

const Editor = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resume, updateConfig, updateModuleData } = useResumeStore();
  
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
      
      const mode = searchParams.get('mode');

      if (id && id !== 'new') {
          setLoading(true);
          axios.get(`/api/resumes/${id}`)
              .then(res => {
                  if (res.data.content) {
                      useResumeStore.setState({ resume: res.data.content });
                  }
                  if (res.data.title) setResumeTitle(res.data.title);
                  setLoading(false);
              })
              .catch(err => { console.error(err); setLoading(false); });
      }
  }, [id, searchParams]);

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
        const element = document.querySelector('.a4-paper') || document.querySelector('.free-editor-container');
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
      try {
          const element = document.querySelector('.resume-canvas');
          if (!element) { message.error('无法找到简历内容'); setExporting(false); return; }

          // 1. 收集样式 (Styles & Links)
          let styles = '';
          document.querySelectorAll('style').forEach(style => {
              styles += style.outerHTML;
          });
          
          // 将相对路径的 link 转换为绝对路径，确保后端 Puppeteer 能加载
          const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(link => {
              return `<link rel="stylesheet" href="${link.href}" />`;
          }).join('\n');

          // 2. 构建完整 HTML
          // 我们注入一段专门的打印样式来隐藏交互元素
          const htmlContent = `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                ${links}
                ${styles}
                <style>
                  html, body { margin: 0; padding: 0; background: #fff; -webkit-print-color-adjust: exact; }
                  .resume-canvas { 
                     width: 210mm !important;
                     min-height: 297mm !important;
                     margin: 0 auto !important; 
                     padding: 30px 40px !important;
                     box-shadow: none !important; 
                     /* 移除编辑器的分页红线 */
                     background-image: none !important;
                     overflow: visible !important;
                  }
                  /* 隐藏编辑器的交互组件 */
                  .module-toolbar, 
                  .add-btn-wrapper, 
                  .item-ops,
                  .dnd-kit-overlay { 
                      display: none !important; 
                  }
                  /* 确保所有文本可见 */
                  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                </style>
              </head>
              <body>
                ${element.outerHTML}
              </body>
            </html>
          `;

          // 3. 调用后端生成 PDF
          const response = await axios.post('/api/resumes/export', { htmlContent }, {
              responseType: 'blob', // 重要：接收二进制流
              timeout: 60000        // 生成 PDF 可能较慢，放宽超时
          });

          // 4. 触发下载
          const blob = new Blob([response.data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${resumeTitle || 'resume'}.pdf`;
          document.body.appendChild(link);
          link.click();
          
          // 清理
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          
          message.success('导出成功 (高清矢量版)');
      } catch (error) { 
          console.error('Export failed:', error); 
          message.error('导出失败，请检查网络或重试'); 
      } finally { 
          setExporting(false); 
      }
  };

  // --- FREE MODE LOGIC ---
  const isFreeMode = resume?.config?.templateId === 'free';
  const freeTextContent = isFreeMode && resume.modules[0]?.data?.content;

  const handleFreeTextChange = (newHtml) => {
      if (isFreeMode) {
           updateModuleData('free-text', { content: newHtml });
      }
  };

  if (loading) return <div className="loading-screen"><Spin size="large" tip="正在加载简历..." /></div>;

  return (
    <div className="editor-layout">
        <header className="editor-header">
            <div className="header-left">
                <Tooltip title="返回首页">
                    <Button type="text" icon={<LeftOutlined />} onClick={() => navigate('/')} style={{ marginRight: 8, color: '#666' }}/>
                </Tooltip>
                <div className="brand-logo" onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <img src="/static/logo.png" alt="Logo" style={{ width: 28, height: 28, borderRadius: 6 }} />
                    <span style={{ fontSize: 18, fontWeight: 700, color: '#333' }}>灵感简历</span>
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

        <div className="editor-workspace" style={isFreeMode ? { display: 'block', padding: 40, background: '#f0f2f5', overflowY: 'auto' } : {}}>
            {isFreeMode ? (
                <FreeEditor initialContent={freeTextContent} onChange={handleFreeTextChange} />
            ) : (
                <>
                    <aside className="editor-sidebar-left"><ModuleSelector /></aside>
                    <div className="editor-form-area"><div className="form-container"><FormBuilder /></div></div>
                    <div className="editor-preview-area"><div className="a4-paper"><Previewer /></div></div>
                </>
            )}
        </div>

        <Modal 
            title="关注公众号登录" 
            open={isLoginModalOpen} 
            onCancel={() => setIsLoginModalOpen(false)}
            footer={null}
            width={380}
            centered
        >
             {/* ... Login Modal Content ... */}
             <div style={{ textAlign: 'center', padding: '10px 0' }}>
                 <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, display: 'inline-block', marginBottom: 20 }}>
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
