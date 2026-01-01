import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <div className="ant-design-pro ant-pro-basicLayout screen-xxl ant-pro-basicLayout-top-menu ant-pro-basicLayout-fix-siderbar ant-pro-basicLayout-top">
        <section className="ant-layout" style={{ background: '#fff' }}>
          <div className="ant-layout" style={{ background: '#fff' }}>
            <main className="ant-layout-content ant-pro-basicLayout-content ant-pro-basicLayout-has-header ant-pro-basicLayout-content-disable-margin" style={{ width: '100%', paddingTop: 48 }}>
              <div className="p__newIndex___2-P3_">
                <div className="p__newIndex___376mD" style={{ backgroundImage: 'url("/static/topBg.3604cadd.svg")' }}>
                  <div className="p__newIndex___3Q8rW">
                    <div className="p__newIndex___2wFr2">
                      <div className="p__newIndex___2wFr2-title">写简历从未如此简单</div>
                      <div className="p__newIndex___2wFr2-subTitle">1 分钟生成精美的个人简历，写简历从未如此简单 - 老鱼简历</div>
                      <div className="p__newIndex___2wFr2-btn">
                        <Link to="/templates">
                          <button type="button" className="ant-btn ant-btn-primary ant-btn-round ant-btn-lg" style={{ width: 140, height: 48, fontSize: 18, background: '#24be58', borderColor: '#24be58' }}>
                            <span>免费制作简历</span>
                          </button>
                        </Link>
                      </div>
                    </div>
                    <div className="p__newIndex___1sK1X">
                      <img src="/static/UXfKqrTp-laoyujianli-article.webp" alt="demo" />
                    </div>
                  </div>
                </div>
                {/* Feature Section extracted from HTML structure */}
                <div className="p__newIndex___2K_6w">
                  <div className="p__newIndex___1i_1e">
                    <div className="p__newIndex___3_1_1">
                      <div className="p__newIndex___1_1_1">海量模板</div>
                      <div className="p__newIndex___1_1_2">各行各业，应有尽有</div>
                    </div>
                    <div className="p__newIndex___3_1_1">
                      <div className="p__newIndex___1_1_1">极速生成</div>
                      <div className="p__newIndex___1_1_2">所见即所得，一键导出</div>
                    </div>
                    <div className="p__newIndex___3_1_1">
                      <div className="p__newIndex___1_1_1">完全免费</div>
                      <div className="p__newIndex___1_1_2">致力打造最好用的免费简历工具</div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
