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
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <h2>Create New Project</h2>
      {message && (
        <p
          style={{ color: message.includes("successfully") ? "green" : "red" }}
        >
          {message}
        </p>
      )}
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="details"
        placeholder="Details"
        value={formData.details}
        onChange={handleChange}
        required
      ></textarea>
      <input
        type="number"
        name="total_target"
        placeholder="Total Target"
        value={formData.total_target}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="start_date"
        value={formData.start_date}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="end_date"
        value={formData.end_date}
        onChange={handleChange}
        required
      />
      <select
        name="category"
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
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (comma separated)"
      />
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
      />
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        {images.map((img, i) => (
          <img
            key={i}
            src={URL.createObjectURL(img)}
            alt={`preview-${i}`}
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
          />
        ))}
      </div>
      <button type="submit">Create</button>
    </form>
  );
};

export default CreateProject;
