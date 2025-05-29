import React, { useState } from "react";

const CreateProject = () => {
  const [formData, setFormData] = useState({
    title: "",
    details: "",
    total_target: "",
    start_date: "",
    end_date: "",
    category: "",
    tags: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      total_target: parseFloat(formData.total_target),
      category: { name: formData.category },
      tags: formData.tags.split(",").map((tag) => ({ name: tag.trim() })),
      images: [],
    };

    try {
      const res = await fetch("http://localhost:8000/api/projects/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setMessage("✅ Project created successfully!");
        setFormData({
          title: "",
          details: "",
          total_target: "",
          start_date: "",
          end_date: "",
          category: "",
          tags: "",
        });
      } else {
        const error = await res.json();
        setMessage("❌ Error: " + JSON.stringify(error));
      }
    } catch (error) {
      setMessage("❌ Network error: " + error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create New Project</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Details</label>
          <textarea
            name="details"
            className="form-control"
            value={formData.details}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Total Target (EGP)</label>
          <input
            type="number"
            name="total_target"
            className="form-control"
            value={formData.total_target}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Start Date</label>
          <input
            type="date"
            name="start_date"
            className="form-control"
            value={formData.start_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">End Date</label>
          <input
            type="date"
            name="end_date"
            className="form-control"
            value={formData.end_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Category Name</label>
          <input
            type="text"
            name="category"
            className="form-control"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Tags (comma-separated)</label>
          <input
            type="text"
            name="tags"
            className="form-control"
            value={formData.tags}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Create Project
        </button>
      </form>
    </div>
  );
};

export default CreateProject;
