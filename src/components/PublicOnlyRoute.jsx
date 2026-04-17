import { Navigate, useLocation } from "react-router-dom";

export default function PublicOnlyRoute({ isLoggedIn, redirectTo, children }) {
  const location = useLocation();
  if (isLoggedIn) {
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={redirectTo || from} replace />;
  }
  return children;
}
