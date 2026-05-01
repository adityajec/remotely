import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api.js";

function JobDescriptionPage() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get(`/jobs/${jobId}`);
        setJob(response.data.job);
      } catch (err) {
        setError(err.response?.data?.message || "Job not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const formatBudget = () => {
    if (!job) return "";
    const currency = job.currency === "INR" ? "₹" : job.currency === "USD" ? "$" : "€";
    return `${currency}${job.budget?.toLocaleString()}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  if (loading) {
    return (
      <section className="section page-wrap">
        <div className="container">
          <p style={{ color: "#a0a0a0" }}>Loading job details...</p>
        </div>
      </section>
    );
  }

  if (!job || error) {
    return (
      <section className="section page-wrap">
        <div className="container">
          <h2>Job Not Found</h2>
          <p className="section-sub">{error || "The selected job does not exist or may have been removed."}</p>
          <Link to="/browse-jobs" className="btn btn-ghost btn-sm">Back to Browse Jobs</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section page-wrap">
      <div className="container">
        <div className="section-head">
          <h2>Job Description</h2>
          <div className="section-actions">
            <Link to={`/jobs/${job._id}/apply`} className="btn btn-red btn-sm">Apply</Link>
            <Link to="/browse-jobs" className="btn btn-ghost btn-sm">Back</Link>
          </div>
        </div>

        <article className="job-details-card">
          <div className="job-details-grid">
            <div className="detail-item">
              <span className="detail-label">Posted By</span>
              <span className="detail-value">{job.clientId?.fullName || "Client"}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Status</span>
              <span className="detail-value" style={{ textTransform: "capitalize" }}>{job.status}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Job Title</span>
              <span className="detail-value">{job.title}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Category</span>
              <span className="detail-value">{job.category || "Other"}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Experience Level</span>
              <span className="detail-value" style={{ textTransform: "capitalize" }}>{job.experienceLevel || "Entry"}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Location</span>
              <span className="detail-value">{job.location || "Remote"}</span>
            </div>
            <div className="detail-item detail-item--full">
              <span className="detail-label">Description</span>
              <p className="detail-value detail-paragraph">{job.description}</p>
            </div>
            <div className="detail-item detail-item--full">
              <span className="detail-label">Required Skills</span>
              <div className="job-tags">
                {job.requiredSkills?.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-label">Budget</span>
              <span className="detail-value" style={{ color: "#22c55e", fontWeight: 700 }}>{formatBudget()}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Deadline</span>
              <span className="detail-value">{formatDate(job.deadline)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Proposals</span>
              <span className="detail-value">{job.proposalCount || 0} received</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Posted</span>
              <span className="detail-value">{formatDate(job.createdAt)}</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

export default JobDescriptionPage;

