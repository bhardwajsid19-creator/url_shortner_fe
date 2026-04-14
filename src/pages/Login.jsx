import { Button, Form, Input, Typography, Divider } from 'antd'
import { LockOutlined, MailOutlined, LinkOutlined } from '@ant-design/icons'
import { useNavigate, useLocation, Link } from 'react-router-dom'

const { Title, Text } = Typography

export default function Login({ onLogin }) {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const location = useLocation()

  const onFinish = (values) => {
    console.log('Login:', values)
    onLogin?.()
    const from = location.state?.from?.pathname || '/'
    navigate(from, { replace: true })
  }

  return (
    <div className="bg-gray-50 flex items-center justify-center p-4 py-16">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-secondary p-3 rounded-full mb-3">
            <LinkOutlined className="text-primary text-2xl" />
          </div>
          <Title level={3} className="!mb-1">Welcome back</Title>
          <Text type="secondary">Sign in to your account</Text>
        </div>

        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Invalid email address' },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="you@example.com"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="••••••••"
              size="large"
            />
          </Form.Item>

          <div className="flex justify-end -mt-2 mb-4">
            <a href="#" className="text-sm text-primary hover:opacity-80">
              Forgot password?
            </a>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              Sign in
            </Button>
          </Form.Item>
        </Form>

        <Divider className="!text-gray-400 !text-xs">Don't have an account?</Divider>

        <Link to="/register">
          <Button size="large" block>Create account</Button>
        </Link>
      </div>
    </div>
  )
}
