import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/config";

function getLoggedInUserId() {
  const token = localStorage.getItem("access_token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.user_id || payload.id || null;
  } catch {
    return null;
  }
}

// Comment component
const Comment = ({ comment, refreshProject }) => {
  const [replyContent, setReplyContent] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    try {
      await axiosInstance.post(
        `http://localhost:8000/api/comments/${comment.id}/reply/`,
        { content: replyContent }
      );
      setReplyContent("");
      setShowReplyForm(false);
      refreshProject(); // to reload comments and replies from server
    } catch (err) {
      alert("Error adding reply: token expired");
      console.error(err);
    }
  };

  return (
    <div style={{ marginBottom: "15px" }}>
      <p>
        <Link to={`/user/${comment.user.id}`}>
          <strong>{comment.user.username}</strong>
        </Link>
        : {comment.content}
      </p>
      <small>Posted on: {new Date(comment.created_at).toLocaleString()}</small>

      {comment.replies && comment.replies.length > 0 && (
        <div style={{ marginLeft: "20px", marginTop: "10px" }}>
          <h4>Replies</h4>
          {comment.replies.map((reply) => (
            <Reply key={reply.id} reply={reply} />
          ))}
        </div>
      )}

      <button
        onClick={() => setShowReplyForm((prev) => !prev)}
        style={{ marginTop: "10px" }}
      >
        {showReplyForm ? "Cancel" : "Reply"}
      </button>

      {showReplyForm && (
        <form onSubmit={handleReplySubmit} style={{ marginTop: "10px" }}>
          <textarea
            rows={2}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write your reply..."
            style={{ width: "100%", marginBottom: "5px" }}
          />
          <button type="submit">Post Reply</button>
        </form>
      )}
    </div>
  );
};

// Reply component

const Reply = ({ reply }) => {
  return (
    <div>
      <p>
        <Link to={`/user/${reply.user.id}`}>
          <strong>{reply.user.username}</strong>
        </Link>
        : {reply.content}
      </p>
      <small>Replied on: {new Date(reply.created_at).toLocaleString()}</small>
    </div>
  );
};

