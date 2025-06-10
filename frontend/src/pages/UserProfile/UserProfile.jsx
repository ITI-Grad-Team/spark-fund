import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/config";

function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [donations, setDonations] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    axiosInstance.get(`/customuser/${id}/`).then((res) => {
      setUser(res.data);
      setFormData(res.data);
    });

    axiosInstance.get(`/projects/?project_creator=${id}`).then((res) => {
      setProjects(res.data);
    });

    axiosInstance.get(`my-donations/`).then((res) => {
      setDonations(res.data);
    });
  }, [id]);

  const handleEdit = () => {
    const updatedForm = new FormData();

    for (let key in formData) {
      if (formData[key] !== null && formData[key] !== undefined) {
        updatedForm.append(key, formData[key]);
      }
    }

    axiosInstance
      .patch(`/update-user/${id}/`, updatedForm, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setUser(res.data);
        setEditMode(false);
      });
  };

  const handleDelete = () => {
    axiosInstance
      .delete(`/update-user/${id}/`, {
        data: { password: deletePassword },
      })
      .then(() => {
        alert("Account deleted");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
      });
  };

  if (!user) return <div className="text-center my-5">Loading...</div>;

  return (
    <div className="container my-5">
      <h2 className="mb-4">User Profile</h2>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "projects" ? "active" : ""}`}
            onClick={() => setActiveTab("projects")}
          >
            Projects
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "donations" ? "active" : ""}`}
            onClick={() => setActiveTab("donations")}
          >
            Donations
          </button>
        </li>
      </ul>

      {/* Profile */}
      {activeTab === "profile" && (
        <div className="card p-4">
          {editMode ? (
            <>
              <div className="mb-3 text-center">
                <label htmlFor="profileImage" style={{ cursor: "pointer" }}>
                <img
                  src={
                    formData.profile_picture instanceof File
                      ? URL.createObjectURL(formData.profile_picture)
                      : user?.profile_picture || "/profile-blank.png"
                  }
                  alt="Profile Preview"
                  className="rounded-circle mb-2"
                  width="150"
                />
                </label>
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  className="form-control mt-2"
                  style={{ display: "none" }}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      profile_picture: e.target.files[0],
                    })
                  }
                />
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <input
                    className="form-control"
                    value={formData.username || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    placeholder="Username"
                  />
                </div>
                <div className="col-md-6">
                  <input
                    className="form-control"
                    value={formData.phone || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="Phone"
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <input
                    className="form-control"
                    type="date"
                    value={formData.birth_date || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        birth_date: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <input
                    className="form-control"
                    value={formData.facebook_profile || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        facebook_profile: e.target.value,
                      })
                    }
                    placeholder="Facebook URL"
                  />
                </div>
              </div>
              <div className="mb-3">
                <input
                  className="form-control"
                  value={formData.country || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  placeholder="Country"
                />
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-primary" onClick={handleEdit}>
                  Save
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="row mb-3">
                <div className="col-md-8">
                  <p>
                    <b>Username:</b> {user.username}
                  </p>
                  <p>
                    <b>Email:</b> {user.email}
                  </p>
                  <p>
                    <b>Phone:</b> {user.phone}
                  </p>
                  <p>
                    <b>Birthdate:</b> {user.birth_date || " "}
                  </p>
                  <p>
                    <b>Facebook:</b>{" "}
                    <a href={user.facebook_profile}>
                      {user.facebook_profile || " "}
                    </a>
                  </p>
                  <p>
                    <b>Country:</b> {user.country || " "}
                  </p>
                </div>
                <div className="col-md-4 text-center">
                  <img
                    src={
                      user?.profile_picture
                        ? user.profile_picture
                        : "/profile-blank.png"
                    }
                    alt="Profile"
                    className="rounded-circle"
                    width="150"
                  />
                </div>
              </div>
              <button
                className="btn btn-outline-primary mb-3"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
            </>
          )}

          <hr />
          <h5>Delete Account</h5>
          <input
            type="password"
            className="form-control mb-2"
            placeholder="Enter password to confirm"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
          />
          <button
            className="btn btn-danger"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete Account
          </button>

          {showDeleteConfirm && (
            <div className="alert alert-warning mt-3">
              <p>Are you sure you want to delete your account?</p>
              <button className="btn btn-danger me-2" onClick={handleDelete}>
                Yes, delete
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {/* Projects */}
      {activeTab === "projects" && (
        <div className="row">
          {projects.length > 0 ? (
            projects.map((proj) => (
              <div className="col-md-4 mb-3" key={proj.id}>
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{proj.title}</h5>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No projects found.</p>
          )}
        </div>
      )}

      {/* Donations */}
      {activeTab === "donations" && (
        <div className="card p-3">
          <h5 className="mb-3">Your Donations</h5>
          {donations.length > 0 ? (
            <>
              <ul className="list-group mb-3">
                {donations.map((donation) => (
                  <li key={donation.id} className="list-group-item">
                    ${donation.amount} to project{" "}
                    <strong>{donation.project_title}</strong>
                  </li>
                ))}
              </ul>
              <p>
                <strong>Total:</strong> $
                {donations.reduce(
                  (acc, curr) => acc + parseFloat(curr.amount),
                  0
                )}
              </p>
            </>
          ) : (
            <p>No donations found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default UserProfile;
