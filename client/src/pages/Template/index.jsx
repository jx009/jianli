import React from 'react';
import { Button, Row, Col } from 'antd';
import { Link } from 'react-router-dom';

const templates = [
  { id: 1, title: '高端大气简历模板', cover: '/static/ar60udDP-【双栏】高端大气简历模板 (1).jpg' },
  { id: 2, title: '创意求职简历模板', cover: '/static/oE0EDD99-【双栏】创意求职简历模板 (1).jpg' },
  { id: 3, title: '极简风格简历模板', cover: '/static/3kWvv2dx-【双栏】极简风格简历模板 (1).jpg' },
  { id: 4, title: '靠左风格简历模板', cover: '/static/264SKR6X-【双栏】靠左风格简历模板 (1).jpg' },
  { id: 5, title: '黑白极简简历模板', cover: '/static/mJTKCCGS-黑白极简简历模板 (1).jpg' },
  { id: 6, title: '通用型简历模板', cover: '/static/MO2tY4DI-黑白极简简历模板 (1).jpg' },
];

const Template = () => {
  return (
    <div className="p__templateCenter___3P-2F">
      <div className="p__templateCenter___2sJ1o">
        <div className="p__templateCenter___3q1_1">简历模板大全</div>
        <div className="p__templateCenter___1_1_1">
          <Row gutter={[24, 24]}>
            {templates.map(tpl => (
              <Col key={tpl.id} xs={24} sm={12} md={8} lg={6}>
                <div className="p__templateCenter___2_1_1">
                  <div className="p__templateCenter___2_1_2">
                    <img src={tpl.cover} alt={tpl.title} />
                    <div className="p__templateCenter___2_1_3">
                      <Link to={`/editor/${tpl.id}`}>
                        <Button type="primary" shape="round" style={{ background: '#24be58', borderColor: '#24be58' }}>使用模板</Button>
                      </Link>
                    </div>
                  </div>
                  <div className="p__templateCenter___2_1_4">{tpl.title}</div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Template;
