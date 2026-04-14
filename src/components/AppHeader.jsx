import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
  { type: "divider" },
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
          size={36}
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
          className="!shadow-md !shadow-orange-100"
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
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 border-b border-white/40 bg-white/80 backdrop-blur-xl shadow-sm"
    >
      {/* Subtle orange accent line on top */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div
        className="max-w-6xl mx-auto px-4 h-15 flex items-center justify-between"
        style={{ height: 60 }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 no-underline group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-orange-400 text-white shadow-md shadow-orange-200 transition-transform group-hover:scale-105">
            <LinkOutlined className="text-sm" />
          </div>
          <span className="text-gray-900 font-bold text-lg leading-none">
            To<span className="text-primary">Short</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="relative px-3 py-1.5 text-gray-500 hover:text-primary font-medium text-sm transition-colors no-underline rounded-lg hover:bg-orange-50"
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
              className="text-gray-500 hover:text-primary font-medium text-sm transition-colors no-underline px-3 py-1.5 rounded-lg hover:bg-orange-50"
            >
              My URLs
            </Link>
          )}
          <AuthButtons />
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-orange-50 transition-colors border-0 bg-transparent cursor-pointer text-gray-600"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
        >
          <MenuOutlined className="text-lg" />
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
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-orange-400 text-white">
              <LinkOutlined className="text-xs" />
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
              className="text-gray-700 hover:text-primary hover:bg-orange-50 font-medium text-base px-3 py-2 rounded-lg transition-colors no-underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-gray-100 pt-4">
          <AuthButtons vertical />
        </div>
      </Drawer>
    </motion.header>
  );
}
