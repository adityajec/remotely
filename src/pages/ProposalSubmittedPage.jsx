import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function ProposalSubmittedPage() {
  const location = useLocation();
  const [jobTitle, setJobTitle] = useState("");

  useEffect(() => {
    setJobTitle(location.state?.jobTitle || "the job");
  }, [location.state]);

  return (
    <section className="section page-wrap">
      <div className="container">
        <div className="proposal-done-card">
          <div className="done-logo">✓</div>
          <h2>Proposal Submitted!</h2>
          <p className="proposal-done-subtext" style={{ color: "#a0a0a0", marginBottom: "1.5rem" }}>
            Your proposal for <strong>"{jobTitle}"</strong> has been sent to the client. You'll be notified when they respond.
          </p>
          <div className="proposal-done-actions">
            <Link to="/browse-jobs" className="btn btn-ghost btn-sm">
              Browse More Jobs
            </Link>
            <Link to="/freelancer/dashboard" className="btn btn-red btn-sm">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProposalSubmittedPage;
