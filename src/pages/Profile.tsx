import {Button, Card, Descriptions, message} from 'antd'
import {MailOutlined, PhoneOutlined, UserOutlined} from '@ant-design/icons'

function Profile() {
  // 模拟用户数据，实际应从API获取
  const userInfo = {
    username: localStorage.getItem('username') || '用户',
    email: 'user@example.com',
    phone: '138****8888',
    createdAt: '2024-03-20',
    lastLogin: new Date().toLocaleString()
  }

  const handleEditProfile = () => {
    message.info('编辑个人信息功能开发中...')
  }

  return (
    <div>
      <Card
        title="个人信息"
        extra={<Button type="primary" onClick={handleEditProfile}>编辑资料</Button>}
      >
        <Descriptions column={1}>
          <Descriptions.Item label="用户名">
            <UserOutlined style={{ marginRight: 8 }} />
            {userInfo.username}
          </Descriptions.Item>
          <Descriptions.Item label="邮箱">
            <MailOutlined style={{ marginRight: 8 }} />
            {userInfo.email}
          </Descriptions.Item>
          <Descriptions.Item label="手机号">
            <PhoneOutlined style={{ marginRight: 8 }} />
            {userInfo.phone}
          </Descriptions.Item>
          <Descriptions.Item label="注册时间">
            {userInfo.createdAt}
          </Descriptions.Item>
          <Descriptions.Item label="最近登录">
            {userInfo.lastLogin}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  )
}

export default Profile
