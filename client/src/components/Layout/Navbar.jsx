import React, { useState, useEffect } from 'react';
import { Button, Dropdown, Avatar, Modal, Spin, message, Input } from 'antd';
import { 
  FileTextOutlined, 
  UserOutlined, 
  LogoutOutlined,
  AppstoreOutlined,
  HomeOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

// Placeholder for your official account QR code
// You should replace this with your actual image path like '/static/wechat-qr.jpg'
const MOCK_QR_URL = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://u.wechat.com/YOUR_OFFICIAL_ACCOUNT_URL'; 

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  
  // Login States
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Load User
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
    
    const handleStorageChange = () => {
         const updatedUser = localStorage.getItem('user');
         if (updatedUser) setUser(JSON.parse(updatedUser));
         else setUser(null);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLoginClick = () => {
      setIsLoginModalOpen(true);
      setVerifyCode('');
  };

  const handleSubmitCode = async () => {
      if (!verifyCode) {
          message.warning('请输入验证码');
          return;
      }
      setLoggingIn(true);
      try {
          const res = await axios.post('/api/auth/login-by-code', { code: verifyCode });
          
          message.success('登录成功');
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.user));
          setUser(res.data.user);
          axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
          
          setIsLoginModalOpen(false);
          // Trigger updates
          window.dispatchEvent(new Event('storage'));
      } catch (error) {
          message.error(error.response?.data?.error || '登录失败，��检查验证码');
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
      navigate('/');
  };

  // Styles
  const navStyle = {
      height: 70,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #eaeaea',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      padding: '0 40px',
      justifyContent: 'space-between'
  };

  const linkStyle = (path) => ({
      color: location.pathname === path ? '#24be58' : '#333',
      fontWeight: location.pathname === path ? 600 : 400,
      fontSize: 16,
      textDecoration: 'none',
      marginLeft: 32,
      display: 'flex',
      alignItems: 'center',
      gap: 6
  });

  return (
    <>
        <header style={navStyle}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 40, height: 40, background: '#24be58', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 24 }}>
                        <FileTextOutlined />
                    </div>
                    <span style={{ fontSize: 22, fontWeight: 800, color: '#333', letterSpacing: '-0.5px' }}>灵感简历</span>
                </Link>

                <nav style={{ marginLeft: 60, display: 'flex' }}>
                    <Link to="/" style={linkStyle('/')}>
                        <HomeOutlined /> 首页
                    </Link>
                    <Link to="/templates" style={linkStyle('/templates')}>
                        <AppstoreOutlined /> 模板中心
                    </Link>
                </nav>
            </div>

            <div>
                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <Link to="/dashboard">
                           <Button type="default" style={{ borderRadius: 20 }}>我的简历</Button>
                        </Link>
                        <Dropdown 
                            menu={{ items: [{ key: 'logout', label: '退出登录', icon: <LogoutOutlined />, onClick: handleLogout }] }} 
                        >
                            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Avatar src={user.avatar} icon={<UserOutlined />} style={{ backgroundColor: '#24be58' }} />
                                <span style={{ fontWeight: 500 }}>{user.nickname}</span>
                            </div>
                        </Dropdown>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: 12 }}>
                        <Button type="text" onClick={handleLoginClick} style={{ fontSize: 16 }}>登录</Button>
                        <Button type="primary" onClick={handleLoginClick} style={{ background: '#24be58', borderColor: '#24be58', borderRadius: 20, padding: '0 24px', height: 40, fontSize: 16, fontWeight: 500 }}>
                            免费制作
                        </Button>
                    </div>
                )}
            </div>
        </header>

        <Modal 
            title="关注公众号登录" 
            open={isLoginModalOpen} 
            onCancel={() => setIsLoginModalOpen(false)}
            footer={null}
            width={380}
            centered
        >
             <div style={{ textAlign: 'center', padding: '10px 0' }}>
                 {/* QR Code Section */}
                 <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, display: 'inline-block', marginBottom: 20 }}>
                     {/* Replace src below with your actual Official Account QR Image */}
                    <img src="/static/wechat_qr.jpg" alt="WeChat QR" style={{ width: 180, height: 180 }} />
                 </div>
                 
                 <p style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>
                     请扫码关注公众号<br/>
                     回复 <span style={{ color: '#24be58', fontWeight: 'bold' }}>登录</span> 获取验证码
                 </p>

                 {/* Code Input Section */}
                 <div style={{ display: 'flex', gap: 10 }}>
                     <Input 
                        prefix={<SafetyCertificateOutlined style={{color:'#999'}} />}
                        placeholder="请输入6位验证码" 
                        size="large" 
                        value={verifyCode}
                        onChange={e => setVerifyCode(e.target.value)}
                        onPressEnter={handleSubmitCode}
                        maxLength={6}
                        style={{ textAlign: 'center', letterSpacing: 2 }}
                     />
                     <Button 
                        type="primary" 
                        size="large" 
                        onClick={handleSubmitCode} 
                        loading={loggingIn}
                        style={{ background: '#24be58', borderColor: '#24be58', minWidth: 100 }}
                     >
                        登录
                     </Button>
                 </div>
                 
                 {/* DEV Hint */}
                 <div style={{ marginTop: 20, fontSize: 12, color: '#ddd' }}>
                     (开发测试: 输入 123456 直接登录)
                 </div>
            </div>
        </Modal>
    </>
  );
};

export default Navbar;