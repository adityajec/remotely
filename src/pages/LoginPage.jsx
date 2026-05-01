import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function LoginPage() {
  const navigate = useNavigate();
  const { login, error, loading, clearError, getDashboardPath } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return;
    }

    const result = await login(formData);

    if (result.success && result.user) {
      const redirectTo = getDashboardPath(result.user.role);
      navigate(redirectTo, { replace: true });
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-card">
        <h2>Login</h2>
        <p className="section-sub">Access your Remotely account</p>

        {error && (
          <div className="form-error" style={{ color: "#d93025", marginBottom: "12px" }}>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            className="form-input"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label className="form-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            className="form-input"
            type="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="btn btn-red auth-submit"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="auth-footer" style={{ marginTop: "16px", textAlign: "center" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#d93025" }}>
            Get Started
          </Link>
        </p>
      </div>
    </section>
  );
}

export default LoginPage;

