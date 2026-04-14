import { useState } from "react";
import { motion } from "framer-motion";
import {
  Table, Button, Typography, Avatar, Tag, Space,
  Modal, Form, Input, Popconfirm, message, Tooltip, Card,
} from "antd";
import {
  UserOutlined, EditOutlined, DeleteOutlined, CopyOutlined,
  LinkOutlined, BarChartOutlined, CalendarOutlined,
} from "@ant-design/icons";
import profileData from "../data/urls.json";

const { Text } = Typography;
const { user, urls } = profileData;

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 20 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay },
});

export default function MyProfile() {
  const [data, setData]               = useState(urls);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form]                        = Form.useForm();
  const [messageApi, contextHolder]   = message.useMessage();

  const openEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({ originalUrl: record.originalUrl });
  };

  const handleEditSave = () => {
    form.validateFields().then((values) => {
      setData((prev) =>
        prev.map((row) =>
          row.key === editingRecord.key ? { ...row, originalUrl: values.originalUrl } : row
        )
      );
      setEditingRecord(null);
      form.resetFields();
      messageApi.success("URL updated successfully");
    });
  };

  const handleDelete = (key) => {
    setData((prev) => prev.filter((row) => row.key !== key));
    messageApi.success("URL deleted");
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    messageApi.success("Copied to clipboard");
  };

  const columns = [
    {
      title: "Original URL",
      dataIndex: "originalUrl",
      key: "originalUrl",
      ellipsis: true,
      render: (url) => (
        <Tooltip title={url} placement="topLeft">
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-primary text-sm">
            {url}
          </a>
        </Tooltip>
      ),
    },
    {
      title: "Short URL",
      dataIndex: "shortUrl",
      key: "shortUrl",
      width: 200,
      render: (url) => (
        <div className="flex items-center gap-1">
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary text-sm font-medium">
            {url.replace("https://", "")}
          </a>
          <Tooltip title="Copy">
            <Button type="text" size="small" icon={<CopyOutlined />} className="text-gray-400 hover:text-primary" onClick={() => handleCopy(url)} />
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Clicks",
      dataIndex: "clicks",
      key: "clicks",
      width: 100,
      sorter: (a, b) => a.clicks - b.clicks,
      render: (clicks) => (
        <Tag color={clicks > 200 ? "green" : clicks > 50 ? "orange" : "default"}>
          {clicks.toLocaleString()}
        </Tag>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 140,
      render: (date) => <Text type="secondary" className="text-sm">{date}</Text>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button type="text" size="small" icon={<EditOutlined />} className="text-gray-500 hover:text-primary" onClick={() => openEdit(record)} />
          </Tooltip>
          <Popconfirm
            title="Delete this URL?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record.key)}
            okText="Delete"
            okButtonProps={{ danger: true }}
            cancelText="Cancel"
          >
            <Tooltip title="Delete">
              <Button type="text" size="small" icon={<DeleteOutlined />} className="text-gray-500 hover:text-red-500" />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const totalClicks = data.reduce((sum, r) => sum + r.clicks, 0);

  return (
    <div className="relative min-h-full overflow-hidden bg-orange-50 py-10 px-4">
      {/* Background orbs */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-orange-300/25 blur-3xl" />

      {contextHolder}
      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Profile card */}
        <motion.div {...fadeUp(0)}>
          <Card className="mb-6 rounded-2xl !shadow-md !border-orange-100/60">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <Avatar
                  size={72}
                  icon={<UserOutlined />}
                  className="bg-gradient-to-br from-primary to-orange-400 shrink-0 shadow-lg shadow-orange-200"
                />
              </motion.div>

              <div className="flex-1">
                <p className="text-xl font-bold text-gray-900">{user.name}</p>
                <Text type="secondary">{user.email}</Text>
              </div>

              <div className="flex gap-6 text-center">
                {[
                  { value: data.length,             label: "URLs",          icon: <LinkOutlined /> },
                  { value: totalClicks.toLocaleString(), label: "Total clicks", icon: <BarChartOutlined /> },
                  {
                    value: new Date(user.joinedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
                    label: "Joined",
                    icon: <CalendarOutlined />,
                  },
                ].map(({ value, label, icon }) => (
                  <motion.div key={label} {...fadeUp(0.1)}>
                    <div className="text-2xl font-bold text-gray-800">{value}</div>
                    <div className="text-xs text-gray-400 flex items-center gap-1 justify-center">
                      {icon} {label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* URLs table */}
        <motion.div {...fadeUp(0.15)}>
          <Card className="rounded-2xl !shadow-md !border-orange-100/60">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-base text-gray-800">My URLs</p>
              <Text type="secondary" className="text-sm">{data.length} total</Text>
            </div>
            <Table
              columns={columns}
              dataSource={data}
              rowKey="key"
              scroll={{ x: 700 }}
              pagination={{
                pageSize: 8,
                showSizeChanger: true,
                pageSizeOptions: ["8", "16", "24"],
                showTotal: (total, range) => `${range[0]}–${range[1]} of ${total}`,
              }}
            />
          </Card>
        </motion.div>
      </div>

      {/* Edit modal */}
      <Modal
        title="Edit URL"
        open={!!editingRecord}
        onOk={handleEditSave}
        onCancel={() => { setEditingRecord(null); form.resetFields(); }}
        okText="Save"
        destroyOnHidden
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item label="Short URL">
            <Input value={editingRecord?.shortUrl} disabled />
          </Form.Item>
          <Form.Item
            name="originalUrl"
            label="Destination URL"
            rules={[
              { required: true, message: "Please enter a URL" },
              { type: "url",    message: "Enter a valid URL" },
            ]}
          >
            <Input placeholder="https://example.com/long-url" size="large" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
