import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";

function PostJobPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requiredSkills: "",
    budget: "",
    deadline: "",
    category: "Web Development",
    location: "Remote",
    experienceLevel: "entry",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title || !formData.description || !formData.budget || !formData.deadline) {
      setError("Please fill in all required fields.");
      return;
    }

    const payload = {
      ...formData,
      requiredSkills: formData.requiredSkills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
      budget: Number(formData.budget),
    };

    setLoading(true);
    try {
      const response = await api.post("/jobs", payload);
      const jobId = response.data.job._id;
      navigate(`/jobs/${jobId}`, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section page-wrap">
      <div className="container">
        <div className="section-head">
          <h2>Post a New Job</h2>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>← Back</button>
        </div>

        {error && (
          <div className="job-details-card" style={{ color: "#ff4d66", marginBottom: "1rem" }}>
            {error}
          </div>
        )}

        <div className="proposal-card">
          <form className="proposal-form" onSubmit={handleSubmit}>
            <label className="form-label" htmlFor="title">Job Title *</label>
            <input
              id="title"
              name="title"
              className="form-input"
              placeholder="e.g. Build a landing page for my startup"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <label className="form-label" htmlFor="category">Category</label>
            <select id="category" name="category" className="form-input" value={formData.category} onChange={handleChange}>
              <option>Web Development</option>
              <option>Design</option>
              <option>Content Writing</option>
              <option>Digital Marketing</option>
              <option>Data Entry</option>
              <option>Other</option>
            </select>

            <label className="form-label" htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              className="form-input proposal-textarea"
              placeholder="Describe the project, requirements, deliverables..."
              value={formData.description}
              onChange={handleChange}
              required
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <label className="form-label" htmlFor="budget">Budget (₹) *</label>
                <input
                  id="budget"
                  name="budget"
                  className="form-input"
                  type="number"
                  placeholder="15000"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="form-label" htmlFor="deadline">Deadline *</label>
                <input
                  id="deadline"
                  name="deadline"
                  className="form-input"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <label className="form-label" htmlFor="requiredSkills">Required Skills (comma separated)</label>
            <input
              id="requiredSkills"
              name="requiredSkills"
              className="form-input"
              placeholder="React, Node.js, MongoDB"
              value={formData.requiredSkills}
              onChange={handleChange}
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <label className="form-label" htmlFor="location">Location</label>
                <input
                  id="location"
                  name="location"
                  className="form-input"
                  placeholder="Remote"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="form-label" htmlFor="experienceLevel">Experience Level</label>
                <select id="experienceLevel" name="experienceLevel" className="form-input" value={formData.experienceLevel} onChange={handleChange}>
                  <option value="entry">Entry Level</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-red" style={{ marginTop: "0.5rem" }} disabled={loading}>
              {loading ? "Posting..." : "Post Job"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default PostJobPage;

