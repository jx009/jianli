import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col, Empty, message, Modal } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const navigate = useNavigate();
  const { confirm } = Modal;

  const fetchResumes = async () => {
    try {
      const res = await axios.get('/api/resumes');
      setResumes(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleCreate = async () => {
    try {
      const res = await axios.post('/api/resumes', {
        title: '我的简历 ' + new Date().toLocaleDateString(),
        content: {
            config: {
                themeColor: '#24be58',
                fontFamily: 'sans-serif',
                lineHeight: 1.5,
                moduleMargin: 24
            },
            modules: [] // Empty start or default modules
        }
      });
      message.success('创建成功');
      navigate(`/editor/${res.data.id}`);
    } catch (error) {
      message.error('创建失败');
    }
  };

  const handleDelete = (id) => {
    confirm({
      title: '确认删除?',
      icon: <ExclamationCircleOutlined />,
      content: '删除后无法恢复',
      onOk() {
        axios.delete(`/api/resumes/${id}`).then(() => {
            message.success('删除成功');
            fetchResumes();
        });
      },
    });
  };

  return (
    <div style={{ padding: '40px', maxWidth: 1200, margin: '0 auto', minHeight: 'calc(100vh - 200px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2>我的简历</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          新建简历
        </Button>
      </div>

      {resumes.length === 0 ? (
        <Empty description="暂无简历，快去创建一个吧" />
      ) : (
        <Row gutter={[24, 24]}>
          {resumes.map(item => (
            <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                actions={[
                  <Link to={`/editor/${item.id}`}><EditOutlined key="edit" /></Link>,
                  <DeleteOutlined key="delete" onClick={() => handleDelete(item.id)} />
                ]}
                hoverable
              >
                <Card.Meta
                  title={item.title}
                  description={`更新时间: ${new Date(item.updatedAt).toLocaleDateString()}`}
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Dashboard;