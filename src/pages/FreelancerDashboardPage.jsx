import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

function FreelancerDashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Mock projects data (replace with API later)
  const projects = [
    { title: "E-commerce Website", client: "Priya Sharma", budget: "₹15,000", status: "review", deadline: "Dec 20" },
    { title: "SEO Blog Posts", client: "StartupIndia", budget: "₹8,000", status: "active", deadline: "Dec 18" },
    { title: "App UI Design", client: "TechCorp", budget: "₹25,000", status: "active", deadline: "Jan 5" },
    { title: "Social Media Kit", client: "LocalBrand Co", budget: "₹3,000", status: "pending", deadline: "Dec 22" },
  ];

  const proposals = [
    { job: "React Native App", company: "TechCorp", bid: "₹30,000", status: "pending", submitted: "2d ago" },
    { job: "SEO Optimization", company: "StartupIndia", bid: "₹8,000", status: "accepted", submitted: "5d ago" },
    { job: "Dashboard Design", company: "DataPro", bid: "₹15,000", status: "rejected", submitted: "1w ago" },
  ];

  const transactions = [
    { project: "E-commerce Website", client: "Priya Sharma", amount: "+₹12,000", status: "Paid", date: "Dec 12, 2024" },
    { project: "Logo Design", client: "Raj Traders", amount: "+₹2,500", status: "Paid", date: "Dec 8, 2024" },
    { project: "SEO Blog Posts", client: "StartupIndia", amount: "₹6,200", status: "In Escrow", date: "Dec 5, 2024" },
    { project: "App UI Design", client: "TechCorp", amount: "+₹18,000", status: "Paid", date: "Nov 28, 2024" },
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
          navigate("/freelancer/setup-profile", { replace: true });
          return;
        }
        setError(message || "Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "FL";

  const trustScore = profile?.jobSuccessScore || 0;
  const trustClass = trustScore >= 80 ? "trust-high" : trustScore >= 60 ? "trust-mid" : "trust-low";

  const chartHeights = [30, 45, 25, 60, 40, 80, 55, 70, 90, 65, 85, 75];

  if (loading) {
    return (
      <div className="dash-layout">
        <div className="dash-main">
          <p style={{ color: "#a0a0a0" }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dash-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0 0.75rem", marginBottom: "1.75rem" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "50%",
            background: "linear-gradient(135deg, #7c3aed, #e8344a)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.9rem", fontWeight: 800, color: "#fff"
          }}>
            {initials}
          </div>
          <div>
            <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#fff" }}>{user?.fullName || "Freelancer"}</div>
            <div style={{ fontSize: "0.72rem", color: "#666" }}>Freelancer · {profile?.location?.city || "India"}</div>
          </div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-label">Main</div>
          <div className={`sidebar-link ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}>
            <span className="sidebar-icon">📊</span> Overview
          </div>
          <div className={`sidebar-link ${activeTab === "projects" ? "active" : ""}`} onClick={() => setActiveTab("projects")}>
            <span className="sidebar-icon">📁</span> My Projects
          </div>
          <div className={`sidebar-link ${activeTab === "proposals" ? "active" : ""}`} onClick={() => setActiveTab("proposals")}>
            <span className="sidebar-icon">📝</span> Proposals<span className="sidebar-badge">3</span>
          </div>
          <div className={`sidebar-link ${activeTab === "earnings" ? "active" : ""}`} onClick={() => setActiveTab("earnings")}>
            <span className="sidebar-icon">💰</span> Earnings
          </div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-label">Tools</div>
          <Link to="/freelancer-profile" className="sidebar-link">
            <span className="sidebar-icon">👤</span> My Profile
          </Link>
          <Link to="/browse-jobs" className="sidebar-link">
            <span className="sidebar-icon">🔍</span> Browse Jobs
          </Link>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-label">Account</div>
          <div className="sidebar-link" onClick={() => { logout(); navigate("/login"); }}>
            <span className="sidebar-icon">🚪</span> Logout
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dash-main">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "4px", color: "#fff" }}>
                  Good Morning, {user?.fullName?.split(" ")[0] || "Freelancer"} 👋
                </h2>
                <p style={{ color: "#a0a0a0", fontSize: "0.875rem" }}>
                  You have {proposals.filter(p => p.status === "pending").length} pending proposals and {projects.filter(p => p.status === "active").length} active projects
                </p>
              </div>
              <Link to="/browse-jobs" className="btn btn-red btn-sm">+ Find Jobs</Link>
            </div>

            {/* Stats */}
            <div className="stat-grid">
              <div className="stat-card">
                <div className="stat-card-label">Total Earned</div>
                <div className="stat-card-val" style={{ color: "#22c55e" }}>
                  ₹{profile?.totalEarnings?.toLocaleString() || "0"}
                </div>
                <div className="stat-card-change">↑ +₹8,200 this month</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-label">Active Projects</div>
                <div className="stat-card-val">{projects.filter(p => p.status === "active").length}</div>
                <div className="stat-card-change">{projects.filter(p => p.status === "active").length} deadlines this week</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-label">Trust Score</div>
                <div className="stat-card-val" style={{ color: trustScore >= 80 ? "#22c55e" : trustScore >= 60 ? "#f59e0b" : "#e8344a" }}>
                  {trustScore || "N/A"}
                </div>
                <div className="stat-card-change">↑ +5 this month</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-label">Profile Views</div>
                <div className="stat-card-val">342</div>
                <div className="stat-card-change neg">↓ -12 vs last week</div>
              </div>
            </div>

            {/* Two-column layout */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#fff" }}>Active Projects</h3>
                  <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab("projects")}>View all</button>
                </div>
                {projects.slice(0, 3).map((p, i) => (
                  <div key={i} className="project-row">
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: "2px", color: "#fff" }}>{p.title}</div>
                      <div style={{ fontSize: "0.75rem", color: "#666" }}>{p.client} · Due {p.deadline}</div>
                    </div>
                    <span className={`project-status ps-${p.status}`}>
                      {p.status === "review" ? "Under Review" : p.status === "active" ? "In Progress" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>

              <div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem", color: "#fff" }}>Earnings Chart</h3>
                <div className="job-details-card" style={{ padding: "1rem" }}>
                  <div className="mini-chart">
                    {chartHeights.map((h, i) => (
                      <div key={i} className="bar" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
                    <span style={{ fontSize: "0.7rem", color: "#666" }}>Jan</span>
                    <span style={{ fontSize: "0.7rem", color: "#666" }}>Jun</span>
                  </div>
                  <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                    <div style={{ fontSize: "0.75rem", color: "#666" }}>This month</div>
                    <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#22c55e" }}>₹8,200</div>
                  </div>
                </div>

                <div style={{ marginTop: "1rem" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem", color: "#fff" }}>Trust Score</h3>
                  <div className="job-details-card" style={{ padding: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1rem" }}>
                      <div className="trust-score-num">{trustScore || "N/A"}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.75rem", color: "#666", marginBottom: "4px" }}>
                          {trustScore >= 80 ? "Excellent" : trustScore >= 60 ? "Good" : "Needs Work"}
                        </div>
                        <div className="trust-bar">
                          <div className={`trust-fill ${trustClass}`} style={{ width: `${trustScore}%` }} />
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#666", marginBottom: "4px" }}>
                      Completed Projects <span style={{ color: "#22c55e", float: "right" }}>+{profile?.completedJobs || 0}</span>
                    </div>
                    <div className="trust-bar" style={{ marginBottom: "8px" }}>
                      <div className="trust-fill trust-high" style={{ width: "75%" }} />
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#666", marginBottom: "4px" }}>
                      Avg. Rating <span style={{ color: "#f59e0b", float: "right" }}>4.8★</span>
                    </div>
                    <div className="trust-bar" style={{ marginBottom: "8px" }}>
                      <div className="trust-fill trust-high" style={{ width: "96%" }} />
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#666", marginBottom: "4px" }}>
                      Response Rate <span style={{ color: "#a0a0a0", float: "right" }}>92%</span>
                    </div>
                    <div className="trust-bar">
                      <div className="trust-fill trust-high" style={{ width: "92%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* PROJECTS TAB */}
        {activeTab === "projects" && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.5rem", color: "#fff" }}>My Projects</h2>
              <button className="btn btn-red btn-sm">View Escrow</button>
            </div>
            {projects.map((p, i) => (
              <div key={i} className="job-details-card" style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: "4px", color: "#fff" }}>{p.title}</div>
                    <div style={{ fontSize: "0.8rem", color: "#666" }}>Client: {p.client} · Budget: {p.budget} · Deadline: {p.deadline}</div>
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span className={`project-status ps-${p.status}`}>
                      {p.status === "review" ? "Under Review" : p.status === "active" ? "In Progress" : "Pending"}
                    </span>
                    <button className="btn btn-ghost btn-sm">Milestones</button>
                    <button className="btn btn-ghost btn-sm">Chat</button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* PROPOSALS TAB */}
        {activeTab === "proposals" && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.5rem", color: "#fff" }}>My Proposals</h2>
              <Link to="/browse-jobs" className="btn btn-red btn-sm">+ New Proposal</Link>
            </div>
            {proposals.map((p, i) => (
              <div key={i} className="job-details-card" style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: "4px", color: "#fff" }}>{p.job}</div>
                    <div style={{ fontSize: "0.8rem", color: "#666" }}>{p.company} · Your bid: {p.bid} · Submitted {p.submitted}</div>
                  </div>
                  <span className={`badge ${p.status === "accepted" ? "badge-new" : p.status === "rejected" ? "badge-hot" : "badge-fixed"}`}>
                    {p.status === "accepted" ? "✓ Accepted" : p.status === "rejected" ? "✕ Not Selected" : "⏳ Pending"}
                  </span>
                </div>
              </div>
            ))}
          </>
        )}

        {/* EARNINGS TAB */}
        {activeTab === "earnings" && (
          <>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "#fff" }}>Earnings & Payouts</h2>
            <div className="stat-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
              <div className="stat-card">
                <div className="stat-card-label">Total Earned</div>
                <div className="stat-card-val" style={{ color: "#22c55e" }}>₹{profile?.totalEarnings?.toLocaleString() || "0"}</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-label">Pending Payout</div>
                <div className="stat-card-val" style={{ color: "#f59e0b" }}>₹6,200</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-label">This Month</div>
                <div className="stat-card-val">₹8,200</div>
              </div>
            </div>
            <div className="job-details-card" style={{ marginTop: "1.5rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem", color: "#fff" }}>Transaction History</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Client</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t, i) => (
                    <tr key={i}>
                      <td>{t.project}</td>
                      <td>{t.client}</td>
                      <td style={{ color: t.amount.startsWith("+") ? "#22c55e" : "#f59e0b" }}>{t.amount}</td>
                      <td>
                        <span className="status-dot">
                          <span className={`dot dot-${t.status === "Paid" ? "green" : "amber"}`} />
                          {t.status}
                        </span>
                      </td>
                      <td>{t.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default FreelancerDashboardPage;

