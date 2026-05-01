import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

function AdminDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("users");

  const users = [
    { name: "Arjun Kumar", role: "Freelancer", location: "Indore, MP", trust: 87, status: "active" },
    { name: "Priya Sharma", role: "Client", location: "Bhopal, MP", trust: 91, status: "active" },
    { name: "Rahul Singh", role: "Freelancer", location: "Jabalpur, MP", trust: 54, status: "warning" },
    { name: "Neha Patel", role: "Freelancer", location: "Pune, MH", trust: 78, status: "active" },
    { name: "Vikram Desai", role: "Client", location: "Mumbai, MH", trust: 32, status: "suspended" },
  ];

  const jobs = [
    { title: "E-commerce Website", client: "Priya Sharma", budget: "₹15,000", proposals: 8, status: "open" },
    { title: "Logo Design", client: "Raj Traders", budget: "₹2,500", proposals: 12, status: "open" },
    { title: "SEO Blog Posts", client: "StartupIndia", budget: "₹8,000", proposals: 5, status: "in-progress" },
    { title: "Mobile App UI", client: "TechCorp", budget: "₹25,000", proposals: 3, status: "review" },
  ];

  const disputes = [
    { id: "#D-1042", freelancer: "Rahul Singh", client: "Vikram Desai", amount: "₹5,000", reason: "Work not delivered" },
    { id: "#D-1041", freelancer: "Anjali Rao", client: "ABC Corp", amount: "₹12,000", reason: "Quality issue" },
    { id: "#D-1039", freelancer: "Mohit Jain", client: "Priya Tech", amount: "₹3,500", reason: "Scope creep" },
  ];

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD";

  return (
    <div className="dash-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0 0.75rem", marginBottom: "1.75rem" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "50%",
            background: "linear-gradient(135deg, #e8344a, #f59e0b)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.9rem", fontWeight: 800, color: "#fff"
          }}>
            {initials}
          </div>
          <div>
            <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#fff" }}>{user?.fullName || "Admin"}</div>
            <div style={{ fontSize: "0.72rem", color: "#666" }}>Administrator</div>
          </div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-label">Main</div>
          <div className={`sidebar-link ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
            <span className="sidebar-icon">👥</span> Users
          </div>
          <div className={`sidebar-link ${activeTab === "jobs" ? "active" : ""}`} onClick={() => setActiveTab("jobs")}>
            <span className="sidebar-icon">📁</span> Jobs
          </div>
          <div className={`sidebar-link ${activeTab === "disputes" ? "active" : ""}`} onClick={() => setActiveTab("disputes")}>
            <span className="sidebar-icon">⚠️</span> Disputes
          </div>
          <div className={`sidebar-link ${activeTab === "analytics" ? "active" : ""}`} onClick={() => setActiveTab("analytics")}>
            <span className="sidebar-icon">📈</span> Analytics
          </div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-label">Account</div>
          <div className="sidebar-link">
            <span className="sidebar-icon">🚪</span> Logout
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dash-main">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#ff4d66", marginBottom: "0.5rem" }}>Admin Panel</div>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "0", color: "#fff" }}>Remotely Dashboard</h2>
          </div>
        </div>

        {/* Stats */}
        <div className="stat-grid" style={{ marginBottom: "2rem" }}>
          <div className="stat-card">
            <div className="stat-card-label">Total Users</div>
            <div className="stat-card-val">12,843</div>
            <div className="stat-card-change">↑ +234 today</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Active Jobs</div>
            <div className="stat-card-val">1,247</div>
            <div className="stat-card-change">↑ +89 today</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">GMV This Month</div>
            <div className="stat-card-val" style={{ color: "#22c55e" }}>₹2.4Cr</div>
            <div className="stat-card-change">↑ +18% vs last</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Open Disputes</div>
            <div className="stat-card-val" style={{ color: "#ff4d66" }}>14</div>
            <div className="stat-card-change neg">↑ +3 today</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button className={`admin-tab ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>Users</button>
          <button className={`admin-tab ${activeTab === "jobs" ? "active" : ""}`} onClick={() => setActiveTab("jobs")}>Jobs</button>
          <button className={`admin-tab ${activeTab === "disputes" ? "active" : ""}`} onClick={() => setActiveTab("disputes")}>Disputes</button>
          <button className={`admin-tab ${activeTab === "analytics" ? "active" : ""}`} onClick={() => setActiveTab("analytics")}>Analytics</button>
        </div>

        {/* USERS TAB */}
        {activeTab === "users" && (
          <div className="job-details-card">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Location</th>
                  <th>Trust Score</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={i}>
                    <td><b>{u.name}</b></td>
                    <td>{u.role}</td>
                    <td>{u.location}</td>
                    <td style={{ color: u.trust >= 80 ? "#22c55e" : u.trust >= 60 ? "#f59e0b" : "#ff4d66" }}>{u.trust}</td>
                    <td>
                      <span className="status-dot">
                        <span className={`dot dot-${u.status === "active" ? "green" : u.status === "warning" ? "amber" : "red"}`} />
                        {u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <button className={`btn btn-sm ${u.status === "suspended" ? "btn-red" : "btn-ghost"}`}>
                        {u.status === "suspended" ? "Unsuspend" : "View"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* JOBS TAB */}
        {activeTab === "jobs" && (
          <div className="job-details-card">
            <table className="table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Client</th>
                  <th>Budget</th>
                  <th>Proposals</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j, i) => (
                  <tr key={i}>
                    <td><b>{j.title}</b></td>
                    <td>{j.client}</td>
                    <td>{j.budget}</td>
                    <td>{j.proposals}</td>
                    <td>
                      <span className="status-dot">
                        <span className={`dot dot-${j.status === "open" ? "green" : j.status === "in-progress" ? "blue" : "amber"}`} />
                        {j.status === "open" ? "Open" : j.status === "in-progress" ? "In Progress" : "Review"}
                      </span>
                    </td>
                    <td><button className="btn btn-ghost btn-sm">View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* DISPUTES TAB */}
        {activeTab === "disputes" && (
          <div className="job-details-card">
            <table className="table">
              <thead>
                <tr>
                  <th>Dispute ID</th>
                  <th>Freelancer</th>
                  <th>Client</th>
                  <th>Amount</th>
                  <th>Reason</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {disputes.map((d, i) => (
                  <tr key={i}>
                    <td>{d.id}</td>
                    <td>{d.freelancer}</td>
                    <td>{d.client}</td>
                    <td>{d.amount}</td>
                    <td>{d.reason}</td>
                    <td><button className="btn btn-red btn-sm">Resolve</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === "analytics" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            <div className="job-details-card">
              <h4 style={{ fontWeight: 700, marginBottom: "1rem", fontSize: "0.9rem", color: "#fff" }}>Users by Role</h4>
              <div style={{ fontSize: "0.85rem", marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Freelancers</span>
                <span style={{ fontWeight: 700 }}>9,234</span>
              </div>
              <div className="trust-bar" style={{ marginBottom: "12px" }}>
                <div className="trust-fill trust-high" style={{ width: "72%" }} />
              </div>
              <div style={{ fontSize: "0.85rem", marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Clients</span>
                <span style={{ fontWeight: 700 }}>3,609</span>
              </div>
              <div className="trust-bar">
                <div className="trust-fill" style={{ width: "28%", background: "#3b82f6" }} />
              </div>
            </div>

            <div className="job-details-card">
              <h4 style={{ fontWeight: 700, marginBottom: "1rem", fontSize: "0.9rem", color: "#fff" }}>Top Cities</h4>
              <div style={{ fontSize: "0.85rem", display: "grid", gap: "8px" }}>
                {[
                  { city: "Indore", count: "2,341" },
                  { city: "Bhopal", count: "1,876" },
                  { city: "Jabalpur", count: "987" },
                  { city: "Mumbai", count: "3,210" },
                  { city: "Delhi", count: "2,129" },
                ].map((c, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#666" }}>{c.city}</span>
                    <span>{c.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="job-details-card">
              <h4 style={{ fontWeight: 700, marginBottom: "1rem", fontSize: "0.9rem", color: "#fff" }}>AI Usage</h4>
              <div style={{ fontSize: "0.85rem", display: "grid", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#666" }}>AI Proposals Generated</span>
                  <span style={{ color: "#22c55e" }}>4,231</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#666" }}>Proposals Accepted</span>
                  <span style={{ color: "#22c55e" }}>62%</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#666" }}>AI Bios Created</span>
                  <span>1,892</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#666" }}>Smart Matches Made</span>
                  <span>7,430</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboardPage;

