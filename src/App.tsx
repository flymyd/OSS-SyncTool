import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
import {Suspense, useEffect, useState} from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import './reset.css'
import './App.css'
import { ConfigProvider } from 'antd'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'  // 导入中文语言包
import zhCN from 'antd/es/locale/zh_CN'  // 导入 Ant Design 中文语言包

// 设置 dayjs 的语言为中文
dayjs.locale('zh-cn')

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // 检查本地存储中是否有登录token
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
  }, [])

  // 添加路由守卫组件
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />
    }
    return <>{children}</>
  }

  return (
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <Suspense fallback={<div>加载中...</div>}>
          <Routes>
            <Route path="/login" element={
              !isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/dashboard" />
            } />
            <Route path="/register" element={
              !isAuthenticated ? <Register /> : <Navigate to="/dashboard" />
            } />
            <Route path="/dashboard/*" element={
              <ProtectedRoute>
                <Dashboard setIsAuthenticated={setIsAuthenticated} />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
