import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-grid">
        <div>
          <div className="footer-logo">💼 Remotely</div>
          <p className="footer-desc">
            India&apos;s most beginner-friendly AI-powered freelance platform.
            Built to solve trust and access problems.
          </p>
        </div>
        <div className="footer-col">
          <h4>Platform</h4>
          <ul>
            <li>
              <Link to="/browse-jobs">Browse Jobs</Link>
            </li>
            <li>
              <Link to="/find-talent">Find Talent</Link>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Resources</h4>
          <ul>
            <li>
              <a href="#">Freelancer Guide</a>
            </li>
            <li>
              <a href="#">AI Features</a>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li>
              <a href="#">About Us</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2025 Remotely Technologies Pvt. Ltd. · Made in India</span>
        <span>Indore, Madhya Pradesh</span>
      </div>
    </footer>
  );
}

export default Footer;
