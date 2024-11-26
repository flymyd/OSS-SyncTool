import type { UploadProps } from 'antd'
import { Card, message, Table, Upload as AntUpload, Input, Button } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { workspaceRecordApi } from '../services/workspace-record'
import type { RootState } from '../store'
import { getFileHash } from '../utils/file'
import dayjs from 'dayjs'

const { Dragger } = AntUpload

// 文件大小格式化
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 添加获取文件名的辅助函数
const getFileName = (filePath: string) => {
  const parts = filePath.split('/')
  return parts[parts.length - 1]
}

function Upload() {
  const [fileList, setFileList] = useState<any[]>([])
  const [pathPrefix, setPathPrefix] = useState('v2/')
  const currentWorkspaceId = useSelector((state: RootState) => state.workspace.currentWorkspaceId)
  const currentWorkspace = useSelector((state: RootState) => state.workspace.currentWorkspace)
  const username = useSelector((state: RootState) => state.auth.username)
  const [records, setRecords] = useState<any[]>([])

  // 获取上传记录
  const fetchRecords = async () => {
    if (!currentWorkspaceId) return
    try {
      const data = await workspaceRecordApi.getRecords(currentWorkspaceId)
      setRecords(data)
    } catch (error) {
      message.error('获取上传记录失败')
    }
  }

  // 在工作区ID变化时获取记录
  useEffect(() => {
    fetchRecords()
  }, [currentWorkspaceId])

  // 验证上传条件
  const isUploadDisabled = () => {
    if (!currentWorkspaceId) {
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
    customRequest: async (options) => {
      const { file, onSuccess, onError, onProgress } = options
      try {
        const fileObj = file as File
        const filePath = pathPrefix + fileObj.name
        const etag = await getFileHash(fileObj)

        await workspaceRecordApi.create({
          workspaceId: currentWorkspaceId!,
          filePath,
          etag,
          size: fileObj.size,
          file: fileObj,
        })

        onSuccess?.('上传成功')
      } catch (error) {
        onError?.(error as Error)
      }
    },
    disabled: isUploadDisabled(),
    onChange(info) {
      const { status } = info.file
      const newFileList = [...info.fileList].map(file => ({
        ...file,
        status: file.status,
        size: formatFileSize(file.size || 0),
        uploadTime: new Date().toLocaleString(),
        operator: username
      }))

      setFileList(newFileList)

      if (status === 'done') {
        message.success(`${info.file.name} 文件上传成功`)
        // 上传成功后刷新记录列表
        fetchRecords()
      } else if (status === 'error') {
        message.error(`${info.file.name} 文件上传失败`)
      }
    },
    beforeUpload: (file) => {
      if (isUploadDisabled()) {
        if (!currentWorkspaceId) {
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
      dataIndex: 'filePath',
      key: 'filePath',
      render: (filePath: string) => getFileName(filePath),
    },
    {
      title: '文件路径',
      dataIndex: 'filePath',
      key: 'etag',
      ellipsis: true,
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      width: 150,
      render: (size: number) => formatFileSize(size),
    },
    {
      title: '上传时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 200,
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作人',
      dataIndex: ['modifier', 'username'],
      key: 'operator',
      width: 120,
    },
  ]

  return (
    <div>
      <Card
        title={
          <div>
            <span style={{ marginRight: 16 }}>文件上传</span>
            {!currentWorkspaceId ? (
              <span style={{ color: '#ff4d4f', marginLeft: 8 }}>请先选择或创建工作区</span>
            ) : (
              <span style={{ color: 'red', marginLeft: 8 }}>当前工作区：{currentWorkspace}</span>
            )}
          </div>
        }
        style={{ marginBottom: 24 }}
      >
        <div style={{ marginBottom: 16, display: 'flex', gap: 6, alignItems: 'center' }}>
          <span>选择上传路径前缀：</span>
          <Button color="primary" variant="outlined" onClick={() => setPathPrefix('/v2/')}>/v2/</Button>
          <Button color="primary" variant="outlined" onClick={() => setPathPrefix('/v2/activity/')}>/v2/activity/</Button>
          <Button color="primary" variant="outlined" onClick={() => setPathPrefix('/v2/user/')}>/v2/user/</Button>
          <Button color="primary" variant="outlined" onClick={() => setPathPrefix('/v2/user/home/')}>/v2/user/home/</Button>
        </div>
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
          <Input
            placeholder="或自定义上传路径前缀，必须以/结尾"
            value={pathPrefix}
            onChange={(e) => setPathPrefix(e.target.value)}
            style={{ flex: 1 }}
          />
          {
            pathPrefix && !pathPrefix.endsWith('/') ?
              <span style={{ color: '#ff4d4f', marginLeft: 16 }}>上传路径前缀必须以/结尾！</span> :
              null
          }
        </div>
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p className="ant-upload-hint">
            支持单个或批量上传，严禁上传违禁文件
          </p>
        </Dragger>
      </Card>

      <Card title="上传历史">
        <Table
          columns={columns}
          dataSource={records}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </div>
  )
}

export default Upload
