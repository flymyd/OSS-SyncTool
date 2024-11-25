import type {UploadProps} from 'antd'
import {Card, message, Table, Upload as AntUpload, Input} from 'antd'
import {InboxOutlined} from '@ant-design/icons'
import {useState} from 'react'

const { Dragger } = AntUpload

// 文件大小格式化
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function Upload() {
  const [fileList, setFileList] = useState<any[]>([])
  const [pathPrefix, setPathPrefix] = useState('v2/')
  const currentWorkspace = localStorage.getItem('currentWorkspace')

  // 验证上传条件
  const isUploadDisabled = () => {
    if (!currentWorkspace || currentWorkspace === '新工作区') {
      return true
    }
    if (!pathPrefix || !pathPrefix.endsWith('/')) {
      return true
    }
    return false
  }

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    disabled: isUploadDisabled(),
    onChange(info) {
      const { status } = info.file
      const newFileList = [...info.fileList].map(file => ({
        ...file,
        status: file.status,
        size: formatFileSize(file.size || 0),
        uploadTime: new Date().toLocaleString()
      }))

      setFileList(newFileList)

      if (status === 'done') {
        message.success(`${info.file.name} 文件上传成功`)
      } else if (status === 'error') {
        message.error(`${info.file.name} 文件上传失败`)
      }
    },
    beforeUpload: (file) => {
      if (isUploadDisabled()) {
        if (!currentWorkspace || currentWorkspace === '新工作区') {
          message.error('请先创建或选择一个工作区')
        } else {
          message.error('请输入有效的路径前缀，必须以/结尾')
        }
        return false
      }
      return true
    }
  }

  const columns = [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: '上传时间',
      dataIndex: 'uploadTime',
      key: 'uploadTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: Record<string, { text: string; color: string }> = {
          uploading: { text: '上传中', color: '#1890ff' },
          done: { text: '已完成', color: '#52c41a' },
          error: { text: '失败', color: '#ff4d4f' },
        }
        const { text, color } = statusMap[status] || { text: '未知', color: '#000' }
        return <span style={{ color }}>{text}</span>
      }
    },
  ]

  return (
    <div>
      <Card
        title="文件上传"
        style={{ marginBottom: 24 }}
        extra={currentWorkspace === '新工作区' ?
          <span style={{ color: '#ff4d4f' }}>请先创建工作区</span> :
          <span>当前工作区：{currentWorkspace}</span>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="请输入上传路径前缀"
            value={pathPrefix}
            onChange={(e) => setPathPrefix(e.target.value)}
            style={{ width: '100%' }}
            status={pathPrefix && !pathPrefix.endsWith('/') ? 'error' : ''}
            addonAfter={
              pathPrefix && !pathPrefix.endsWith('/') ? 
                <span style={{ color: '#ff4d4f' }}>必须以/结尾</span> : 
                null
            }
          />
        </div>
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p className="ant-upload-hint">
            支持单个或批量上传，严禁上传公司数据或其他违禁文件
          </p>
        </Dragger>
      </Card>

      <Card title="上传历史">
        <Table
          columns={columns}
          dataSource={fileList}
          rowKey={record => record.uid || record.name}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 个文件`
          }}
        />
      </Card>
    </div>
  )
}

export default Upload
