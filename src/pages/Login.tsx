import { Form, Input, Button, Card, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { login } from '../services/auth'
import { useDispatch } from 'react-redux';
import { setAuth } from '../store/slices/authSlice';

interface LoginProps {
  setIsAuthenticated: (value: boolean) => void
}

function Login({ setIsAuthenticated }: LoginProps) {
  const dispatch = useDispatch();

  const onFinish = async (values: any) => {
    try {
      const response = await login(values)
      localStorage.setItem('token', response.token)
      
      dispatch(setAuth({
        username: response.username,
        userId: response.userId,
      }));
      
      setIsAuthenticated(true)
      message.success('登录成功')
    } catch (error) {
      console.error('登录失败:', error)
    }
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <Card title="登录" style={{ width: 300 }}>
        <Form
          name="login"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              登录
            </Button>
          </Form.Item>
          <div style={{ textAlign: 'center' }}>
            还没有账号？ <Link to="/register">立即注册</Link>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default Login 