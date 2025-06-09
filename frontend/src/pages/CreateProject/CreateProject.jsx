import React, { useState, useEffect } from "react";

const CreateProject = () => {
  const [formData, setFormData] = useState({
    title: "",
    details: "",
    total_target: "",
    start_date: "",
    end_date: "",
    category: "",
  });

  const [images, setImages] = useState([]);
  const [tags, setTags] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (!storedToken) {
      setMessage("Please log in to create a project");
      setTimeout(() => (window.location.href = "/login"), 2000);
    } else {
      setToken(storedToken);
    }

    fetch("http://localhost:8000/api/categories/")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setMessage("Failed to load categories");
      });
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    setImages((prevImages) => [...prevImages, ...Array.from(e.target.files)]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category) {
      setMessage("Please select a category");
      return;
    }

    if (!tags.trim()) {
      setMessage("Please enter at least one tag");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("details", formData.details);
    data.append("total_target", formData.total_target);
    data.append("start_date", formData.start_date);
    data.append("end_date", formData.end_date);
    data.append("category", formData.category);
    const tagsData = JSON.stringify(
      tags.split(",").map((tag) => ({ name: tag.trim() }))
    );
    data.append("tags", tagsData);
    images.forEach((file) => {
      data.append("images", file);
    });

    // Debug: Log FormData contents
    console.log("FormData contents:");
    for (let [key, value] of data.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      const res = await fetch("http://localhost:8000/api/projects/create/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await res.json();
      if (res.ok) {
        setMessage("Project created successfully!");
        console.log("Success response:", result);
        setFormData({
          title: "",
          details: "",
          total_target: "",
          start_date: "",
          end_date: "",
          category: "",
        });
        setTags("");
        setImages([]);
      } else {
        setMessage("Error creating project: " + JSON.stringify(result));
        console.error("Error response:", result);
      }
    } catch (err) {
      console.error("Network error:", err);
      setMessage("Network error: " + err.message);
    }
  };

  return (
    <section className="min-vh-100 d-flex justify-content-center align-items-center gradient-custom-3">
  <div className="container">
    <div className="card shadow" style={{ borderRadius: 20 }}>
      <div className="row g-0">
        {/* <div className="col-md-5 d-none d-md-block">
          <img
            src="/Frame4.svg"
            alt="project image"
            className="img-fluid h-100"
            style={{ borderTopLeftRadius: 20, borderBottomLeftRadius: 20, objectFit: "cover" }}
          />
        </div> */}

        <div className="col-md-12">
          <div className="card-body p-5">
            <h2 className="text-center mb-4">Start a Campaign</h2>

            {message && (
              <div
                className={`alert text-center alert-${message.includes("successfully") ? "success" : "danger"}`}
                role="alert"
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} encType="multipart/form-data" >
              <div className="form-floating mb-3">
                <input
                  type="text"
                  name="title"
                  id="title"
                  className="form-control"
                  placeholder="Title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="title">Title</label>
              </div>

              <div className="form-floating mb-3">
                <textarea
                  name="details"
                  id="details"
                  className="form-control"
                  placeholder="Details"
                  style={{ height: "120px" }}
                  value={formData.details}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="details">Details</label>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="number"
                  name="total_target"
                  id="total_target"
                  className="form-control"
                  placeholder="Total Target"
                  value={formData.total_target}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="total_target">Total Target</label>
              </div>

              <div className="row mb-3">
                <div className="col">
                  <div className="form-floating">
                    <input
                      type="date"
                      name="start_date"
                      id="start_date"
                      className="form-control"
                      value={formData.start_date}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="start_date">Start Date</label>
                  </div>
                </div>
                <div className="col">
                  <div className="form-floating">
                    <input
                      type="date"
                      name="end_date"
                      id="end_date"
                      className="form-control"
                      value={formData.end_date}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="end_date">End Date</label>
                  </div>
                </div>
              </div>

              <div className="form-floating mb-3">
                <select
                  name="category"
                  id="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select a Category --</option>
                  {Array.isArray(categories) &&
                    categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
                <label htmlFor="category">Category</label>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="text"
                  id="tags"
                  className="form-control"
                  placeholder="Tags (comma separated)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
                <label htmlFor="tags">Tags (comma separated)</label>
              </div>

              <div className="mb-3">
                <label htmlFor="images" className="form-label">
                  Upload Images
                </label>
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  className="form-control"
                  onChange={handleFileChange}
                />
              </div>

              {images.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {images.map((img, i) => (
                    <img
                      key={i}
                      src={URL.createObjectURL(img)}
                      alt={`preview-${i}`}
                      className="rounded"
                      style={{ width: "100px", height: "100px", objectFit: "cover", border: "1px solid #ccc" }}
                    />
                  ))}
                </div>
              )}

              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-primary w-100 py-2">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

  );
};

export default CreateProject;
