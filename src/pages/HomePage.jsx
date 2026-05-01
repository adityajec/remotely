import { Link } from "react-router-dom";
import { freelancers, jobs } from "../data/mockData";

function HomePage() {
  return (
    <div>
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">AI-Powered Freelance Platform</div>
          <h1>
            Start Your Freelance Journey
            <br />
            <span className="accent">With Confidence</span>
          </h1>
          <p className="hero-sub">
            Remotely connects beginner freelancers with trusted clients across
            India.
          </p>
          <div className="hero-btns">
            <Link className="btn btn-red" to="/browse-jobs">
              Browse Jobs
            </Link>
            <Link className="btn btn-ghost" to="/find-talent">
              Find Talent
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Fresh Opportunities</h2>
            <Link to="/browse-jobs" className="btn btn-ghost btn-sm">
              View all
            </Link>
          </div>
          <div className="jobs-grid">
            {jobs.slice(0, 3).map((job) => (
              <article key={job.title} className="job-card">
                <div className="job-top">
                  <h3>{job.title}</h3>
                  <span className={`badge badge-${job.badge}`}>
                    {job.badge === "hot" ? "Hot" : "New"}
                  </span>
                </div>
                <p className="job-desc">{job.desc}</p>
                <div className="job-tags">
                  {job.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="job-footer">
                  <span className="job-budget">{job.budget}</span>
                  <span className="job-meta">{job.location}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-head">
            <h2>Verified Freelancers</h2>
            <Link to="/find-talent" className="btn btn-ghost btn-sm">
              See all
            </Link>
          </div>
          <div className="freelancers-grid">
            {freelancers.map((fl) => (
              <article key={fl.name} className="freelancer-card">
                <div className="fl-name">{fl.name}</div>
                <div className="fl-skill">{fl.skill}</div>
                <div className="fl-location">{fl.loc}</div>
                <div className="fl-rate">{fl.rate}</div>
                <div className="trust-score">Trust Score: {fl.trust}/100</div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
