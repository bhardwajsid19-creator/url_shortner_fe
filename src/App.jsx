import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageLayout from "./components/PageLayout";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import MyProfile from "./pages/MyProfile.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        {/* Admin routes — no header/footer */}
        <Route
          path="/admin/login"
          element={
            <PublicOnlyRoute
              isLoggedIn={isAdminLoggedIn}
              redirectTo="/admin/dashboard"
            >
              <AdminLogin onAdminLogin={() => setIsAdminLoggedIn(true)} />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute isAdminLoggedIn={isAdminLoggedIn}>
              <AdminDashboard onAdminLogout={() => setIsAdminLoggedIn(false)} />
            </AdminProtectedRoute>
          }
        />

        {/* Public routes — with header/footer */}
        <Route
          path="/*"
          element={
            <PageLayout
              isLoggedIn={isLoggedIn}
              onLogout={() => setIsLoggedIn(false)}
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
                    <PublicOnlyRoute
                      isLoggedIn={isLoggedIn}
                      redirectTo="/profile"
                    >
                      <Login onLogin={() => setIsLoggedIn(true)} />
                    </PublicOnlyRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicOnlyRoute
                      isLoggedIn={isLoggedIn}
                      redirectTo="/profile"
                    >
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
  );
}

export default App;
