import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";

function BrowseJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError("");
        const params = {};
        if (search) params.search = search;
        if (category) params.category = category;

        const response = await api.get("/jobs/open", { params });
        setJobs(response.data.jobs || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [search, category]);

  const formatBudget = (job) => {
    const currency = job.currency === "INR" ? "₹" : job.currency === "USD" ? "$" : "€";
    return `${currency}${job.budget?.toLocaleString()}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const getBadge = (job) => {
    const hoursAgo = (Date.now() - new Date(job.createdAt)) / (1000 * 60 * 60);
    if (hoursAgo < 24) return { class: "badge-new", text: "✦ New" };
    if (job.budget >= 20000) return { class: "badge-hot", text: "🔥 Hot" };
    return { class: "badge-fixed", text: "Fixed Price" };
  };

  return (
    <section className="section page-wrap" style={{ paddingTop: "2rem" }}>
      <div style={{ background: "#111", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "2.5rem 2rem", marginBottom: "2rem" }}>
        <div className="container">
          <h2 style={{ marginBottom: "0.5rem" }}>Browse Jobs</h2>
          <p style={{ color: "#a0a0a0", marginBottom: "1.5rem" }}>Find your perfect project match</p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input
              className="form-input"
              placeholder="🔍  Search jobs, skills, keywords..."
              style={{ flex: 1, minWidth: "200px", maxWidth: "400px" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select className="form-input" style={{ width: "auto" }} value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              <option value="Web Development">Web Development</option>
              <option value="Design">Design</option>
              <option value="Content Writing">Content Writing</option>
              <option value="Digital Marketing">Digital Marketing</option>
              <option value="Data Entry">Data Entry</option>
              <option value="Other">Other</option>
            </select>
            <button className="btn btn-red" onClick={() => { setSearch(""); setCategory(""); }}>Clear</button>
          </div>
        </div>
      </div>

      <div className="container">
        {loading && <p style={{ color: "#a0a0a0" }}>Loading jobs...</p>}
        {error && <p style={{ color: "#ff4d66" }}>{error}</p>}

        {!loading && !error && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <span style={{ fontWeight: 700, color: "#fff" }}>{jobs.length} jobs found</span>
                <span style={{ color: "#666", fontSize: "0.875rem", marginLeft: "8px" }}>· Updated just now</span>
              </div>
            </div>

            {jobs.length === 0 ? (
              <p style={{ color: "#a0a0a0" }}>No jobs found matching your criteria.</p>
            ) : (
              <div className="jobs-grid">
                {jobs.map((job) => {
                  const badge = getBadge(job);
                  return (
                    <Link key={job._id} to={`/jobs/${job._id}`} className="job-card job-card-link">
                      <div className="job-top">
                        <div>
                          <h3>{job.title}</h3>
                          <div className="job-meta">{job.clientId?.fullName || "Client"}</div>
                        </div>
                        <span className={`badge ${badge.class}`}>{badge.text}</span>
                      </div>
                      <p className="job-desc">{job.description?.slice(0, 120)}...</p>
                      <div className="job-tags">
                        {job.requiredSkills?.slice(0, 4).map((tag) => (
                          <span key={tag} className="tag">{tag}</span>
                        ))}
                      </div>
                      <div className="job-footer">
                        <span className="job-budget">{formatBudget(job)}</span>
                        <span className="job-meta">
                          {job.location} · {job.proposalCount || 0} proposals · Due {formatDate(job.deadline)}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default BrowseJobsPage;

