import React, { useEffect, useMemo, useState } from 'react'
import type { GetProps, TreeDataNode } from 'antd'
import { Button, Card, Input, Layout, message, Modal, Select, Space, Spin, Tree, Typography, Tooltip, Image } from 'antd'
import { FileOutlined, FolderOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { workspaceRecordApi } from '../services/workspace-record'
import type { FileInfo } from '../types/workspace'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store';

const { DirectoryTree } = Tree
const { Sider, Content } = Layout
const { Text, Title } = Typography
const { Search } = Input

type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>

interface FileCardProps {
  file: FileInfo
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8965';

// 添加文件大小转换函数
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 KB'
  const kb = bytes / 1024
  if (kb < 1024) {
    return `${kb.toFixed(2)} KB`
  }
  const mb = kb / 1024
  if (mb < 1024) {
    return `${mb.toFixed(2)} MB`
  }
  const gb = mb / 1024
  return `${gb.toFixed(2)} GB`
}

// 添加判断是否为图片的辅助函数
const isImageFile = (fileName: string): boolean => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
  const ext = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
  return imageExtensions.includes(ext);
};

const FileCard: React.FC<FileCardProps> = ({ file }) => {
  const isImage = isImageFile(file.name);
  const previewUrl = isImage && file.id > 0 ? `${API_URL}/workspace-record/preview/${file.id}` : null;

  return (
    <Card
      hoverable
      styles={{ header: { backgroundColor: '#f0f0f0' } }}
      title={
        <Space>
          <FileOutlined />
          {file.name}
        </Space>
      }
      size="small"
      style={{ marginBottom: 8 }}
    >
      {isImage && previewUrl && (
        <div style={{ marginBottom: 8 }}>
          <Image
            src={previewUrl}
            alt={file.name}
            style={{ maxWidth: 200, maxHeight: 150, objectFit: 'contain' }}
            preview={{
              src: previewUrl,
              mask: '预览'
            }}
          />
        </div>
      )}
      <p>文件大小：{formatFileSize(file.size)}</p>
      <p>修改时间：{dayjs(file.modifiedTime).format('YYYY-MM-DD HH:mm:ss')}</p>
      <p>MD5：{file.etag}</p>
    </Card>
  );
};

const DirectoryCard: React.FC<FileCardProps> = ({ file }) => (
  <Card
    hoverable
    styles={{ header: { backgroundColor: '#d0d0d0' } }}
    title={
      <Space>
        <FolderOutlined />
        {file.name}
      </Space>
    }
    size="small"
    style={{ marginBottom: 8 }}
  >
    {file.children?.map(child => (
      <p key={child.name}>
        {child.isDirectory ? <FolderOutlined /> : <FileOutlined />}
        <span style={{ marginLeft: 8 }}>
          {child.name} - {dayjs(child.modifiedTime).format('YYYY-MM-DD HH:mm:ss')}
        </span>
      </p>
    ))}
  </Card>
)

// 添加自定义树节点标题组件
const TreeNodeTitle: React.FC<{ title: string }> = ({ title }) => (
  <div style={{
    display: 'inline-block',
    maxWidth: '200px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
    userSelect: 'none',
  }}>
    {title}
  </div>
);

// 修改 convertToTreeData 函数
const convertToTreeData = (files: FileInfo[]): TreeDataNode[] => {
  return files.map(file => ({
    title: file.name,  // 直接使用字符串而不是组件
    key: file.path,
    icon: file.isDirectory ? <FolderOutlined /> : <FileOutlined />,
    isLeaf: !file.isDirectory,
    children: file.isDirectory ? convertToTreeData(file.children || []) : undefined,
  }));
};

