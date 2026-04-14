import { useState } from "react";
import {
  Table,
  Button,
  Typography,
  Avatar,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  Popconfirm,
  message,
  Tooltip,
  Card,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  LinkOutlined,
  BarChartOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import profileData from "../data/urls.json";

const { Title, Text } = Typography;

const { user, urls } = profileData;

export default function MyProfile() {
  const [data, setData] = useState(urls);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  // ── Edit ──────────────────────────────────────────────
  const openEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({ originalUrl: record.originalUrl });
  };

  const handleEditSave = () => {
    form.validateFields().then((values) => {
      setData((prev) =>
        prev.map((row) =>
          row.key === editingRecord.key
            ? { ...row, originalUrl: values.originalUrl }
            : row,
        ),
      );
      setEditingRecord(null);
      form.resetFields();
      messageApi.success("URL updated successfully");
    });
  };

  // ── Delete ────────────────────────────────────────────
  const handleDelete = (key) => {
    setData((prev) => prev.filter((row) => row.key !== key));
    messageApi.success("URL deleted");
  };

  // ── Copy ─────────────────────────────────────────────
  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    messageApi.success("Copied to clipboard");
  };

  // ── Columns ───────────────────────────────────────────
  const columns = [
    {
      title: "Original URL",
      dataIndex: "originalUrl",
      key: "originalUrl",
      ellipsis: true,
      render: (url) => (
        <Tooltip title={url} placement="topLeft">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-primary text-sm"
          >
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
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary text-sm font-medium"
          >
            {url.replace("https://", "")}
          </a>
          <Tooltip title="Copy">
            <Button
              type="text"
              size="small"
              icon={<CopyOutlined />}
              className="text-gray-400 hover:text-primary"
              onClick={() => handleCopy(url)}
            />
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
      render: (date) => (
        <Text type="secondary" className="text-sm">
          {date}
        </Text>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              className="text-gray-500 hover:text-primary"
              onClick={() => openEdit(record)}
            />
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
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                className="text-gray-500 hover:text-red-500"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-gray-50 min-h-full py-10 px-4">
      {contextHolder}
      <div className="max-w-6xl mx-auto">
        {/* Profile card */}
        <Card className="mb-6 rounded-2xl shadow-sm border-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar
              size={72}
              icon={<UserOutlined />}
              className="bg-primary shrink-0"
            />
            <div className="flex-1">
              <Title level={4} className="!mb-0">
                {user.name}
              </Title>
              <Text type="secondary">{user.email}</Text>
            </div>
            <div className="flex gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {data.length}
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <LinkOutlined /> URLs
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {data.reduce((sum, r) => sum + r.clicks, 0).toLocaleString()}
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <BarChartOutlined /> Total clicks
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {new Date(user.joinedAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <CalendarOutlined /> Joined
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* URLs table */}
        <Card className="rounded-2xl shadow-sm border-0">
          <div className="flex items-center justify-between mb-4">
            <Title level={5} className="!mb-0">
              My URLs
            </Title>
            <Text type="secondary" className="text-sm">
              {data.length} total
            </Text>
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
              showTotal: (total, range) =>
                `${range[0]}–${range[1]} of ${total}`,
            }}
          />
        </Card>
      </div>

      {/* Edit modal */}
      <Modal
        title="Edit URL"
        open={!!editingRecord}
        onOk={handleEditSave}
        onCancel={() => {
          setEditingRecord(null);
          form.resetFields();
        }}
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
              { type: "url", message: "Enter a valid URL" },
            ]}
          >
            <Input placeholder="https://example.com/long-url" size="large" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
