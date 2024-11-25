import Home from './Home'
import WorkspaceList from './WorkspaceList'
import Profile from './Profile'
import Upload from './Upload'
import Settings from './Settings' 

import { useState, useEffect, Suspense } from 'react'
import { Layout, Menu, Button, Dropdown, Modal, Form, Input, message } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  UploadOutlined,
  SettingOutlined,
  LogoutOutlined,
  LockOutlined,
  PlusOutlined,
  HomeOutlined,
  AppstoreOutlined
} from '@ant-design/icons'
import { Routes, Route, useNavigate } from 'react-router-dom'
import type { MenuProps } from 'antd'
import { createDashboardRoutes } from '../routes'
import { changePassword } from '../services/auth'
import { createWorkspace } from '../services/workspace'

const { Header, Sider, Content } = Layout

// 添加接口定义
interface DashboardProps {
  setIsAuthenticated: (value: boolean) => void
}

function Dashboard({ setIsAuthenticated }: DashboardProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false)
  const [isWorkspaceModalVisible, setIsWorkspaceModalVisible] = useState(false)
  const [currentWorkspace, setCurrentWorkspace] = useState(localStorage.getItem('currentWorkspace') || '新工作区')
  const [form] = Form.useForm()
  const [workspaceForm] = Form.useForm()
  const navigate = useNavigate()
  const [selectedKey, setSelectedKey] = useState('home')

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    navigate('/login')
  }

  const handlePasswordChange = async (values: any) => {
    try {
      await changePassword(values)
      message.success('密码修改成功，请重新登录')
      setIsPasswordModalVisible(false)
      form.resetFields()
      handleLogout()
    } catch (error) {
      console.error('密码修改失败:', error)
    }
  }

  const handleCreateWorkspace = async (values: { name: string }) => {
    try {
      const response = await createWorkspace(values)
      localStorage.setItem('currentWorkspace', response.name)
      setCurrentWorkspace(response.name)
      setSelectedKey('home')
      
      message.success('工作区创建成功')
      setIsWorkspaceModalVisible(false)
      workspaceForm.resetFields()
      navigate('/dashboard/home')
    } catch (error) {
      console.error('工作区创建失败:', error)
    }
  }

  const handleWorkspaceSelect = (workspace: string) => {
    localStorage.setItem('currentWorkspace', workspace)
    setCurrentWorkspace(workspace)
    setSelectedKey('home')
    message.success('工作区切换成功')
    navigate('/dashboard/home')
  }

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'username',
      label: <span style={{ cursor: 'default' }}>当前用户：{localStorage.getItem('username') || '用户'}</span>,
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'changePassword',
      icon: <LockOutlined />,
      label: '修改密码',
      onClick: () => setIsPasswordModalVisible(true),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ]

  const routes = createDashboardRoutes({
    onCreateWorkspace: () => setIsWorkspaceModalVisible(true),
    currentWorkspace,
    onWorkspaceSelect: handleWorkspaceSelect
  })

  const menuItems: MenuProps['items'] = routes
    .filter(route => !route.hideInMenu)
    .map(route => ({
      key: route.key,
      icon: route.icon,
      label: route.label,
    })) as MenuProps['items']

  const handleMenuClick = (key: string) => {
    setSelectedKey(key)
    if (key !== 'createWorkspace') {
      navigate(`/dashboard/${key}`)
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div style={{ 
          height: 32, 
          margin: 16, 
          background: 'rgba(255, 255, 255, 0.2)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 8px'
        }}>
          <div style={{
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            flex: 1
          }}>
            {currentWorkspace}
          </div>
          <Button
            type="text"
            icon={<PlusOutlined />}
            onClick={() => setIsWorkspaceModalVisible(true)}
            size="small"
            style={{
              color: '#fff',
              marginLeft: 4,
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => handleMenuClick(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Button type="text" icon={<UserOutlined />} style={{ marginRight: 16 }}>
              {localStorage.getItem('username') || '用户'}
            </Button>
          </Dropdown>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          <Suspense fallback={<div>加载中...</div>}>
            <Routes>
              {routes.map(route => {
                if (route.path === 'workspace-list') {
                  return (
                    <Route
                      key={route.key}
                      path={route.path}
                      element={<WorkspaceList onWorkspaceSelect={handleWorkspaceSelect} />}
                    />
                  );
                }
                return (
                  <Route
                    key={route.key}
                    path={route.path}
                    element={route.element}
                  />
                );
              })}
            </Routes>
          </Suspense>
        </Content>
      </Layout>

      <Modal
        title="修改密码"
        open={isPasswordModalVisible}
        onCancel={() => {
          setIsPasswordModalVisible(false)
          form.resetFields()
        }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handlePasswordChange}
          layout="vertical"
        >
          <Form.Item
            name="oldPassword"
            label="当前密码"
            rules={[{ required: true, message: '请输入当前密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="请输入当前密码" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[{ required: true, message: '请输入新密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认新密码"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('两次输入的密码不匹配'))
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="请确认新密码" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Button type="default" onClick={() => {
              setIsPasswordModalVisible(false)
              form.resetFields()
            }} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button type="primary" htmlType="submit">
              确认修改
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="创建工作区"
        open={isWorkspaceModalVisible}
        onCancel={() => {
          setIsWorkspaceModalVisible(false)
          workspaceForm.resetFields()
        }}
        footer={null}
      >
        <Form
          form={workspaceForm}
          onFinish={handleCreateWorkspace}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="工作区名称"
            rules={[
              { required: true, message: '请输入工作区名称' },
              { max: 20, message: '工作区名称不能超过20个字符' }
            ]}
          >
            <Input placeholder="请输入工作区名称" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Button type="default" onClick={() => {
              setIsWorkspaceModalVisible(false)
              workspaceForm.resetFields()
            }} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button type="primary" htmlType="submit">
              创建
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  )
}

export default Dashboard 