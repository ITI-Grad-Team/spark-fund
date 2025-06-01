// import React, { useState } from "react";

// const CreateProject = () => {
//   const [formData, setFormData] = useState({
//     title: "",
//     details: "",
//     total_target: "",
//     start_date: "",
//     end_date: "",
//     category: "",
//     tags: "",
//   });

//   const [message, setMessage] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const payload = {
//       ...formData,
//       total_target: parseFloat(formData.total_target),
//       category: { name: formData.category },
//       tags: formData.tags.split(",").map((tag) => ({ name: tag.trim() })),
//       images: [],
//     };

//     try {
//       const res = await fetch("http://localhost:8000/api/projects/create/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       if (res.ok) {
//         const data = await res.json();
//         setMessage("✅ Project created successfully!");
//         setFormData({
//           title: "",
//           details: "",
//           total_target: "",
//           start_date: "",
//           end_date: "",
//           category: "",
//           tags: "",
//         });
//       } else {
//         const error = await res.json();
//         setMessage("❌ Error: " + JSON.stringify(error));
//       }
//     } catch (error) {
//       setMessage("❌ Network error: " + error.message);
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h2>Create New Project</h2>
//       {message && <div className="alert alert-info">{message}</div>}
//       <form onSubmit={handleSubmit}>
//         <div className="mb-3">
//           <label className="form-label">Title</label>
//           <input
//             type="text"
//             name="title"
//             className="form-control"
//             value={formData.title}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Details</label>
//           <textarea
//             name="details"
//             className="form-control"
//             value={formData.details}
//             onChange={handleChange}
//             required
//           ></textarea>
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Total Target (EGP)</label>
//           <input
//             type="number"
//             name="total_target"
//             className="form-control"
//             value={formData.total_target}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Start Date</label>
//           <input
//             type="date"
//             name="start_date"
//             className="form-control"
//             value={formData.start_date}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="mb-3">
//           <label className="form-label">End Date</label>
//           <input
//             type="date"
//             name="end_date"
//             className="form-control"
//             value={formData.end_date}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Category Name</label>
//           <input
//             type="text"
//             name="category"
//             className="form-control"
//             value={formData.category}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Tags (comma-separated)</label>
//           <input
//             type="text"
//             name="tags"
//             className="form-control"
//             value={formData.tags}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <button type="submit" className="btn btn-primary">
//           Create Project
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CreateProject;

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
  const [token, setToken] = useState(""); // JWT token
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) setToken(storedToken);

    // ✅ Fetch categories from backend
    fetch("http://localhost:8000/api/categories/")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
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

    const data = new FormData();
    data.append("title", formData.title);
    data.append("details", formData.details);
    data.append("total_target", formData.total_target);
    data.append("start_date", formData.start_date);
    data.append("end_date", formData.end_date);

    // Append category as object
// في handleSubmit
    data.append("category", formData.category);

    // Append tags as objects
  data.append("tags", JSON.stringify(
    tags.split(",").map((tag) => ({ name: tag.trim() }))
  ));

    // Append images
    images.forEach((file) => {
      data.append("images", file);
    });

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
    console.log(result);

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
    setMessage("Error creating project");
    console.error(result);
  }
} catch (err) {
  console.error("Network error:", err);
  alert("Network error");
}


  };

  
  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <h2>Create New Project</h2>
      {message && (
        <p style={{ color: message.includes("successfully") ? "green" : "red" }}>
          {message}
        </p>
      )}
      <input type="text" name="title" placeholder="Title" onChange={handleChange} required />
      <textarea name="details" placeholder="Details" onChange={handleChange} required></textarea>
      <input type="number" name="total_target" placeholder="Total Target" onChange={handleChange} required />
      <input type="date" name="start_date" onChange={handleChange} required />
      <input type="date" name="end_date" onChange={handleChange} required />
      <select name="category" value={formData.category} onChange={handleChange} required>
        <option value="">-- Select a Category --</option>
        {Array.isArray(categories) && categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>



            <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (comma separated)"
      />

      <input type="file" multiple accept="image/*" onChange={handleFileChange} />
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
    {images.map((img, i) => (
      <img
        key={i}
        src={URL.createObjectURL(img)}
        alt={`preview-${i}`}
        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
      />
    ))}
  </div>

      <button type="submit">Create</button>
    </form>
  );
};

export default CreateProject;
