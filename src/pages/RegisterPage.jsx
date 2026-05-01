import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function RegisterPage() {
  const navigate = useNavigate();
  const { register, error, loading, clearError, getDashboardPath } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [localError, setLocalError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) clearError();
    if (localError) setLocalError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.role) {
      setLocalError("Please fill in all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    const result = await register(payload);

    if (result.success && result.user) {
      const redirectTo = getDashboardPath(result.user.role);
      navigate(redirectTo, { replace: true });
    }
  };

  const displayError = localError || error;

  return (
    <section className="auth-section">
      <div className="auth-card">
        <h2>Register</h2>
        <p className="section-sub">Create your Remotely profile</p>

        {displayError && (
          <div className="form-error" style={{ color: "#d93025", marginBottom: "12px" }}>
            {displayError}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="form-label" htmlFor="role">
            Role
          </label>
          <select
            id="role"
            name="role"
            className="form-input"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">Choose role</option>
            <option value="freelancer">Freelancer</option>
            <option value="client">Client</option>
          </select>

          <label className="form-label" htmlFor="fullName">
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            className="form-input"
            type="text"
            placeholder="Full name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

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
            placeholder="Create a password (min 6 chars)"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label className="form-label" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            className="form-input"
            type="password"
            placeholder="Re-enter password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <label className="terms-row" htmlFor="register-terms">
            <input id="register-terms" type="checkbox" required />
            <span>
              I agree to the <a href="#">Terms and Conditions</a>
            </span>
          </label>

          <button
            type="submit"
            className="btn btn-red auth-submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-footer" style={{ marginTop: "16px", textAlign: "center" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#d93025" }}>
            Sign In
          </Link>
        </p>
      </div>
    </section>
  );
}

export default RegisterPage;

