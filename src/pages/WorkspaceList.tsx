import { useEffect, useState } from 'react';
import { Button, message, Modal, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { deleteWorkspace, getWorkspaces } from '../services/workspace';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import type { WorkspaceResponseDto } from '../types/workspace';

interface WorkspaceListProps {
  onWorkspaceSelect: (workspace: { name: string; id: number }) => void;
}

function WorkspaceList({ onWorkspaceSelect }: WorkspaceListProps) {
  const [workspaces, setWorkspaces] = useState<WorkspaceResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const currentUserId = useSelector((state: RootState) => state.auth.userId);
  const currentWorkspaceId = useSelector((state: RootState) => state.workspace.currentWorkspaceId);

  const fetchWorkspaces = async () => {
    try {
      setLoading(true);
      const response = await getWorkspaces();
      setWorkspaces(response || []);
    } catch (error) {
      message.error('获取工作区列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (workspace: WorkspaceResponseDto) => {
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

  const columns: ColumnsType<WorkspaceResponseDto> = [
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
          {record.id === currentWorkspaceId ? (
            <Button type="dashed" disabled>
              当前工作区
            </Button>
          ) : (
            <Button
              color="primary"
              variant='outlined'
              onClick={() => onWorkspaceSelect({
                name: record.name,
                id: record.id
              })}
            >
              切换
            </Button>
          )}
          {(record.creator.id === currentUserId) && !(record.id === currentWorkspaceId) && (
            <Button
              color="danger"
              variant='outlined'
              disabled={record.id === currentWorkspaceId}
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