// 修改获取所有选中文件的递归函数，添加去重逻辑
const getAllSelectedFiles = (selectedPaths: string[], fileTree: FileInfo[]): FileInfo[] => {
  const result: FileInfo[] = [];
  const seenPaths = new Set<string>();  // 用于记录已处理的文件路径

  const findFiles = (path: string, tree: FileInfo[]) => {
    for (const node of tree) {
      // 如果当前路径已经处理过，跳过
      if (seenPaths.has(node.path)) {
        continue;
      }

      if (selectedPaths.includes(node.path)) {
        if (node.isDirectory) {
          // 如果是目录，递归添加所有子文件
          const getAllFilesInDir = (dirNode: FileInfo) => {
            if (dirNode.children) {
              for (const child of dirNode.children) {
                if (!seenPaths.has(child.path)) {
                  seenPaths.add(child.path);
                  if (child.isDirectory) {
                    getAllFilesInDir(child);
                  } else {
                    result.push(child);
                  }
                }
              }
            }
          };
          getAllFilesInDir(node);
        } else {
          // 如果是文件，直接添加
          seenPaths.add(node.path);
          result.push(node);
        }
      } else if (node.children) {
        // 继续搜索子目录
        findFiles(path, node.children);
      }
    }
  };

  selectedPaths.forEach(path => findFiles(path, fileTree));
  return result;
};

