import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api.js";

function ClientProposalsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [accepting, setAccepting] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch job details
        const jobResponse = await api.get(`/jobs/${jobId}`);
        setJob(jobResponse.data.job);

        // Fetch proposals for this job
        const proposalsResponse = await api.get(`/proposals/job/${jobId}`);
        setProposals(proposalsResponse.data.proposals);

      } catch (err) {
        setError(err.response?.data?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId]);

  const handleAcceptProposal = async (proposalId) => {
    try {
      setAccepting(proposalId);
      await api.post(`/proposals/${proposalId}/accept`);

      // Refresh the page to show updated status
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to accept proposal");
    } finally {
      setAccepting(null);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-content">
          <p style={{ color: "#a0a0a0", textAlign: "center" }}>Loading proposals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="page-content">
          <div style={{ textAlign: "center", color: "#ff6b6b" }}>
            <p>{error}</p>
            <button
              onClick={() => navigate("/client/dashboard")}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-content">
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: "2rem" }}>
            <h1 style={{ color: "#fff", marginBottom: "0.5rem" }}>
              Proposals for: {job?.title}
            </h1>
            <p style={{ color: "#a0a0a0" }}>
              {proposals.length} proposal{proposals.length !== 1 ? "s" : ""} received
            </p>
          </div>

          {/* Proposals List */}
          {proposals.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "3rem",
              background: "#1a1a1a",
              borderRadius: "8px",
              color: "#a0a0a0"
            }}>
              <p>No proposals received yet.</p>
              <p>Check back later or consider extending the deadline.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {proposals.map((proposal) => (
                <div
                  key={proposal._id}
                  style={{
                    background: "#1a1a1a",
                    borderRadius: "8px",
                    padding: "1.5rem",
                    border: "1px solid #333"
                  }}
                >
                  {/* Freelancer Info */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "1rem"
                  }}>
                    <div style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #0d9488, #3b82f6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      color: "#fff"
                    }}>
                      {proposal.freelancerId?.fullName
                        ?.split(" ")
                        .map(n => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2) || "FL"}
                    </div>
                    <div>
                      <h3 style={{ color: "#fff", margin: "0 0 0.25rem 0" }}>
                        {proposal.freelancerId?.fullName || "Freelancer"}
                      </h3>
                      <p style={{ color: "#a0a0a0", margin: 0, fontSize: "0.9rem" }}>
                        {proposal.freelancerId?.email}
                      </p>
                    </div>
                  </div>

                  {/* Proposal Details */}
                  <div style={{ marginBottom: "1rem" }}>
                    <div style={{
                      display: "flex",
                      gap: "1rem",
                      marginBottom: "1rem",
                      flexWrap: "wrap"
                    }}>
                      <div style={{
                        background: "#2a2a2a",
                        padding: "0.5rem 1rem",
                        borderRadius: "20px",
                        fontSize: "0.9rem",
                        color: "#fff"
                      }}>
                        Bid: ${proposal.bidAmount}
                      </div>
                      <div style={{
                        background: "#2a2a2a",
                        padding: "0.5rem 1rem",
                        borderRadius: "20px",
                        fontSize: "0.9rem",
                        color: "#fff"
                      }}>
                        Est. {proposal.estimatedDays} days
                      </div>
                      {proposal.aiGenerated && (
                        <div style={{
                          background: "#1a365d",
                          padding: "0.5rem 1rem",
                          borderRadius: "20px",
                          fontSize: "0.9rem",
                          color: "#63b3ed"
                        }}>
                          AI Generated
                        </div>
                      )}
                    </div>

                    <div style={{
                      background: "#0f0f0f",
                      padding: "1rem",
                      borderRadius: "6px",
                      border: "1px solid #333"
                    }}>
                      <p style={{ color: "#e0e0e0", margin: 0, lineHeight: 1.5 }}>
                        {proposal.proposalText}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{
                    display: "flex",
                    gap: "1rem",
                    justifyContent: "flex-end"
                  }}>
                    <button
                      onClick={() => handleAcceptProposal(proposal._id)}
                      disabled={accepting === proposal._id}
                      style={{
                        padding: "0.75rem 1.5rem",
                        background: "#0d9488",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: accepting === proposal._id ? "not-allowed" : "pointer",
                        opacity: accepting === proposal._id ? 0.6 : 1,
                        fontWeight: "500"
                      }}
                    >
                      {accepting === proposal._id ? "Accepting..." : "Accept Proposal"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Back Button */}
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button
              onClick={() => navigate("/client/dashboard")}
              style={{
                padding: "0.75rem 1.5rem",
                background: "#374151",
                color: "#e0e0e0",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "500"
              }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientProposalsPage;