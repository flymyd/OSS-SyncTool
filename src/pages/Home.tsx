import { Button, Empty, Steps } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { useState } from 'react';

interface HomeProps {
  onCreateWorkspace: () => void
}

function Home({ onCreateWorkspace }: HomeProps) {
  const currentWorkspace = useSelector((state: RootState) => state.workspace.currentWorkspace);
  const [current, setCurrent] = useState(0);

  const onChange = (value: number) => {
    console.log('onChange:', value);
    setCurrent(value);
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px 0' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>欢迎使用 OSS 同步工具</h1>
      {currentWorkspace === '请选择工作区' ? (
        <Empty
          description="您还没有创建或选择工作区"
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
      <div style={{ marginTop: 24 }}>
        <Steps
          current={current}
          onChange={onChange}
          direction="vertical"
          items={[
            {
              title: '工作区列表',
              description: '管理和切换已有工作区',
            },
            {
              title: '上传管理',
              description: '将文件上传到日志服务器',
            },
            {
              title: '工作区记录',
              description: '选择日志服务器上的数据并进行同步',
            },
          ]}
        />
      </div>
    </div>
  )
}

export default Home