// Main ProjectDetails Component

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState(null);
  const [userRatingLoaded, setUserRatingLoaded] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [canceling, setCanceling] = useState(false);

  const confirmCancel = async () => {
    setCanceling(true);
    try {
      await axiosInstance.post(
        `http://localhost:8000/api/projects/${id}/cancel/`
      );
      setShowCancelModal(false);
      fetchProject();
    } catch (error) {
      console.error("Cancel error:", error);
      alert("Failed to cancel project.");
    } finally {
      setCanceling(false);
    }
  };

  useEffect(() => {
    setCurrentUserId(getLoggedInUserId());
  }, []);

  // Fetch project details
  const fetchProject = () => {
    fetch(`http://localhost:8000/api/projects/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch project");
        return res.json();
      })
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  // Fetch user rating
  const fetchUserRating = () => {
    axiosInstance
      .get(`http://localhost:8000/api/projects/${id}/my-rating/`)
      .then((res) => {
        setUserRating(res.data.rating);
        setUserRatingLoaded(true);
      })
      .catch((err) => {
        console.error("Error fetching user rating", err);
        setUserRatingLoaded(true); // Ensure flag is set even on failure
      });
  };

  useEffect(() => {
    fetchProject();
    fetchUserRating();
  }, [id]);

  // Handle adding a new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await axiosInstance.post(
        `http://localhost:8000/api/projects/${id}/comment/`,
        { content: newComment }
      );
      setNewComment("");
      fetchProject(); // Refresh comments
    } catch (err) {
      alert("Error adding comment: token expired");
      console.error(err);
    }
  };

  // Handle rating submission
  const handleRate = async () => {
    if (rating < 1 || rating > 5) {
      alert("Please select a rating from 1 to 5");
      return;
    }

    try {
      await axiosInstance.post(
        `http://localhost:8000/api/projects/${id}/rate/`,
        { rating }
      );
      setRating(0); // reset dropdown
      setUserRating(null);
      setUserRatingLoaded(false);

      // delay refetch to let backend update user rating
      setTimeout(() => {
        fetchUserRating();
        fetchProject();
      }, 500);
    } catch (err) {
      alert("Error submitting rating: token expired");
      console.error(err);
    }
  };

  // Loading or error UI
  if (loading) return <p>Loading project...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!project) return <p>No project found</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <p>
        <b>Creator: </b>
        <Link to={`/user/${project.project_creator.id}`}>
          {project.project_creator.username}
        </Link>
      </p>

      <h2>{project.title}</h2>
      <p>{project.details}</p>
      {currentUserId === project.project_creator.id &&
        !project.is_cancelled && (
          <>
            {!canceling ? (
              <button onClick={() => setShowCancelModal(true)}>
                Cancel Project
              </button>
            ) : (
              <button disabled style={{ opacity: 0.6 }}>
                Canceling...
              </button>
            )}

            {showCancelModal && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 999,
                }}
              >
                {project.donation_amount / project.total_target < 0.25 ? (
                  <div
                    style={{
                      background: "white",
                      padding: "20px",
                      borderRadius: "8px",
                      width: "300px",
                    }}
                  >
                    <p>Are you sure you want to cancel this project?</p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "10px",
                      }}
                    >
                      <button
                        onClick={() => setShowCancelModal(false)}
                        disabled={canceling}
                      >
                        No
                      </button>
                      <button
                        onClick={confirmCancel}
                        disabled={canceling}
                        style={{
                          backgroundColor: "red",
                          color: "white",
                          opacity: canceling ? 0.6 : 1,
                        }}
                      >
                        {canceling ? "Canceling..." : "Yes, Cancel"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      background: "white",
                      padding: "20px",
                      borderRadius: "8px",
                      width: "300px",
                    }}
                  >
                    <p>
                      Project can not be canceled. donation amount exceeds 25%
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "10px",
                      }}
                    >
                      <button
                        onClick={() => setShowCancelModal(false)}
                        disabled={canceling}
                      >
                        ok
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

      {project.is_cancelled && <p>PROJECT CANCELLED</p>}

      <div style={{ marginTop: "20px" }}>
        {localStorage.getItem("access_token") ? (
          !userRatingLoaded ? (
            <>
              <p>Loading rating...</p>
            </>
          ) : userRating !== null && userRating !== undefined ? (
            <p>You rated this project: {userRating} ⭐</p>
          ) : (
            <>
              <select
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
              >
                <option value={0}>Select rating</option>
                <option value={1}>⭐</option>
                <option value={2}>⭐⭐</option>
                <option value={3}>⭐⭐⭐</option>
                <option value={4}>⭐⭐⭐⭐</option>
                <option value={5}>⭐⭐⭐⭐⭐</option>
              </select>
              <button onClick={handleRate} style={{ marginLeft: "10px" }}>
                Submit Rating
              </button>
            </>
          )
        ) : null}
      </div>

      <p>
        <b>Total Target:</b> {project.total_target}
      </p>

      <p>
        <b>Donated:</b> {project.donation_amount}
      </p>
      <p>
        <b>Category:</b> {project.category_detail.name}
      </p>
      <p>
        <b>Tags:</b>{" "}
        {JSON.parse(project.tags_detail.map((tag) => tag.name).join(", "))
          .map((tag) => tag.name)
          .join(" - ")}
      </p>
      <p>
        <b>Start Date:</b> {project.start_date}
      </p>
      <p>
        <b>End Date:</b> {project.end_date}
      </p>
      <p>
        <b>Average Rating:</b> {project.average_rating}
      </p>

      <div>
        <h3>Images</h3>
        {project.images.map((img) => (
          <img
            key={img.id}
            src={`http://localhost:8000/${img.image}`}
            alt={`Project img ${img.id}`}
            style={{ width: "100px", marginRight: "10px" }}
          />
        ))}
      </div>

      <div style={{ marginTop: "30px" }}>
        <h3>Comments</h3>
        {project.comments.length === 0 && <p>No comments yet</p>}
        {project.comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            refreshProject={fetchProject}
          />
        ))}
      </div>

      <div>
        <h4>Add a Comment</h4>
        <form onSubmit={handleAddComment}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment..."
            rows={3}
            style={{ width: "100%", marginBottom: "10px" }}
          />
          <button type="submit">Post Comment</button>
        </form>
      </div>
    </div>
  );
}
