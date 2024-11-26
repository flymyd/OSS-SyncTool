import {Button, Card, Form, Input, InputNumber, message, Switch} from 'antd'
import {SaveOutlined} from '@ant-design/icons'
import {useEffect} from 'react'

function Settings() {
  const [form] = Form.useForm()
  const currentWorkspace = localStorage.getItem('currentWorkspace')

  useEffect(() => {
    // 加载已保存的配置
    const savedConfig = localStorage.getItem(`oss-config-${currentWorkspace}`)
    if (savedConfig) {
      form.setFieldsValue(JSON.parse(savedConfig))
    }
  }, [currentWorkspace])

  const onFinish = (values: any) => {
    try {
      if (!currentWorkspace || currentWorkspace === '新工作区') {
        message.error('请先创建或选择一个工作区')
        return
      }

      // 保存配置到本地存储
      localStorage.setItem(`oss-config-${currentWorkspace}`, JSON.stringify(values))
      message.success('设置保存成功')
    } catch (error) {
      message.error('设置保存失败')
    }
  }

  return (
    <div>
      <Card
        title="OSS 配置"
        extra={currentWorkspace === '新工作区' ?
          <span style={{ color: '#ff4d4f' }}>请先选择或创建工作区</span> :
          <span>当前工作区：{currentWorkspace}</span>
        }
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            accessKeyId: '',
            accessKeySecret: '',
            bucket: '',
            autoSync: false,
            syncInterval: 5
          }}
          onFinish={onFinish}
        >
          <Form.Item
            label="AccessKey ID"
            name="accessKeyId"
            rules={[{ required: true, message: '请输入 AccessKey ID' }]}
          >
            <Input placeholder="请输入 AccessKey ID" />
          </Form.Item>

          <Form.Item
            label="AccessKey Secret"
            name="accessKeySecret"
            rules={[{ required: true, message: '请输入 AccessKey Secret' }]}
          >
            <Input.Password placeholder="请输入 AccessKey Secret" />
          </Form.Item>

          <Form.Item
            label="Bucket"
            name="bucket"
            rules={[{ required: true, message: '请输入 Bucket 名称' }]}
          >
            <Input placeholder="请输入 Bucket 名称" />
          </Form.Item>

          <Form.Item
            label="自动同步"
            name="autoSync"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.autoSync !== currentValues.autoSync}
          >
            {({ getFieldValue }) =>
              getFieldValue('autoSync') ? (
                <Form.Item
                  label="同步间隔（分钟）"
                  name="syncInterval"
                  rules={[{ required: true, message: '请输入同步间隔' }]}
                >
                  <InputNumber min={1} max={60} />
                </Form.Item>
              ) : null
            }
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              htmlType="submit"
              disabled={!currentWorkspace || currentWorkspace === '新工作区'}
            >
              保存设置
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Settings
