import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api.js";

function SubmitProposalPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobError, setJobError] = useState("");

  const [bidAmount, setBidAmount] = useState("");
  const [estimatedDays, setEstimatedDays] = useState("7");
  const [proposalText, setProposalText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/jobs/${jobId}`);
        setJob(response.data.job);
      } catch (err) {
        setJobError(err.response?.data?.message || "Job not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleGenerateAI = () => {
    if (!job) return;
    const aiText = `Hello, I would love to work on "${job.title}".

I have relevant experience with ${job.requiredSkills?.join(", ")} and can deliver high-quality results within timeline.

For this project, I will provide:
- Clear communication and milestone updates
- Clean and scalable implementation  
- On-time delivery with testing

Looking forward to collaborating with you.`;
    setProposalText(aiText);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");

    if (!bidAmount || !proposalText || !estimatedDays) {
      setSubmitError("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/proposals", {
        jobId,
        proposalText: proposalText.trim(),
        bidAmount: Number(bidAmount),
        estimatedDays: Number(estimatedDays),
      });
      navigate(`/jobs/${jobId}/proposal-submitted`, { state: { jobTitle: job?.title } });
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to submit proposal.";
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
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

  if (!job || jobError) {
    return (
      <section className="section page-wrap">
        <div className="container">
          <h2>Job Not Found</h2>
          <p className="section-sub">{jobError || "Unable to create proposal for this job."}</p>
          <Link to="/browse-jobs" className="btn btn-ghost btn-sm">Back to Browse Jobs</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section page-wrap">
      <div className="container">
        <div className="section-head">
          <h2>Submit Proposal</h2>
          <Link to={`/jobs/${job._id}`} className="btn btn-ghost btn-sm">Back to Job</Link>
        </div>

        {submitError && (
          <div className="job-details-card" style={{ color: "#ff4d66", marginBottom: "1rem" }}>
            {submitError}
          </div>
        )}

        <div className="proposal-card">
          <form className="proposal-form" onSubmit={handleSubmit}>
            <label className="form-label">Job Title</label>
            <input className="form-input" value={job.title} readOnly />

            <label className="form-label">Client</label>
            <input className="form-input" value={job.clientId?.fullName || "Client"} readOnly />

            <label className="form-label">Budget</label>
            <input className="form-input" value={`₹${job.budget?.toLocaleString()}`} readOnly />

            <label className="form-label" htmlFor="bid-amount">Bid Amount (₹)</label>
            <input
              id="bid-amount"
              className="form-input"
              type="number"
              placeholder="e.g. 12000"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              required
            />

            <label className="form-label" htmlFor="timeline">Estimated Days</label>
            <input
              id="timeline"
              className="form-input"
              type="number"
              min="1"
              max="365"
              placeholder="e.g. 7"
              value={estimatedDays}
              onChange={(e) => setEstimatedDays(e.target.value)}
              required
            />

            <label className="form-label" htmlFor="proposal-text">Proposal Text</label>
            <textarea
              id="proposal-text"
              className="form-input proposal-textarea"
              placeholder="Write why you're the best fit..."
              value={proposalText}
              onChange={(e) => setProposalText(e.target.value)}
              required
            />
            <button
              type="button"
              className="btn btn-ghost btn-sm proposal-ai-btn"
              onClick={handleGenerateAI}
            >
              ✨ Generate with AI
            </button>

            <button type="submit" className="btn btn-red proposal-submit-btn" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Proposal"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default SubmitProposalPage;

