import React, { useState, useEffect } from 'react';
import { Button, Dropdown, Avatar, Modal, Spin, message } from 'antd';
import { 
  FileTextOutlined, 
  UserOutlined, 
  LogoutOutlined,
  AppstoreOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [sceneId, setSceneId] = useState('');
  const [isPolling, setIsPolling] = useState(false);

  // Load User
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // Listen to login events from other components if any (optional enhancement)
    const handleStorageChange = () => {
         const updatedUser = localStorage.getItem('user');
         if (updatedUser) setUser(JSON.parse(updatedUser));
         else setUser(null);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Login Logic (Shared)
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
                    // Refresh page or state
                    window.dispatchEvent(new Event('storage'));
                }
            } catch (error) {}
        }, 2000);
    }
    return () => clearInterval(interval);
  }, [isLoginModalOpen, sceneId, isPolling]);

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
                    <span style={{ fontSize: 22, fontWeight: 800, color: '#333', letterSpacing: '-0.5px' }}>职达简历</span>
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
                        <img src={qrCodeUrl} alt="QR" style={{ width: 200, height: 200, marginBottom: 16 }} />
                        <p style={{ color: '#999' }}>微信扫一扫，一键登录</p>
                        <div style={{ marginTop: 20, fontSize: 12, color: '#ddd' }}>(开发模式: 2秒后自动登录)</div>
                    </>
                ) : <Spin tip="加载中..." />}
            </div>
        </Modal>
    </>
  );
};

export default Navbar;
