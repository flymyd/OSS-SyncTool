import { Button, Empty } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

interface HomeProps {
  onCreateWorkspace: () => void
}

function Home({ onCreateWorkspace }: HomeProps) {
  const currentWorkspace = useSelector((state: RootState) => state.workspace.currentWorkspace);

  return (
    <div style={{ textAlign: 'center', padding: '50px 0' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>欢迎使用 OSS 同步工具</h1>
      {currentWorkspace === '请选择工作区' ? (
        <Empty
          description="您还没有创建工作区"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" icon={<PlusOutlined />} onClick={onCreateWorkspace}>
            创建工作区
          </Button>
        </Empty>
      ) : (
        <div>
          <p style={{ color: 'red' }}>当前工作区：{currentWorkspace}</p>
          <p style={{ marginTop: '20px' }}>在左侧菜单中选择功能开始使用</p>
        </div>
      )}
    </div>
  )
}

export default Home
