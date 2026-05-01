import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const dashboardPath = user?.role
    ? user.role === "freelancer"
      ? "/freelancer/dashboard"
      : user.role === "client"
      ? "/client/dashboard"
      : user.role === "admin"
      ? "/admin/dashboard"
      : "/dashboard"
    : "/dashboard";

  return (
    <header>
      <nav className="main-nav">
        <NavLink className="nav-logo" to="/">
          <div className="logo-icon">💼</div>
          Remotely
        </NavLink>

        <ul className="nav-links">
          <li>
            <NavLink to="/browse-jobs">Browse Jobs</NavLink>
          </li>
          <li>
            <NavLink to="/find-talent">Find Talent</NavLink>
          </li>
          <li>
            <NavLink to={dashboardPath}>Dashboard</NavLink>
          </li>
          {isAuthenticated && user?.role === "client" && (
            <li>
              <NavLink to="/client/post-job">Post Job</NavLink>
            </li>
          )}
        </ul>

        <div className="nav-right">
          <div className="lang-toggle">
            <button type="button" className="lang-btn active">
              EN
            </button>
            <button type="button" className="lang-btn">
              हिं
            </button>
          </div>

          {isAuthenticated ? (
            <>
              <span
                className="user-greeting"
                style={{ marginRight: "12px", fontWeight: 500 }}
              >
                Hi, {user?.fullName?.split(" ")[0]}
              </span>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn btn-ghost btn-sm">
                Login
              </NavLink>
              <NavLink to="/register" className="btn btn-red btn-sm">
                Get Started
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