const WorkspaceRecord: React.FC = () => {
  const navigate = useNavigate();
  const currentWorkspaceId = useSelector((state: RootState) => state.workspace.currentWorkspaceId);

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [selectedNodes, setSelectedNodes] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'modifiedTime'>('name');
  const [originalData, setOriginalData] = useState<FileInfo[]>([]);

  // 搜索过滤函数
  const filterTreeData = (data: FileInfo[], searchText: string): FileInfo[] => {
    if (!searchText) return data

    return data.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase())
      if (item.children) {
        const filteredChildren = filterTreeData(item.children, searchText)
        item.children = filteredChildren
        return matchesSearch || filteredChildren.length > 0
      }
      return matchesSearch
    })
  }

  // 排序函数
  const sortTreeData = (data: FileInfo[]): FileInfo[] => {
    return data.map(item => {
      const newItem = { ...item }
      if (newItem.children) {
        newItem.children = sortTreeData(newItem.children)
      }
      return newItem
    }).sort((a, b) => {
      if (a.isDirectory !== b.isDirectory) {
        return a.isDirectory ? -1 : 1
      }
      switch (sortBy) {
        case 'size':
          return a.size - b.size
        case 'modifiedTime':
          return dayjs(a.modifiedTime).unix() - dayjs(b.modifiedTime).unix()
        default:
          return a.name.localeCompare(b.name)
      }
    })
  }

  // 使用 useMemo 处理过滤和排序后的数据
  const processedData = useMemo(() => {
    let result = JSON.parse(JSON.stringify(originalData)) // 深拷贝原始数据
    result = filterTreeData(result, searchValue)
    result = sortTreeData(result)
    return result
  }, [originalData, searchValue, sortBy])

  // 转换为树形结构数据
  const treeData = useMemo(() => {
    return convertToTreeData(processedData)
  }, [processedData])

  // 获取文件树数据
  useEffect(() => {
    const fetchFileTree = async () => {
      if (!currentWorkspaceId) {
        message.warning('请先选择工作区');
        navigate('/dashboard/workspaces');
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await workspaceRecordApi.getFileTree(currentWorkspaceId);
        setOriginalData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '未知错误');
        message.error('加载文件列表失败');
      } finally {
        setLoading(false);
      }
    };

    fetchFileTree();
  }, [currentWorkspaceId, navigate]);

  // 选择节点时更新选中状态
  const onSelect: DirectoryTreeProps['onSelect'] = (keys, info) => {
    setSelectedKeys(keys as string[])

    // 根据选中的key查找对应的节点信息
    const findNodes = (data: FileInfo[], keys: string[]): FileInfo[] => {
      const result: FileInfo[] = []
      const traverse = (items: FileInfo[]) => {
        items.forEach(item => {
          if (keys.includes(item.path)) {
            result.push(item)
          }
          if (item.children) {
            traverse(item.children)
          }
        })
      }
      traverse(originalData)
      return result
    }

    setSelectedNodes(findNodes(originalData, keys as string[]))
  }

  // 将 handleSync 移到组件内部
  const handleSync = async (env: 'dev' | 'test' | 'prod') => {
    // 获取所有需要同步的文件（已去重）
    const filesToSync = getAllSelectedFiles(selectedKeys, originalData);

    if (filesToSync.length === 0) {
      message.warning('没有选择任何文件进行同步');
      return;
    }

    Modal.confirm({
      title: `确认同步到${env === 'test' ? '测试' : env === 'dev' ? '开发' : '生产'}环境？`,
      content: `此操作将同步 ${filesToSync.length} 个文件到目标环境，请确认。`,
      onOk: async () => {
        try {
          setLoading(true);

          // 准备同步数据，确保包含 id 字段
          const syncData = filesToSync.map(file => ({
            id: file.id,        // 添加 id 字段
            path: file.path,
            name: file.name,
            size: file.size,
            etag: file.etag
          }));

          // 调用同步API
          const res = await workspaceRecordApi.syncFiles(currentWorkspaceId!, env, syncData);
          if (res.status !== 'success') {
            message.error(`同步失败：${res.failedFiles} 个文件同步失败，请在同步记录中查看日志`);
          } else message.success(`成功同步 ${filesToSync.length} 个文件到${env === 'test' ? '测试' : env === 'dev' ? '开发' : '生产'}环境`);
        } catch (error) {
          console.log(error)
          message.error('同步失败：' + (error instanceof Error ? error.message : '未知错误'));
        } finally {
          setLoading(false);
        }
      },
    });
  };

  if (error) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>
      <Text type="danger">{error}</Text>
      <Button onClick={() => window.location.reload()}>重试</Button>
    </div>
  }
  const currentWorkspace = useSelector((state: RootState) => state.workspace.currentWorkspace)
  return (
    <Spin spinning={loading}>
      <div style={{ height: 'calc(100vh - 260px)' }}>
        <Space style={{ marginBottom: 16, fontSize: 16, fontWeight: 'bold', color: 'red' }}>当前工作区：{currentWorkspace}</Space>
        <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
          <Space>
            <Button type="default" onClick={() => handleSync('dev')} disabled={selectedKeys.length === 0}>
              同步到dev环境
            </Button>
            <Button type="primary" onClick={() => handleSync('test')} disabled={selectedKeys.length === 0}>
              同步到test环境
            </Button>
            <Button type="primary" danger onClick={() => handleSync('prod')} disabled={selectedKeys.length === 0}>
              同步到prod环境
            </Button>
          </Space>
          <Space>
            <Search
              placeholder="搜索文件或目录"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              style={{ width: 200 }}
              allowClear
            />
            <Select
              value={sortBy}
              onChange={setSortBy}
              style={{ width: 120 }}
              options={[
                { label: '按名称排序', value: 'name' },
                { label: '按大小排序', value: 'size' },
                { label: '按时间排序', value: 'modifiedTime' },
              ]}
            />
          </Space>
        </Space>
        <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
          <Text type="secondary">提示：按住 Ctrl键（Windows）或 Command键（macOS）以复选，选择后点击上方按钮同步。</Text>
        </Space>

        <Layout style={{ height: '100%', background: '#fff' }}>
          <Sider
            width={350}
            style={{
              background: '#fff',
              borderRight: '1px solid #f0f0f0',
              overflow: 'auto',
              position: 'relative'  // 添加相对定位
            }}
          >
            <DirectoryTree
              multiple
              defaultExpandAll
              onSelect={onSelect}
              treeData={treeData}
              style={{
                padding: '8px',
                overflow: 'hidden'  // 防止溢出
              }}
              titleRender={(node) => (
                <Tooltip title={typeof node.title === 'string' ? node.title : ''}>
                  <TreeNodeTitle title={typeof node.title === 'string' ? node.title : ''} />
                </Tooltip>
              )}
            />
          </Sider>
          <Content style={{ padding: '0 24px', overflow: 'auto' }}>
            <Title level={5} style={{ marginBottom: 16 }}>
              已选择 {selectedNodes.length} 项（
              {selectedNodes.filter(n => !n.isDirectory).length} 个文件，
              {selectedNodes.filter(n => n.isDirectory).length} 个目录）
            </Title>
            {selectedNodes.map(node => (
              node.isDirectory ?
                <DirectoryCard key={node.path} file={node} /> :
                <FileCard key={node.path} file={node} />
            ))}
          </Content>
        </Layout>
      </div>
    </Spin>
  )
}

export default WorkspaceRecord
