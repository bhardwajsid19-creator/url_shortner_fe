import { motion } from "framer-motion";
import { Button, Form, Input, Divider } from "antd";
import { LockOutlined, MailOutlined, UserOutlined, LinkOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";

const fadeUp = {
  initial:    { opacity: 0, y: 28 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
};

export default function Register({ onLogin }) {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log("Register:", values);
    onLogin?.();
    navigate("/");
  };

  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-orange-50 px-4 py-16">
      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-float absolute -top-32 -right-32 h-72 w-72 rounded-full bg-orange-300/25 blur-3xl" />
        <div className="animate-float-delayed absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-amber-300/20 blur-3xl" />
      </div>

      <motion.div
        {...fadeUp}
        className="glass-card relative z-10 w-full max-w-sm rounded-2xl p-8"
      >
        {/* Header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-orange-400 text-white shadow-lg shadow-orange-200">
            <LinkOutlined className="text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Create an account</h2>
          <p className="mt-1 text-sm text-gray-500">Start shortening URLs for free</p>
        </div>

        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            name="name"
            label={<span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Full name</span>}
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-300" />}
              placeholder="John Doe"
              size="large"
              className="rounded-xl"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label={<span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Email</span>}
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email",  message: "Invalid email address" },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-300" />}
              placeholder="you@example.com"
              size="large"
              className="rounded-xl"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Password</span>}
            rules={[
              { required: true, message: "Please enter a password" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-300" />}
              placeholder="Min. 8 characters"
              size="large"
              className="rounded-xl"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label={<span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Confirm password</span>}
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) return Promise.resolve();
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-300" />}
              placeholder="Re-enter password"
              size="large"
              className="rounded-xl"
            />
          </Form.Item>

          <Form.Item className="!mb-0">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              className="!rounded-xl !h-11 !font-semibold !shadow-md !shadow-orange-200"
            >
              Create account
            </Button>
          </Form.Item>
        </Form>

        <Divider className="!text-gray-400 !text-xs">Already have an account?</Divider>

        <Link to="/login">
          <Button size="large" block className="!rounded-xl">
            Sign in
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
