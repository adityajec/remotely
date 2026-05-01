import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

function ClientProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const postedJobs = [
    { id: "JOB-1001", title: "E-commerce Website", status: "Open", bids: 8 },
    { id: "JOB-1007", title: "Landing Page Redesign", status: "In Progress", bids: 12 },
    { id: "JOB-1014", title: "SEO Setup", status: "Completed", bids: 6 },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get("/client/profile");
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
    : "CL";

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

        <div className="client-hero">
          <div className="client-identity">
            <div className="client-avatar">{initials}</div>
            <div>
              <h2>{profile?.companyName || user?.fullName || "Client"}</h2>
              <p className="section-sub client-sub">
                {profile?.paymentVerified ? "Verified Client" : "Client"}
                {profile?.location?.city && profile?.location?.country
                  ? ` · ${profile.location.city}, ${profile.location.country}`
                  : ""}
              </p>
            </div>
          </div>
          <button type="button" className="btn btn-red btn-sm">
            Edit Profile
          </button>
        </div>

        <div className="stat-grid client-stat-grid">
          <article className="stat-card">
            <div className="stat-card-label">Total Jobs Posted</div>
            <div className="stat-card-val">{profile?.jobsPosted || 0}</div>
            <div className="stat-card-meta">+0 this month</div>
          </article>
          <article className="stat-card">
            <div className="stat-card-label">Hire Success Rate</div>
            <div className="stat-card-val">
              {profile?.hireRate !== undefined ? `${profile.hireRate}%` : "N/A"}
            </div>
            <div className="stat-card-meta">Strong hiring history</div>
          </article>
          <article className="stat-card">
            <div className="stat-card-label">Avg. Freelancer Rating</div>
            <div className="stat-card-val">
              {profile?.averageRating !== undefined ? profile.averageRating : "N/A"}
            </div>
            <div className="stat-card-meta">Based on completed projects</div>
          </article>
        </div>

        <div className="client-grid">
          <article className="job-details-card">
            <h3 className="client-section-title">Company Overview</h3>
            <p className="detail-paragraph">
              {profile?.bio || "No company overview added yet."}
            </p>
            <div className="job-tags">
              {profile?.preferredSkills && profile.preferredSkills.length > 0 ? (
                profile.preferredSkills.map((s) => (
                  <span key={s} className="tag">{s}</span>
                ))
              ) : (
                <span className="tag">No skills listed</span>
              )}
            </div>
          </article>

          <article className="job-details-card">
            <h3 className="client-section-title">Contact Details</h3>
            <div className="client-contact-list">
              <div className="detail-item">
                <span className="detail-label">Client ID</span>
                <span className="detail-value">{user?._id?.slice(-6).toUpperCase() || "N/A"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email</span>
                <span className="detail-value">{user?.email || "N/A"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Industry</span>
                <span className="detail-value">{profile?.industry || "Not set"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Company Size</span>
                <span className="detail-value">{profile?.companySize || "Not set"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Website</span>
                <span className="detail-value">{profile?.website || "Not set"}</span>
              </div>
            </div>
          </article>
        </div>

        <article className="job-details-card client-jobs-card">
          <h3 className="client-section-title">Posted Jobs</h3>
          <div className="client-jobs-list">
            {postedJobs.map((job) => (
              <div key={job.id} className="client-job-row">
                <div>
                  <div className="detail-value">{job.title}</div>
                  <div className="job-meta">
                    {job.id} · {job.bids} bids received
                  </div>
                </div>
                <span className="tag">{job.status}</span>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

export default ClientProfilePage;

