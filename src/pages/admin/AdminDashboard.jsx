import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Input,
  Table,
  Tag,
  Switch,
  Button,
  Avatar,
  Typography,
  Card,
  Tooltip,
  message,
  Badge,
  Select,
  Empty,
  Statistic,
  Row,
  Col,
} from "antd";
import {
  SearchOutlined,
  UserOutlined,
  LinkOutlined,
  SafetyCertificateOutlined,
  CrownOutlined,
  CheckCircleOutlined,
  StopOutlined,
  TeamOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import adminData from "../../data/adminUsers.json";

const { Text } = Typography;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1], delay },
});

export default function AdminDashboard({ onAdminLogout }) {
  const [users, setUsers] = useState(adminData.users);
  const [query, setQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const handleSearch = () => {
    const q = query.trim().toLowerCase();
    if (!q) return;
    const found = users.find(
      (u) => u.id.toLowerCase() === q || u.email.toLowerCase() === q,
    );
    if (found) {
      setSelectedUser(found);
    } else {
      messageApi.warning("No user found with that ID or email");
      setSelectedUser(null);
    }
  };

  const patchUser = (id, changes) => {
    const updated = users.map((u) => (u.id === id ? { ...u, ...changes } : u));
    setUsers(updated);
    setSelectedUser((prev) =>
      prev?.id === id ? { ...prev, ...changes } : prev,
    );
  };

  const patchUrl = (userId, urlKey, changes) => {
    const updated = users.map((u) => {
      if (u.id !== userId) return u;
      return {
        ...u,
        urls: u.urls.map((url) =>
          url.key === urlKey ? { ...url, ...changes } : url,
        ),
      };
    });
    setUsers(updated);
    setSelectedUser((prev) =>
      prev?.id === userId
        ? {
            ...prev,
            urls: prev.urls.map((url) =>
              url.key === urlKey ? { ...url, ...changes } : url,
            ),
          }
        : prev,
    );
  };

  const toggleUser = (id, checked) => {
    patchUser(id, { isActive: checked });
    messageApi.success(`User ${checked ? "enabled" : "disabled"}`);
  };

  const changeRole = (id, role) => {
    patchUser(id, { role });
    messageApi.success(`Role updated to ${role}`);
  };

  const toggleUrl = (userId, urlKey, checked) => {
    patchUrl(userId, urlKey, { isActive: checked });
    messageApi.success(`Short URL ${checked ? "enabled" : "disabled"}`);
  };

  const totalUrls = users.reduce((s, u) => s + u.urls.length, 0);
  const totalClicks = users.reduce(
    (s, u) => s + u.urls.reduce((ss, url) => ss + url.clicks, 0),
    0,
  );
  const activeUsers = users.filter((u) => u.isActive).length;

  const STATS = [
    {
      title: "Total Users",
      value: users.length,
      icon: <TeamOutlined />,
      color: "text-amber-400",
    },
    {
      title: "Active Users",
      value: activeUsers,
      icon: <CheckCircleOutlined />,
      color: "text-green-400",
    },
    {
      title: "Total Short URLs",
      value: totalUrls,
      icon: <LinkOutlined />,
      color: "text-purple-400",
    },
    {
      title: "Total Clicks",
      value: totalClicks,
      icon: <BarChartOutlined />,
      color: "text-yellow-400",
    },
  ];

  const urlColumns = [
    {
      title: "Short URL",
      dataIndex: "shortUrl",
      key: "shortUrl",
      width: 180,
      render: (url) => (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-400 hover:opacity-80 text-sm font-medium"
        >
          {url.replace("https://", "")}
        </a>
      ),
    },
    {
      title: "Destination",
      dataIndex: "originalUrl",
      key: "originalUrl",
      ellipsis: true,
      render: (url) => (
        <Tooltip title={url} placement="topLeft">
          <span className="text-gray-300 text-sm">{url}</span>
        </Tooltip>
      ),
    },
    {
      title: "Clicks",
      dataIndex: "clicks",
      key: "clicks",
      width: 90,
      sorter: (a, b) => a.clicks - b.clicks,
      render: (clicks) => (
        <Tag
          color={clicks > 300 ? "green" : clicks > 100 ? "orange" : "default"}
        >
          {clicks.toLocaleString()}
        </Tag>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (d) => <Text className="!text-gray-400 text-sm">{d}</Text>,
    },
    {
      title: "Status",
      key: "isActive",
      width: 110,
      render: (_, record) => (
        <Switch
          checked={record.isActive}
          checkedChildren="Active"
          unCheckedChildren="Off"
          onChange={(checked) =>
            toggleUrl(selectedUser.id, record.key, checked)
          }
          size="small"
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {contextHolder}

      {/* Top bar */}
      <motion.header
        initial={{ y: -56, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50"
      >
        {/* top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-orange-600 text-white shadow-lg shadow-red-900/40">
            <SafetyCertificateOutlined className="text-base" />
          </div>
          <div>
            <p className="font-bold text-white text-sm leading-none">
              Admin Dashboard
            </p>
            <p className="text-gray-500 text-xs mt-1.5">
              ToShort — Restricted access
            </p>
          </div>
        </div>
        <Button
          danger
          size="small"
          onClick={() => {
            onAdminLogout?.();
            window.location.href = "/admin/login";
          }}
        >
          Sign out
        </Button>
      </motion.header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <Row gutter={16} className="mb-8">
          {STATS.map((stat, i) => (
            <Col xs={12} md={6} key={stat.title}>
              <motion.div {...fadeUp(i * 0.07)}>
                <Card className="!bg-gray-900 !border-gray-800 rounded-xl mb-4 md:mb-0 hover:!border-gray-700 transition-colors">
                  <div className={`text-2xl mb-1 ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <Statistic
                    title={
                      <span className="text-gray-500 text-xs">
                        {stat.title}
                      </span>
                    }
                    value={stat.value}
                    valueStyle={{
                      color: "#fff",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                    }}
                  />
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Search */}
        <motion.div {...fadeUp(0.28)}>
          <Card className="!bg-gray-900 !border-gray-800 rounded-xl mb-6">
            <p className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
              <SearchOutlined className="text-gray-400" />
              Look up user
            </p>
            <div className="flex gap-3">
              <Input
                placeholder="Enter user ID (e.g. USR001) or email"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onPressEnter={handleSearch}
                size="large"
                className="!bg-gray-800 !border-gray-700 !text-white !rounded-xl"
                prefix={<UserOutlined className="text-gray-500" />}
                allowClear
              />
              <Button
                type="primary"
                size="large"
                onClick={handleSearch}
                icon={<SearchOutlined />}
                className="!rounded-xl"
              >
                Search
              </Button>
            </div>
            <Text className="!text-gray-600 text-xs mt-2 block">
              Try: USR001 · USR002 · USR003 · or an email like jane@example.com
            </Text>
          </Card>
        </motion.div>

        {/* User result */}
        <AnimatePresence mode="wait">
          {selectedUser ? (
            <motion.div
              key={selectedUser.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* User info card */}
              <Card className="!bg-gray-900 !border-gray-800 rounded-xl mb-4 hover:!border-gray-700 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <Badge
                    dot
                    color={selectedUser.isActive ? "green" : "red"}
                    offset={[-4, 60]}
                  >
                    <Avatar
                      size={64}
                      icon={<UserOutlined />}
                      className="bg-primary shrink-0"
                    />
                  </Badge>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-lg text-white leading-none">
                        {selectedUser.name}
                      </p>
                      {selectedUser.role === "admin" && (
                        <Tag color="gold" icon={<CrownOutlined />}>
                          Admin
                        </Tag>
                      )}
                      <Tag color={selectedUser.isActive ? "green" : "red"}>
                        {selectedUser.isActive ? "Active" : "Disabled"}
                      </Tag>
                    </div>
                    <Text className="!text-gray-400">{selectedUser.email}</Text>
                    <div className="flex gap-4 mt-1">
                      <Text className="!text-gray-500 text-xs">
                        ID: {selectedUser.id}
                      </Text>
                      <Text className="!text-gray-500 text-xs">
                        Joined:{" "}
                        {new Date(selectedUser.joinedAt).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "short", day: "numeric" },
                        )}
                      </Text>
                      <Text className="!text-gray-500 text-xs">
                        URLs: {selectedUser.urls.length}
                      </Text>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 min-w-[180px]">
                    <div className="flex items-center justify-between gap-3">
                      <Text className="!text-gray-300 text-sm">
                        {selectedUser.isActive ? (
                          <CheckCircleOutlined className="text-green-400 mr-1" />
                        ) : (
                          <StopOutlined className="text-red-400 mr-1" />
                        )}
                        Account
                      </Text>
                      <Switch
                        checked={selectedUser.isActive}
                        onChange={(checked) =>
                          toggleUser(selectedUser.id, checked)
                        }
                        checkedChildren="On"
                        unCheckedChildren="Off"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <Text className="!text-gray-300 text-sm">
                        <CrownOutlined className="text-yellow-400 mr-1" />
                        Role
                      </Text>
                      <Select
                        value={selectedUser.role}
                        onChange={(role) => changeRole(selectedUser.id, role)}
                        size="small"
                        className="w-24"
                        options={[
                          { value: "user", label: "User" },
                          { value: "admin", label: "Admin" },
                        ]}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* URLs table */}
              <Card className="!bg-gray-900 !border-gray-800 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-semibold text-white flex items-center gap-2">
                    <LinkOutlined className="text-gray-400" />
                    Short URLs ({selectedUser.urls.length})
                  </p>
                  <Text className="!text-gray-400 text-sm">
                    {selectedUser.urls.filter((u) => u.isActive).length} active
                  </Text>
                </div>

                {selectedUser.urls.length === 0 ? (
                  <Empty
                    description={
                      <span className="text-gray-500">No URLs created yet</span>
                    }
                  />
                ) : (
                  <Table
                    columns={urlColumns}
                    dataSource={selectedUser.urls}
                    rowKey="key"
                    size="small"
                    scroll={{ x: 600 }}
                    pagination={{
                      pageSize: 5,
                      showTotal: (total, range) => (
                        <span className="text-gray-400">
                          {range[0]}–{range[1]} of {total}
                        </span>
                      ),
                    }}
                    className="admin-table"
                    rowClassName="!bg-gray-900 hover:!bg-gray-800"
                  />
                )}
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center py-16"
            >
              <UserOutlined className="text-5xl text-gray-700 mb-4 block" />
              <Text className="!text-gray-600">
                Search for a user above to view and manage their account
              </Text>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
