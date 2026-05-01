import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

function ClientDashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data (replace with API later)
  const postedJobs = [
    { title: "E-commerce Website", proposals: 8, status: "open", budget: "₹15,000" },
    { title: "Logo Design", proposals: 12, status: "open", budget: "₹2,500" },
    { title: "SEO Blog Posts", proposals: 5, status: "in-progress", budget: "₹8,000" },
    { title: "Mobile App UI", proposals: 3, status: "review", budget: "₹25,000" },
  ];

  const hiredFreelancers = [
    { name: "Arjun Kumar", skill: "Full-Stack Developer", rate: "₹800/hr", project: "E-commerce Website", status: "active" },
    { name: "Neha Patel", skill: "UI/UX Designer", rate: "₹650/hr", project: "Logo Design", status: "completed" },
  ];

  const transactions = [
    { project: "E-commerce Website", freelancer: "Arjun Kumar", amount: "₹15,000", status: "In Escrow", date: "Dec 12, 2024" },
    { project: "Logo Design", freelancer: "Neha Patel", amount: "₹2,500", status: "Paid", date: "Dec 8, 2024" },
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
          navigate("/client/setup-profile", { replace: true });
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
    : "CL";

  const chartHeights = [40, 55, 35, 70, 50, 85, 60, 75, 95, 70, 80, 65];

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
            background: "linear-gradient(135deg, #0d9488, #3b82f6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.9rem", fontWeight: 800, color: "#fff"
          }}>
            {initials}
          </div>
          <div>
            <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#fff" }}>{user?.fullName || "Client"}</div>
            <div style={{ fontSize: "0.72rem", color: "#666" }}>Client · {profile?.location?.city || "India"}</div>
          </div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-label">Main</div>
          <div className={`sidebar-link ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}>
            <span className="sidebar-icon">📊</span> Overview
          </div>
          <div className={`sidebar-link ${activeTab === "jobs" ? "active" : ""}`} onClick={() => setActiveTab("jobs")}>
            <span className="sidebar-icon">📁</span> My Jobs
          </div>
          <div className={`sidebar-link ${activeTab === "hires" ? "active" : ""}`} onClick={() => setActiveTab("hires")}>
            <span className="sidebar-icon">👥</span> Hired Freelancers
          </div>
          <div className={`sidebar-link ${activeTab === "spending" ? "active" : ""}`} onClick={() => setActiveTab("spending")}>
            <span className="sidebar-icon">💰</span> Spending
          </div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-label">Tools</div>
          <Link to="/client-profile" className="sidebar-link">
            <span className="sidebar-icon">👤</span> My Profile
          </Link>
          <Link to="/find-talent" className="sidebar-link">
            <span className="sidebar-icon">🔍</span> Find Talent
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
                  Good Morning, {user?.fullName?.split(" ")[0] || "Client"} 👋
                </h2>
                <p style={{ color: "#a0a0a0", fontSize: "0.875rem" }}>
                  You have {postedJobs.filter(j => j.status === "open").length} open jobs and {hiredFreelancers.filter(h => h.status === "active").length} active contracts
                </p>
              </div>
              <button className="btn btn-red btn-sm">+ Post a Job</button>
            </div>

            {/* Stats */}
            <div className="stat-grid">
              <div className="stat-card">
                <div className="stat-card-label">Total Spent</div>
                <div className="stat-card-val" style={{ color: "#e8344a" }}>
                  ₹{profile?.totalSpent?.toLocaleString() || "0"}
                </div>
                <div className="stat-card-change">↑ +₹15,000 this month</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-label">Active Contracts</div>
                <div className="stat-card-val">{hiredFreelancers.filter(h => h.status === "active").length}</div>
                <div className="stat-card-change">{hiredFreelancers.filter(h => h.status === "active").length} in progress</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-label">Jobs Posted</div>
                <div className="stat-card-val">{profile?.jobsPosted || 0}</div>
                <div className="stat-card-change">↑ +2 this month</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-label">Hire Rate</div>
                <div className="stat-card-val" style={{ color: "#22c55e" }}>
                  {profile?.hireRate !== undefined ? `${profile.hireRate}%` : "N/A"}
                </div>
                <div className="stat-card-change">Strong hiring history</div>
              </div>
            </div>

            {/* Two-column layout */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#fff" }}>Posted Jobs</h3>
                  <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab("jobs")}>View all</button>
                </div>
                {postedJobs.slice(0, 3).map((j, i) => (
                  <div key={i} className="project-row">
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: "2px", color: "#fff" }}>{j.title}</div>
                      <div style={{ fontSize: "0.75rem", color: "#666" }}>Budget: {j.budget} · {j.proposals} proposals</div>
                    </div>
                    <span className={`project-status ps-${j.status === "open" ? "active" : j.status === "in-progress" ? "pending" : "review"}`}>
                      {j.status === "open" ? "Open" : j.status === "in-progress" ? "In Progress" : "Under Review"}
                    </span>
                  </div>
                ))}
              </div>

              <div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem", color: "#fff" }}>Spending Chart</h3>
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
                    <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#e8344a" }}>₹15,000</div>
                  </div>
                </div>

                <div style={{ marginTop: "1rem" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem", color: "#fff" }}>Payment Status</h3>
                  <div className="job-details-card" style={{ padding: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1rem" }}>
                      <div style={{ fontSize: "2.5rem", fontWeight: 800, color: profile?.paymentVerified ? "#22c55e" : "#f59e0b" }}>
                        {profile?.paymentVerified ? "✓" : "!"}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.75rem", color: "#666", marginBottom: "4px" }}>
                          {profile?.paymentVerified ? "Verified" : "Not Verified"}
                        </div>
                        <div style={{ fontSize: "0.875rem", color: "#fff" }}>
                          {profile?.paymentVerified ? "Your payment method is verified" : "Please verify your payment method"}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#666", marginBottom: "4px" }}>
                      Total Spent <span style={{ color: "#e8344a", float: "right" }}>₹{profile?.totalSpent || 0}</span>
                    </div>
                    <div className="trust-bar" style={{ marginBottom: "8px" }}>
                      <div className="trust-fill trust-high" style={{ width: "60%" }} />
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#666", marginBottom: "4px" }}>
                      Active Contracts <span style={{ color: "#a0a0a0", float: "right" }}>{hiredFreelancers.filter(h => h.status === "active").length}</span>
                    </div>
                    <div className="trust-bar">
                      <div className="trust-fill trust-mid" style={{ width: "40%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* JOBS TAB */}
        {activeTab === "jobs" && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.5rem", color: "#fff" }}>My Jobs</h2>
              <button className="btn btn-red btn-sm">+ Post New Job</button>
            </div>
            {postedJobs.map((j, i) => (
              <div key={i} className="job-details-card" style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: "4px", color: "#fff" }}>{j.title}</div>
                    <div style={{ fontSize: "0.8rem", color: "#666" }}>Budget: {j.budget} · {j.proposals} proposals received</div>
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span className={`project-status ps-${j.status === "open" ? "active" : j.status === "in-progress" ? "pending" : "review"}`}>
                      {j.status === "open" ? "Open" : j.status === "in-progress" ? "In Progress" : "Under Review"}
                    </span>
                    <button className="btn btn-ghost btn-sm">View Proposals</button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* HIRES TAB */}
        {activeTab === "hires" && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.5rem", color: "#fff" }}>Hired Freelancers</h2>
              <Link to="/find-talent" className="btn btn-red btn-sm">+ Hire New</Link>
            </div>
            {hiredFreelancers.map((h, i) => (
              <div key={i} className="job-details-card" style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: "4px", color: "#fff" }}>{h.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "#666" }}>{h.skill} · {h.rate} · Project: {h.project}</div>
                  </div>
                  <span className={`project-status ps-${h.status === "active" ? "active" : "completed"}`}>
                    {h.status === "active" ? "Active" : "Completed"}
                  </span>
                </div>
              </div>
            ))}
          </>
        )}

        {/* SPENDING TAB */}
        {activeTab === "spending" && (
          <>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "#fff" }}>Spending & Payments</h2>
            <div className="stat-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
              <div className="stat-card">
                <div className="stat-card-label">Total Spent</div>
                <div className="stat-card-val" style={{ color: "#e8344a" }}>₹{profile?.totalSpent?.toLocaleString() || "0"}</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-label">In Escrow</div>
                <div className="stat-card-val" style={{ color: "#f59e0b" }}>₹15,000</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-label">This Month</div>
                <div className="stat-card-val">₹15,000</div>
              </div>
            </div>
            <div className="job-details-card" style={{ marginTop: "1.5rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem", color: "#fff" }}>Payment History</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Freelancer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t, i) => (
                    <tr key={i}>
                      <td>{t.project}</td>
                      <td>{t.freelancer}</td>
                      <td style={{ color: "#e8344a" }}>{t.amount}</td>
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

export default ClientDashboardPage;

