import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/config";
import "./UserProfile.css";

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
      console.log("Projects:", res.data);
      setProjects(res.data);
    });

    axiosInstance.get(`my-donations/`).then((res) => {
      setDonations(res.data);
    });
  }, [id]);

  const handleEdit = () => {
    axiosInstance.put(`/customuser/${id}/`, formData).then((res) => {
      setUser(res.data);
      setEditMode(false);
    });
  };

  const handleDelete = () => {
    axiosInstance
      .delete(`/customuser/${id}/`, {
        data: { password: deletePassword },
      })
      .then(() => {
        alert("Account deleted");
      });
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <h2>User Profile</h2>

      <div className="tabs">
        <button onClick={() => setActiveTab("profile")}>Profile</button>
        <button onClick={() => setActiveTab("projects")}>Projects</button>
        <button onClick={() => setActiveTab("donations")}>Donations</button>
      </div>

      {activeTab === "profile" && (
        <div className="tab-content">
          {editMode ? (
            <>
              <input
                value={formData.username || ""}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="Username"
              />
              <input
                value={formData.phone || ""}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Phone"
              />
              <input
                value={formData.birthdate || ""}
                onChange={(e) =>
                  setFormData({ ...formData, birthdate: e.target.value })
                }
                type="date"
              />
              <input
                value={formData.facebook_profile || ""}
                onChange={(e) =>
                  setFormData({ ...formData, facebook_profile: e.target.value })
                }
                placeholder="Facebook URL"
              />
              <input
                value={formData.country || ""}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                placeholder="Country"
              />
              <button onClick={handleEdit}>Save</button>
              <button onClick={() => setEditMode(false)}>Cancel</button>
            </>
          ) : (
            <>
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
                <b>Birthdate:</b> {user.birthdate || "N/A"}
              </p>
              <p>
                <b>Facebook:</b>{" "}
                <a href={user.facebook_profile}>{user.facebook_profile}</a>
              </p>
              <p>
                <b>Country:</b> {user.country || "N/A"}
              </p>
              <img
                src={user.profile_picture}
                alt="Profile"
                className="rounded-circle mb-3"
                width="150"
              />
              <button onClick={() => setEditMode(true)}>Edit Profile</button>
            </>
          )}

          <hr />
          <h3>Delete Account</h3>
          <input
            type="password"
            placeholder="Enter password to confirm"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
          />
          <button onClick={() => setShowDeleteConfirm(true)}>
            Delete Account
          </button>

          {showDeleteConfirm && (
            <div className="modal">
              <p>Are you sure you want to delete your account?</p>
              <button onClick={handleDelete}>Yes, delete</button>
              <button onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "projects" && (
        <div className="tab-content">
          <h3>Projects</h3>
          {Array.isArray(projects) && projects.length > 0 ? (
            projects.map((proj) => <div key={proj.id}>{proj.title}</div>)
          ) : (
            <p>No projects found.</p>
          )}
        </div>
      )}

      {activeTab === "donations" && (
        <div className="tab-content">
          <h3>Donations</h3>
          {Array.isArray(donations) && donations.length > 0 ? (
            donations.map((donation) => (
              <div key={donation.id}>
                ${donation.amount} to project {donation.project_title}
              </div>
            ))
          ) : (
            <p>No donations found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default UserProfile;
