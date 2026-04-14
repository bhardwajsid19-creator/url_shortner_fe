import { useState } from 'react'
import {
  Input, Table, Tag, Switch, Button, Avatar, Typography,
  Card, Tooltip, message, Badge, Select, Empty, Statistic, Row, Col,
} from 'antd'
import {
  SearchOutlined, UserOutlined, LinkOutlined, SafetyCertificateOutlined,
  CrownOutlined, CheckCircleOutlined, StopOutlined, TeamOutlined, BarChartOutlined,
} from '@ant-design/icons'
import adminData from '../../data/adminUsers.json'

const { Title, Text } = Typography

export default function AdminDashboard({ onAdminLogout }) {
  const [users, setUsers] = useState(adminData.users)
  const [query, setQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [messageApi, contextHolder] = message.useMessage()

  // ── Search ────────────────────────────────────────────
  const handleSearch = () => {
    const q = query.trim().toLowerCase()
    if (!q) return
    const found = users.find(
      (u) => u.id.toLowerCase() === q || u.email.toLowerCase() === q
    )
    if (found) {
      setSelectedUser(found)
    } else {
      messageApi.warning('No user found with that ID or email')
      setSelectedUser(null)
    }
  }

  // ── Helpers to sync selectedUser with users state ─────
  const patchUser = (id, changes) => {
    const updated = users.map((u) => (u.id === id ? { ...u, ...changes } : u))
    setUsers(updated)
    setSelectedUser((prev) => (prev?.id === id ? { ...prev, ...changes } : prev))
  }

  const patchUrl = (userId, urlKey, changes) => {
    const updated = users.map((u) => {
      if (u.id !== userId) return u
      return { ...u, urls: u.urls.map((url) => (url.key === urlKey ? { ...url, ...changes } : url)) }
    })
    setUsers(updated)
    setSelectedUser((prev) =>
      prev?.id === userId
        ? { ...prev, urls: prev.urls.map((url) => (url.key === urlKey ? { ...url, ...changes } : url)) }
        : prev
    )
  }

  // ── Toggle user active ────────────────────────────────
  const toggleUser = (id, checked) => {
    patchUser(id, { isActive: checked })
    messageApi.success(`User ${checked ? 'enabled' : 'disabled'}`)
  }

  // ── Toggle user role ──────────────────────────────────
  const changeRole = (id, role) => {
    patchUser(id, { role })
    messageApi.success(`Role updated to ${role}`)
  }

  // ── Toggle URL active ─────────────────────────────────
  const toggleUrl = (userId, urlKey, checked) => {
    patchUrl(userId, urlKey, { isActive: checked })
    messageApi.success(`Short URL ${checked ? 'enabled' : 'disabled'}`)
  }

  // ── Stats (all users) ────────────────────────────────
  const totalUrls = users.reduce((s, u) => s + u.urls.length, 0)
  const totalClicks = users.reduce((s, u) => s + u.urls.reduce((ss, url) => ss + url.clicks, 0), 0)
  const activeUsers = users.filter((u) => u.isActive).length

  // ── URL table columns ─────────────────────────────────
  const urlColumns = [
    {
      title: 'Short URL',
      dataIndex: 'shortUrl',
      key: 'shortUrl',
      width: 180,
      render: (url) => (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-accent hover:opacity-80 text-sm font-medium">
          {url.replace('https://', '')}
        </a>
      ),
    },
    {
      title: 'Destination',
      dataIndex: 'originalUrl',
      key: 'originalUrl',
      ellipsis: true,
      render: (url) => (
        <Tooltip title={url} placement="topLeft">
          <span className="text-gray-300 text-sm">{url}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Clicks',
      dataIndex: 'clicks',
      key: 'clicks',
      width: 90,
      sorter: (a, b) => a.clicks - b.clicks,
      render: (clicks) => (
        <Tag color={clicks > 300 ? 'green' : clicks > 100 ? 'orange' : 'default'}>
          {clicks.toLocaleString()}
        </Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (d) => <Text className="!text-gray-400 text-sm">{d}</Text>,
    },
    {
      title: 'Status',
      key: 'isActive',
      width: 110,
      render: (_, record) => (
        <Switch
          checked={record.isActive}
          checkedChildren="Active"
          unCheckedChildren="Off"
          onChange={(checked) => toggleUrl(selectedUser.id, record.key, checked)}
          size="small"
        />
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {contextHolder}

      {/* Top bar */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-red-500 p-2 rounded-lg">
            <SafetyCertificateOutlined className="text-white text-lg" />
          </div>
          <div>
            <Title level={5} className="!mb-0 !text-white">Admin Dashboard</Title>
            <Text className="!text-gray-400 text-xs">ToShort — Restricted access</Text>
          </div>
        </div>
        <Button
          danger
          size="small"
          onClick={() => { onAdminLogout?.(); window.location.href = '/admin/login' }}
        >
          Sign out
        </Button>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Stats */}
        <Row gutter={16} className="mb-8">
          {[
            { title: 'Total Users', value: users.length, icon: <TeamOutlined />, color: 'text-accent' },
            { title: 'Active Users', value: activeUsers, icon: <CheckCircleOutlined />, color: 'text-green-400' },
            { title: 'Total Short URLs', value: totalUrls, icon: <LinkOutlined />, color: 'text-purple-400' },
            { title: 'Total Clicks', value: totalClicks, icon: <BarChartOutlined />, color: 'text-yellow-400' },
          ].map((stat) => (
            <Col xs={12} md={6} key={stat.title}>
              <Card className="!bg-gray-800 !border-gray-700 rounded-xl mb-4 md:mb-0">
                <div className={`text-2xl mb-1 ${stat.color}`}>{stat.icon}</div>
                <Statistic
                  title={<span className="text-gray-400 text-xs">{stat.title}</span>}
                  value={stat.value}
                  valueStyle={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700 }}
                />
              </Card>
            </Col>
          ))}
        </Row>

        {/* Search */}
        <Card className="!bg-gray-800 !border-gray-700 rounded-xl mb-6">
          <Title level={5} className="!text-white !mb-4">
            <SearchOutlined className="mr-2 text-gray-400" />
            Look up user
          </Title>
          <div className="flex gap-3">
            <Input
              placeholder="Enter user ID (e.g. USR001) or email"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onPressEnter={handleSearch}
              size="large"
              className="!bg-gray-700 !border-gray-600 !text-white"
              prefix={<UserOutlined className="text-gray-500" />}
              allowClear
            />
            <Button type="primary" size="large" onClick={handleSearch} icon={<SearchOutlined />}>
              Search
            </Button>
          </div>
          <Text className="!text-gray-500 text-xs mt-2 block">
            Try: USR001 · USR002 · USR003 · or an email like jane@example.com
          </Text>
        </Card>

        {/* User result */}
        {selectedUser && (
          <>
            {/* User info card */}
            <Card className="!bg-gray-800 !border-gray-700 rounded-xl mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Badge
                  dot
                  color={selectedUser.isActive ? 'green' : 'red'}
                  offset={[-4, 60]}
                >
                  <Avatar size={64} icon={<UserOutlined />} className="bg-primary shrink-0" />
                </Badge>

                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Title level={4} className="!mb-0 !text-white">{selectedUser.name}</Title>
                    {selectedUser.role === 'admin' && (
                      <Tag color="gold" icon={<CrownOutlined />}>Admin</Tag>
                    )}
                    <Tag color={selectedUser.isActive ? 'green' : 'red'}>
                      {selectedUser.isActive ? 'Active' : 'Disabled'}
                    </Tag>
                  </div>
                  <Text className="!text-gray-400">{selectedUser.email}</Text>
                  <div className="flex gap-4 mt-1">
                    <Text className="!text-gray-500 text-xs">ID: {selectedUser.id}</Text>
                    <Text className="!text-gray-500 text-xs">
                      Joined: {new Date(selectedUser.joinedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </Text>
                    <Text className="!text-gray-500 text-xs">URLs: {selectedUser.urls.length}</Text>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col gap-3 min-w-[180px]">
                  <div className="flex items-center justify-between gap-3">
                    <Text className="!text-gray-300 text-sm">
                      {selectedUser.isActive ? <CheckCircleOutlined className="text-green-400 mr-1" /> : <StopOutlined className="text-red-400 mr-1" />}
                      Account
                    </Text>
                    <Switch
                      checked={selectedUser.isActive}
                      onChange={(checked) => toggleUser(selectedUser.id, checked)}
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
                        { value: 'user', label: 'User' },
                        { value: 'admin', label: 'Admin' },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* URLs table */}
            <Card className="!bg-gray-800 !border-gray-700 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <Title level={5} className="!mb-0 !text-white">
                  <LinkOutlined className="mr-2 text-gray-400" />
                  Short URLs ({selectedUser.urls.length})
                </Title>
                <Text className="!text-gray-400 text-sm">
                  {selectedUser.urls.filter((u) => u.isActive).length} active
                </Text>
              </div>

              {selectedUser.urls.length === 0 ? (
                <Empty description={<span className="text-gray-500">No URLs created yet</span>} />
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
                      <span className="text-gray-400">{range[0]}–{range[1]} of {total}</span>
                    ),
                  }}
                  className="admin-table"
                  rowClassName="!bg-gray-800 hover:!bg-gray-750"
                />
              )}
            </Card>
          </>
        )}

        {!selectedUser && (
          <div className="text-center py-16">
            <UserOutlined className="text-5xl text-gray-700 mb-4 block" />
            <Text className="!text-gray-600">Search for a user above to view and manage their account</Text>
          </div>
        )}
      </div>
    </div>
  )
}
