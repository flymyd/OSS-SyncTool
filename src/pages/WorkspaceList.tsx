import {useEffect, useState} from 'react';
import {Button, message, Modal, Space, Table} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import {ExclamationCircleOutlined} from '@ant-design/icons';
import {deleteWorkspace, getWorkspaces, Workspace} from '../services/workspace';
import {useSelector} from 'react-redux';
import type {RootState} from '../store';

interface WorkspaceListProps {
  onWorkspaceSelect: (workspace: string) => void;
}

function WorkspaceList({ onWorkspaceSelect }: WorkspaceListProps) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(false);
  const currentUserId = useSelector((state: RootState) => state.auth.userId);

  const fetchWorkspaces = async () => {
    try {
      setLoading(true);
      const data = await getWorkspaces();
      setWorkspaces(data);
    } catch (error) {
      console.error('获取工作区列表失败:', error);
      message.error('获取工作区列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (workspace: Workspace) => {
    Modal.confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除工作区"${workspace.name}"吗？此操作不可恢复。`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteWorkspace(workspace.id);
          message.success('删除成功');
          fetchWorkspaces();
        } catch (error) {
          console.error('删除工作区失败:', error);
        }
      },
    });
  };

  const columns: ColumnsType<Workspace> = [
    {
      title: '工作区名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '创建者',
      dataIndex: ['creator', 'username'],
      key: 'creator',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => onWorkspaceSelect(record.name)}
          >
            切换
          </Button>
          {record.creator.id === currentUserId && (
            <Button
              type="link"
              danger
              onClick={() => handleDelete(record)}
            >
              删除
            </Button>
          )}
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  return (
    <Table
      columns={columns}
      dataSource={workspaces}
      rowKey="id"
      loading={loading}
    />
  );
}

export default WorkspaceList;
