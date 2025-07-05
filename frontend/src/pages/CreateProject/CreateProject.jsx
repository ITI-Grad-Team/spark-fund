import "./CreateProject.css";
import { useState, useEffect } from "react";

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

    fetch("https://OthmanAhmedDora.pythonanywhere.com/api/categories/")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.results);
      })
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
    const tagNames = tags.split(",").map((tag) => tag.trim());

    data.append("tags", tagNames.join(","));
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
    <section className="container-fluid background-color">
      <section className="container pt-5 create-project">
        <div className="card shadow my-create-campaign-style">
          <div className="column-1">
            <img src="/Frame6.svg" alt="create project page image" />
          </div>

          <div className="card-body column-2">
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <h2>Create New Project</h2>
              {message && (
                <p
                  style={{
                    color: message.includes("successfully") ? "green" : "red",
                  }}
                >
                  {message}
                </p>
              )}
              <div className="form-input">
                <div className="form-floating">
                  <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    className="form-control"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="title">Title</label>
                </div>

                <div className="form-floating">
                  <textarea
                    name="details"
                    placeholder="Details"
                    className="form-control"
                    value={formData.details}
                    onChange={handleChange}
                    required
                  ></textarea>
                  <label htmlFor="details">Details</label>
                </div>

                <div className="form-floating">
                  <input
                    type="number"
                    name="total_target"
                    placeholder="Total Target"
                    className="form-control"
                    value={formData.total_target}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="total_target">Total Target</label>
                </div>

                <div className="date-inputs">
                  <div className="form-floating start-date">
                    <input
                      type="date"
                      name="start_date"
                      className="form-control"
                      value={formData.start_date}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="start_date">Start Date</label>
                  </div>

                  <div className="form-floating end-date">
                    <input
                      type="date"
                      name="end_date"
                      className="form-control"
                      value={formData.end_date}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="end_date">End Date</label>
                  </div>

                  <div className="form-floating category">
                    <select
                      name="category"
                      className="form-select"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a Category</option>
                      {Array.isArray(categories) &&
                        categories.map((cat) => (
                          <option key={cat.name} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                    </select>
                    <label htmlFor="category">Category</label>
                  </div>
                </div>

                <div className="form-floating">
                  <input
                    type="text"
                    value={tags}
                    className="form-control"
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Tags (comma separated)"
                  />
                  <label>Tags (comma separated)</label>
                </div>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <div
                  style={{ display: "flex", gap: "10px", marginTop: "10px" }}
                >
                  {images.map((img, i) => (
                    <img
                      key={i}
                      src={URL.createObjectURL(img)}
                      alt={`preview-${i}`}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  ))}
                </div>
                <button className="btn btn-primary w-100 mb-3" type="submit">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </section>
  );
};

export default CreateProject;
