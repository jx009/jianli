import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="ant-layout-header ant-pro-fixed-header-action ant-pro-top-menu ant-pro-header-light" style={{ padding: 0, height: 48, lineHeight: '48px', width: '100%', zIndex: 19 }}>
      <div className="ant-pro-top-nav-header light">
        <div className="ant-pro-top-nav-header-main wide">
          <div className="ant-pro-top-nav-header-main-left">
            <div className="ant-pro-top-nav-header-logo" id="logo">
              <Link to="/">
                <img src="/static/IoIjVkQz-laoyuAvatar01.jpg" alt="logo" />
                <h1>老鱼简历</h1>
              </Link>
            </div>
          </div>
          <div className="ant-pro-top-nav-header-menu">
            <div className="ant-menu ant-menu-light ant-menu-root ant-menu-horizontal" role="menu">
              <li className="ant-menu-item ant-menu-item-selected" role="menuitem">
                <Link to="/">首页</Link>
              </li>
              <li className="ant-menu-item" role="menuitem">
                <Link to="/templates">简历模板</Link>
              </li>
              <li className="ant-menu-item" role="menuitem">
                <Link to="/dashboard">我的简历</Link>
              </li>
            </div>
          </div>
          <div className="ant-pro-top-nav-header-right">
             <Button type="primary" shape="round">登录/注册</Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
