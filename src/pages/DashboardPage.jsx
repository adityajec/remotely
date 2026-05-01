import { dashboardStats } from "../data/mockData";

function DashboardPage() {
  return (
    <section className="section page-wrap">
      <div className="container">
        <h2>Dashboard</h2>
        <p className="section-sub">Your freelance performance overview</p>
        <div className="stat-grid">
          {dashboardStats.map((stat) => (
            <article key={stat.label} className="stat-card">
              <div className="stat-card-label">{stat.label}</div>
              <div className="stat-card-val">{stat.value}</div>
              <div className="stat-card-meta">{stat.meta}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DashboardPage;
