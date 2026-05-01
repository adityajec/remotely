import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

function FreelancerProfileSetupPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [checkingProfile, setCheckingProfile] = useState(true);

  // If profile already exists, redirect to dashboard
  useEffect(() => {
    const checkExistingProfile = async () => {
      try {
        await api.get("/freelancer/profile");
        // Profile exists — redirect to dashboard
        navigate("/freelancer/dashboard", { replace: true });
      } catch {
        // Profile doesn't exist — stay on setup page
        setCheckingProfile(false);
      }
    };

    checkExistingProfile();
  }, [navigate]);

  const [formData, setFormData] = useState({
    title: "",
    bio: "",
    skills: "",
    hourlyRate: "",
    currency: "USD",
    country: "",
    city: "",
    timezone: "",
    availability: "as-needed",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.bio.trim()) {
      setError("Title and bio are required.");
      return;
    }

    const payload = {
      title: formData.title.trim(),
      bio: formData.bio.trim(),
      skills: formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      hourlyRate: Number(formData.hourlyRate) || 0,
      currency: formData.currency,
      location: {
        country: formData.country.trim(),
        city: formData.city.trim(),
        timezone: formData.timezone.trim(),
      },
      availability: formData.availability,
    };

    try {
      setLoading(true);
      setError("");
      await api.post("/freelancer/profile", payload);
      navigate("/freelancer/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-card" style={{ maxWidth: "600px" }}>
        <h2>Complete Your Freelancer Profile</h2>
        <p className="section-sub">
          Welcome, <strong>{user?.fullName}</strong>! Let&apos;s set up your
          profile so clients can find you.
        </p>

        {error && (
          <div
            className="form-error"
            style={{ color: "#d93025", marginBottom: "12px" }}
          >
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="form-label" htmlFor="title">
            Professional Title *
          </label>
          <input
            id="title"
            name="title"
            className="form-input"
            type="text"
            placeholder="e.g. Full Stack Developer"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <label className="form-label" htmlFor="bio">
            Bio *
          </label>
          <textarea
            id="bio"
            name="bio"
            className="form-input"
            rows="4"
            placeholder="Tell clients about your experience and expertise..."
            value={formData.bio}
            onChange={handleChange}
            required
          />

          <label className="form-label" htmlFor="skills">
            Skills (comma separated)
          </label>
          <input
            id="skills"
            name="skills"
            className="form-input"
            type="text"
            placeholder="e.g. React, Node.js, Python, UI Design"
            value={formData.skills}
            onChange={handleChange}
          />

          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ flex: 1 }}>
              <label className="form-label" htmlFor="hourlyRate">
                Hourly Rate
              </label>
              <input
                id="hourlyRate"
                name="hourlyRate"
                className="form-input"
                type="number"
                min="0"
                placeholder="50"
                value={formData.hourlyRate}
                onChange={handleChange}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label className="form-label" htmlFor="currency">
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                className="form-input"
                value={formData.currency}
                onChange={handleChange}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="INR">INR</option>
              </select>
            </div>
          </div>

          <label className="form-label" htmlFor="availability">
            Availability
          </label>
          <select
            id="availability"
            name="availability"
            className="form-input"
            value={formData.availability}
            onChange={handleChange}
          >
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="as-needed">As Needed</option>
            <option value="not-available">Not Available</option>
          </select>

          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ flex: 1 }}>
              <label className="form-label" htmlFor="city">
                City
              </label>
              <input
                id="city"
                name="city"
                className="form-input"
                type="text"
                placeholder="San Francisco"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label className="form-label" htmlFor="country">
                Country
              </label>
              <input
                id="country"
                name="country"
                className="form-input"
                type="text"
                placeholder="United States"
                value={formData.country}
                onChange={handleChange}
              />
            </div>
          </div>

          <label className="form-label" htmlFor="timezone">
            Timezone
          </label>
          <input
            id="timezone"
            name="timezone"
            className="form-input"
            type="text"
            placeholder="e.g. PST, EST, GMT+5:30"
            value={formData.timezone}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="btn btn-red auth-submit"
            disabled={loading}
          >
            {loading ? "Saving Profile..." : "Complete Profile & Continue"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default FreelancerProfileSetupPage;

