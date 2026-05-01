import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

/**
 * ProtectedRoute component
 * Usage:
 *   <Route element={<ProtectedRoute allowedRoles={["freelancer"]} />}>
 *     <Route path="/freelancer/dashboard" element={<FreelancerDashboardPage />} />
 *   </Route>
 *
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/dashboard" element={<DashboardPage />} />
 *   </Route>
 */
function ProtectedRoute({ allowedRoles, children }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Not logged in — redirect to login, save intended destination
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but role not allowed — redirect to their dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const redirectPath =
      user.role === "freelancer"
        ? "/freelancer/dashboard"
        : user.role === "client"
        ? "/client/dashboard"
        : user.role === "admin"
        ? "/admin/dashboard"
        : "/";
    return <Navigate to={redirectPath} replace />;
  }

  // Render child routes or children
  return children ? children : <Outlet />;
}

export default ProtectedRoute;

