import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/config";

function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("User ID not provided");
      setLoading(false);
      return;
    }

    axiosInstance
      .get(`/customuser/${id}/`)
      .then((res) => {
        setUser(res.data);
        setLoading(false);
        console.log(res.data);
      })
      .catch((err) => {
        setError(err.response?.data || "Error fetching user");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {JSON.stringify(error)}</div>;

  return (
    <div>
      <h1>User Profile</h1>
      {user && (
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
            <b>Profile Picture:</b>
            <br />
            <img src={`${user.profile_picture}`} alt="Profile" width="150" />
          </p>
        </>
      )}
    </div>
  );
}

export default UserProfile;
