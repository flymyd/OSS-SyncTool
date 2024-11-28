import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Space,
  Tag,
  Modal,
  Descriptions,
  Badge,
  message,
} from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import type { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import { getSyncTasks, getSyncTaskDetail, exportSyncTaskRecords } from '../services/sync-task';

const { RangePicker } = DatePicker;

const statusColors = {
  success: 'success',
  partial_success: 'warning',
  failed: 'error',
};

const SyncTasks: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentDetail, setCurrentDetail] = useState<any>(null);

  const fetchData = async (params: any = {}) => {
    setLoading(true);
    try {
      const { items, total } = await getSyncTasks({
        page: current,
        pageSize,
        ...params,
      });
      setData(items);
      setTotal(total);
    } catch (error) {
      console.error('获取同步任务列表失败:', error);
    }
    setLoading(false);
  };

  const handleSearch = async (values: any) => {
    const { timeRange, ...rest } = values;
    const params = {
      ...rest,
      startTime: timeRange?.[0]?.toISOString(),
      endTime: timeRange?.[1]?.toISOString(),
    };
    setCurrent(1);
    await fetchData(params);
  };

  const showDetail = async (record: any) => {
    try {
      const detail = await getSyncTaskDetail(record.id);
      setCurrentDetail(detail);
      setModalVisible(true);
    } catch (error) {
      console.error('获取同步任务详情失败:', error);
    }
  };

  const handleExport = (record: any) => {
    try {
      exportSyncTaskRecords(record.id);
    } catch (error) {
      console.error('导出失败:', error);
      message.error('导出失败');
    }
  };

  const columns = [
    {
      title: '工作区',
      dataIndex: ['workspace', 'name'],
    },
    {
      title: '创建者',
      dataIndex: ['creator', 'username'],
    },
    {
      title: '目标环境',
      dataIndex: 'targetEnv',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status: string) => (
        <Tag color={statusColors[status as keyof typeof statusColors]}>
          {status === 'success' ? '成功' : status === 'partial_success' ? '部分成功' : '失败'}
        </Tag>
      ),
    },
    {
      title: '文件总数',
      dataIndex: 'totalFiles',
    },
    {
      title: '失败数',
      dataIndex: 'failedFiles',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button color="primary"
              variant='outlined' onClick={() => showDetail(record)}>
            查看详情
          </Button>
          <Button 
            color="default"
            variant='outlined'
            onClick={() => handleExport(record)}
            icon={<DownloadOutlined />}
          >
            导出记录
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchData();
  }, [current, pageSize]);

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Form form={form} onFinish={handleSearch}>
          <Space wrap>
            <Form.Item name="workspaceName" label="工作区">
              <Input placeholder="请输入工作区名称" />
            </Form.Item>
            <Form.Item name="fileName" label="文件名">
              <Input placeholder="请输入文件名" />
            </Form.Item>
            <Form.Item name="filePath" label="文件路径">
              <Input placeholder="请输入文件路径" />
            </Form.Item>
            <Form.Item name="modifierName" label="更新人">
              <Input placeholder="请输入更新人" />
            </Form.Item>
            <Form.Item name="timeRange" label="时间范围">
              <RangePicker showTime />
            </Form.Item>
            <Form.Item name="status" label="状态">
              <Select
                placeholder="请选择状态"
                style={{ width: 120 }}
                allowClear
                options={[
                  { value: 'success', label: '成功' },
                  { value: 'partial_success', label: '部分成功' },
                  { value: 'failed', label: '失败' },
                ]}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                搜索
              </Button>
            </Form.Item>
          </Space>
        </Form>
      </Card>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{
          current,
          pageSize,
          total,
          onChange: (page, pageSize) => {
            setCurrent(page);
            setPageSize(pageSize);
          },
        }}
      />

      <Modal
        title="同步任务详情"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
        style={{ overflow: 'hidden' }}
      >
        {currentDetail && (
          <>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="工作区">{currentDetail.workspace.name}</Descriptions.Item>
              <Descriptions.Item label="创建者">{currentDetail.creator.username}</Descriptions.Item>
              <Descriptions.Item label="目标环境">{currentDetail.targetEnv}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Badge
                  status={statusColors[currentDetail.status as keyof typeof statusColors] as any}
                  text={
                    currentDetail.status === 'success'
                      ? '成功'
                      : currentDetail.status === 'partial_success'
                      ? '部分成功'
                      : '失败'
                  }
                />
              </Descriptions.Item>
              <Descriptions.Item label="文件总数">{currentDetail.totalFiles}</Descriptions.Item>
              <Descriptions.Item label="失败数">{currentDetail.failedFiles}</Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {dayjs(currentDetail.createdAt).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
            </Descriptions>

            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <Table
                style={{ marginTop: 16 }}
                columns={[
                  {
                    title: '文件名',
                    dataIndex: 'fileName',
                    width: 200,
                    ellipsis: true,
                    render: (text: string) => (
                      <div style={{ whiteSpace: 'normal' }}>{text}</div>
                    ),
                  },
                  {
                    title: '路径',
                    dataIndex: 'filePath',
                    width: 200,
                    ellipsis: true,
                    render: (text: string) => (
                      <div style={{ whiteSpace: 'normal' }}>{text}</div>
                    ),
                  },
                  {
                    title: '大小',
                    dataIndex: 'fileSize',
                    render: (size: number) => `${(size / 1024).toFixed(2)} KB`,
                  },
                  {
                    title: '更新人',
                    dataIndex: ['modifier', 'username'],
                  },
                  {
                    title: '状态',
                    dataIndex: 'status',
                    render: (status: string) => (
                      <Tag color={status === 'success' ? 'success' : 'error'}>
                        {status === 'success' ? '成功' : '失败'}
                      </Tag>
                    ),
                  },
                  {
                    title: '错误信息',
                    dataIndex: 'errorMessage',
                  },
                ]}
                dataSource={currentDetail.records}
                rowKey="id"
                pagination={false}
              />
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default SyncTasks; 