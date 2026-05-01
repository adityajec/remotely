import { freelancers } from "../data/mockData";

function FindTalentPage() {
  return (
    <section className="section page-wrap">
      <div className="container">
        <h2>Find Talent</h2>
        <p className="section-sub">AI-matched freelancers for your project</p>
        <div className="freelancers-grid">
          {freelancers.map((fl) => (
            <article key={fl.name} className="freelancer-card">
              <h3 className="fl-name">{fl.name}</h3>
              <p className="fl-skill">{fl.skill}</p>
              <p className="fl-location">{fl.loc}</p>
              <p className="fl-rate">{fl.rate}</p>
              <div className="trust-score">Trust Score: {fl.trust}/100</div>
              <button type="button" className="btn btn-red btn-sm">
                Hire
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FindTalentPage;
