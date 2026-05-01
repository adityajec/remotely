import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

function FreelancerProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const portfolio = [
    { id: "PROJ-301", title: "ShopEasy E-commerce", tech: "React · Node.js", outcome: "₹18,000 earned" },
    { id: "PROJ-308", title: "TravelBlog Redesign", tech: "Figma · HTML/CSS", outcome: "5★ review" },
    { id: "PROJ-315", title: "EduPortal Dashboard", tech: "Vue.js · Firebase", outcome: "Repeat client" },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get("/freelancer/profile");
        setProfile(response.data.profile);
      } catch (err) {
        const status = err.response?.status;
        const message = err.response?.data?.message || "";
        if (status === 404 || message.toLowerCase().includes("not found")) {
          setError("Profile not found. Please complete your profile setup first.");
        } else {
          setError(message || "Failed to load profile.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "FL";

  if (loading) {
    return (
      <section className="section page-wrap">
        <div className="container">
          <p>Loading profile...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section page-wrap">
      <div className="container">

        {error && (
          <div className="job-details-card" style={{ color: "#d93025", marginBottom: "24px" }}>
            <p>{error}</p>
          </div>
        )}

        {/* Hero */}
        <div className="client-hero">
          <div className="client-identity">
            <div
              className="client-avatar"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #e8344a)",
                fontSize: "1.4rem",
              }}
            >
              {initials}
            </div>
            <div>
              <h2>{user?.fullName || "Freelancer"}</h2>
              <p className="section-sub client-sub">
                {profile?.title || "Freelancer"}
                {profile?.location?.city && profile?.location?.country
                  ? ` · ${profile.location.city}, ${profile.location.country}`
                  : ""}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button type="button" className="btn btn-ghost btn-sm">
              Message
            </button>
            <button type="button" className="btn btn-red btn-sm">
              Hire Now
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="stat-grid client-stat-grid">
          <article className="stat-card">
            <div className="stat-card-label">Projects Completed</div>
            <div className="stat-card-val">{profile?.completedJobs || 0}</div>
            <div className="stat-card-meta">+0 this month</div>
          </article>
          <article className="stat-card">
            <div className="stat-card-label">Client Rating</div>
            <div className="stat-card-val">
              {profile?.jobSuccessScore !== undefined
                ? (profile.jobSuccessScore / 20).toFixed(1)
                : "N/A"}
            </div>
            <div className="stat-card-meta">⭐ Based on reviews</div>
          </article>
          <article className="stat-card">
            <div className="stat-card-label">Trust Score</div>
            <div className="stat-card-val">
              {profile?.jobSuccessScore !== undefined
                ? `${profile.jobSuccessScore}%`
                : "N/A"}
            </div>
            <div className="stat-card-meta">
              {profile?.isVerified ? "Verified freelancer" : "Not verified"}
            </div>
          </article>
        </div>

        {/* Two-col grid */}
        <div className="client-grid">
          <article className="job-details-card">
            <h3 className="client-section-title">About Me</h3>
            <p className="detail-paragraph">
              {profile?.bio || "No bio added yet."}
            </p>
            <div className="job-tags" style={{ marginTop: "1rem" }}>
              {profile?.skills && profile.skills.length > 0 ? (
                profile.skills.map((s) => (
                  <span key={s} className="tag">{s}</span>
                ))
              ) : (
                <span className="tag">No skills listed</span>
              )}
            </div>
          </article>

          <article className="job-details-card">
            <h3 className="client-section-title">Freelancer Details</h3>
            <div className="client-contact-list">
              <div className="detail-item">
                <span className="detail-label">Freelancer ID</span>
                <span className="detail-value">{user?._id?.slice(-6).toUpperCase() || "N/A"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email</span>
                <span className="detail-value">{user?.email || "N/A"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Hourly Rate</span>
                <span className="detail-value" style={{ color: "var(--green)", fontWeight: 700 }}>
                  {profile?.hourlyRate
                    ? `${profile.hourlyRate} ${profile.currency || "USD"} / hr`
                    : "Not set"}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Availability</span>
                <span className="badge badge-new" style={{ fontSize: "0.75rem" }}>
                  {profile?.availability
                    ? profile.availability
                        .replace("-", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())
                    : "Unknown"}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Total Earnings</span>
                <span className="detail-value">
                  {profile?.totalEarnings ? `$${profile.totalEarnings}` : "$0"}
                </span>
              </div>
            </div>
          </article>
        </div>

        {/* Portfolio */}
        <article className="job-details-card client-jobs-card">
          <h3 className="client-section-title">Portfolio Projects</h3>
          <div className="client-jobs-list">
            {portfolio.map((proj) => (
              <div key={proj.id} className="client-job-row">
                <div>
                  <div className="detail-value">{proj.title}</div>
                  <div className="job-meta">
                    {proj.id} · {proj.tech}
                  </div>
                </div>
                <span className="tag">{proj.outcome}</span>
              </div>
            ))}
          </div>
        </article>

      </div>
    </section>
  );
}

export default FreelancerProfilePage;

