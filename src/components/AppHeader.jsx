import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Drawer, Avatar, Dropdown } from "antd";
import {
  LinkOutlined,
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Features", to: "/features" },
  { label: "Pricing", to: "/pricing" },
];

const userMenuItems = (onLogout, onProfile) => [
  {
    key: "profile",
    icon: <UserOutlined />,
    label: "Profile",
    onClick: onProfile,
  },
  {
    type: "divider",
  },
  {
    key: "logout",
    icon: <LogoutOutlined />,
    label: "Logout",
    danger: true,
    onClick: onLogout,
  },
];

export default function AppHeader({ isLoggedIn, onLogout }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setDrawerOpen(false);
    onLogout?.();
  };

  const AuthButtons = ({ vertical = false }) =>
    isLoggedIn ? (
      <Dropdown
        menu={{
          items: userMenuItems(handleLogout, () => navigate("/profile")),
        }}
        placement="bottomRight"
        trigger={["click"]}
      >
        <Avatar
          icon={<UserOutlined />}
          className="bg-primary cursor-pointer hover:opacity-90 transition-opacity"
          size={38}
        />
      </Dropdown>
    ) : (
      <div
        className={`flex ${vertical ? "flex-col w-full gap-2 mt-2" : "items-center gap-2"}`}
      >
        <Button
          size={vertical ? "large" : "middle"}
          block={vertical}
          onClick={() => {
            navigate("/login");
            setDrawerOpen(false);
          }}
        >
          Login
        </Button>
        <Button
          type="primary"
          size={vertical ? "large" : "middle"}
          block={vertical}
          onClick={() => {
            navigate("/register");
            setDrawerOpen(false);
          }}
        >
          Sign up
        </Button>
      </div>
    );

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 no-underline">
          <div className="bg-primary text-white p-1.5 rounded-lg">
            <LinkOutlined className="text-lg" />
          </div>
          <span className="text-gray-900 font-bold text-lg leading-none">
            To<span className="text-primary">Short</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-gray-600 hover:text-primary font-medium text-sm transition-colors no-underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn && (
            <Link
              to="/profile"
              className="text-gray-600 hover:text-primary font-medium text-sm transition-colors no-underline"
            >
              My URLs
            </Link>
          )}
          <AuthButtons />
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 transition-colors border-0 bg-transparent cursor-pointer"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
        >
          <MenuOutlined className="text-gray-700 text-lg" />
        </button>
      </div>

      {/* Mobile drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        placement="right"
        width={280}
        closeIcon={<CloseOutlined />}
        title={
          <Link
            to="/"
            className="flex items-center gap-2 no-underline"
            onClick={() => setDrawerOpen(false)}
          >
            <div className="bg-primary text-white p-1 rounded-md">
              <LinkOutlined />
            </div>
            <span className="text-gray-900 font-bold">
              To<span className="text-primary">Short</span>
            </span>
          </Link>
        }
        styles={{ body: { padding: "16px" } }}
      >
        <nav className="flex flex-col gap-1 mb-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setDrawerOpen(false)}
              className="text-gray-700 hover:text-primary hover:bg-secondary font-medium text-base px-3 py-2 rounded-lg transition-colors no-underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-gray-100 pt-4">
          <AuthButtons vertical />
        </div>
      </Drawer>
    </header>
  );
}
