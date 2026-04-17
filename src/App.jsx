import { useEffect, useState } from "react";
import { isAuthenticated, logout as authLogout } from "./services/authService";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { themes } from "./lib/theme";
import PageLayout from "./components/PageLayout";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AdminThemeProvider from "./components/AdminThemeProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import MyProfile from "./pages/MyProfile.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import Redirect from "./pages/Redirect.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  useEffect(() => {
    async function checkAuth() {
      try {
        await isAuthenticated();
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);
  return (
    <ConfigProvider theme={themes.user.antd}>
      <BrowserRouter>
        <ToastContainer stacked />
        <Routes>
          {/* Redirect route — no header/footer */}
          <Route
            path={`/${import.meta.env.VITE_SHORT_URL_PREFIX}/:slug`}
            element={<Redirect />}
          />
          <Route
            path={`/${import.meta.env.VITE_SHORT_URL_PREFIX}`}
            element={<Redirect />}
          />

          {/* Admin routes — no header/footer */}
          <Route
            path="/admin/login"
            element={
              <AdminThemeProvider>
                <PublicOnlyRoute
                  isLoggedIn={isAdminLoggedIn}
                  redirectTo="/admin/dashboard"
                >
                  <AdminLogin onAdminLogin={() => setIsAdminLoggedIn(true)} />
                </PublicOnlyRoute>
              </AdminThemeProvider>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminThemeProvider>
                <AdminProtectedRoute isAdminLoggedIn={isAdminLoggedIn}>
                  <AdminDashboard
                    onAdminLogout={() => setIsAdminLoggedIn(false)}
                  />
                </AdminProtectedRoute>
              </AdminThemeProvider>
            }
          />

          {/* Public routes — with header/footer */}
          <Route
            path="/*"
            element={
              <PageLayout
                isLoggedIn={isLoggedIn}
                onLogout={() => {
                  authLogout();
                  setIsLoggedIn(false);
                }}
              >
                <Routes>
                  <Route
                    path="/"
                    element={
                      // <ProtectedRoute isLoggedIn={isLoggedIn}>
                      <Home />
                      // </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/login"
                    element={
                      <PublicOnlyRoute isLoggedIn={isLoggedIn}>
                        <Login onLogin={() => setIsLoggedIn(true)} />
                      </PublicOnlyRoute>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <PublicOnlyRoute isLoggedIn={isLoggedIn}>
                        <Register onLogin={() => setIsLoggedIn(true)} />
                      </PublicOnlyRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute isLoggedIn={isLoggedIn}>
                        <MyProfile />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </PageLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
