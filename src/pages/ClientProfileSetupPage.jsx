import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

function ClientProfileSetupPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [checkingProfile, setCheckingProfile] = useState(true);

  // If profile already exists, redirect to dashboard
  useEffect(() => {
    const checkExistingProfile = async () => {
      try {
        await api.get("/client/profile");
        // Profile exists — redirect to dashboard
        navigate("/client/dashboard", { replace: true });
      } catch {
        // Profile doesn't exist — stay on setup page
        setCheckingProfile(false);
      }
    };

    checkExistingProfile();
  }, [navigate]);

  const [formData, setFormData] = useState({
    companyName: "",
    bio: "",
    industry: "",
    companySize: "solo",
    country: "",
    city: "",
    timezone: "",
    website: "",
    preferredSkills: "",
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

    if (!formData.companyName.trim() || !formData.bio.trim()) {
      setError("Company name and bio are required.");
      return;
    }

    const payload = {
      companyName: formData.companyName.trim(),
      bio: formData.bio.trim(),
      industry: formData.industry.trim(),
      companySize: formData.companySize,
      location: {
        country: formData.country.trim(),
        city: formData.city.trim(),
        timezone: formData.timezone.trim(),
      },
      website: formData.website.trim(),
      preferredSkills: formData.preferredSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      setLoading(true);
      setError("");
      await api.post("/client/profile", payload);
      navigate("/client/dashboard", { replace: true });
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
        <h2>Complete Your Client Profile</h2>
        <p className="section-sub">
          Welcome, <strong>{user?.fullName}</strong>! Let&apos;s set up your
          company profile so freelancers can learn about you.
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
          <label className="form-label" htmlFor="companyName">
            Company Name *
          </label>
          <input
            id="companyName"
            name="companyName"
            className="form-input"
            type="text"
            placeholder="e.g. Acme Inc"
            value={formData.companyName}
            onChange={handleChange}
            required
          />

          <label className="form-label" htmlFor="bio">
            Company Bio *
          </label>
          <textarea
            id="bio"
            name="bio"
            className="form-input"
            rows="4"
            placeholder="Tell freelancers about your company and the projects you work on..."
            value={formData.bio}
            onChange={handleChange}
            required
          />

          <label className="form-label" htmlFor="industry">
            Industry
          </label>
          <input
            id="industry"
            name="industry"
            className="form-input"
            type="text"
            placeholder="e.g. Technology, Healthcare, Finance"
            value={formData.industry}
            onChange={handleChange}
          />

          <label className="form-label" htmlFor="companySize">
            Company Size
          </label>
          <select
            id="companySize"
            name="companySize"
            className="form-input"
            value={formData.companySize}
            onChange={handleChange}
          >
            <option value="solo">Solo / Freelancer</option>
            <option value="2-10">2 - 10 employees</option>
            <option value="11-50">11 - 50 employees</option>
            <option value="51-200">51 - 200 employees</option>
            <option value="201-1000">201 - 1000 employees</option>
            <option value="1000+">1000+ employees</option>
          </select>

          <label className="form-label" htmlFor="website">
            Website
          </label>
          <input
            id="website"
            name="website"
            className="form-input"
            type="url"
            placeholder="https://yourcompany.com"
            value={formData.website}
            onChange={handleChange}
          />

          <label className="form-label" htmlFor="preferredSkills">
            Preferred Skills (comma separated)
          </label>
          <input
            id="preferredSkills"
            name="preferredSkills"
            className="form-input"
            type="text"
            placeholder="e.g. React, Python, Machine Learning"
            value={formData.preferredSkills}
            onChange={handleChange}
          />

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
                placeholder="London"
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
                placeholder="United Kingdom"
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
            placeholder="e.g. GMT, EST, PST"
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

export default ClientProfileSetupPage;

