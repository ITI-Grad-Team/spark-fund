import React, { useEffect, useState, useCallback } from "react";
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

  const [showCommentReportForm, setShowCommentReportForm] = useState(false);
  const [commentReportReason, setCommentReportReason] = useState("");

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
      if (refreshProject) refreshProject();
    } catch (err) {
      console.error("Error adding reply:", err.response?.data || err.message);
    }
  };

  const handleCommentReportSubmit = async (e) => {
    e.preventDefault();
    if (!commentReportReason.trim()) {
      console.warn("Report reason cannot be empty.");
      return;
    }
    try {
      await axiosInstance.post(
        `http://localhost:8000/api/comments/${comment.id}/report/`,
        { reason: commentReportReason }
      );
      setCommentReportReason("");
      setShowCommentReportForm(false);
      console.info(`Comment ${comment.id} reported successfully!`);

    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.detail) {
        console.warn("Report comment failed:", err.response.data.detail); 
      } else {
        console.error("Error reporting comment:", err.response?.data || err.message);
      }
    }
  };


  if (!comment || !comment.user) {
    return <div style={{ color: "red", margin: "10px 0" }}>Comment data is incomplete.</div>;
  }

  return (
    <div style={{ marginBottom: "15px", padding: "10px", border: "1px solid #eee", borderRadius: "5px", background: "#f9f9f9" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "5px" }}>
        <p style={{ margin: 0, wordBreak: "break-word", flexGrow: 1 }}>
          <Link to={`/user/${comment.user.id}`}>
            <strong>{comment.user.username || "Anonymous"}</strong>
          </Link>
          : {comment.content}
        </p>
        <button
          onClick={() => setShowCommentReportForm(prev => !prev)}
          style={{
            marginLeft: "10px",
            padding: "3px 8px",
            fontSize: "0.8em",
            backgroundColor: showCommentReportForm ? "#f0f0f0" : "#fff0f0",
            color: "#c00",
            border: "1px solid #fdd",
            borderRadius: "3px",
            cursor: "pointer",
            whiteSpace: "nowrap"
          }}
        >
          {showCommentReportForm ? "Cancel Report" : "Report"}
        </button>
      </div>
      <small style={{ color: "#666" }}>Posted on: {new Date(comment.created_at).toLocaleString()}</small>

      {showCommentReportForm && (
        <form onSubmit={handleCommentReportSubmit} style={{ marginTop: "10px", padding:"10px", backgroundColor: "#fff8f8", border: "1px solid #fee", borderRadius: "4px" }}>
          <textarea
            rows={2}
            value={commentReportReason}
            onChange={(e) => setCommentReportReason(e.target.value)}
            placeholder="Reason for reporting this comment..."
            style={{ width: "calc(100% - 12px)", marginBottom: "5px", padding: "5px", border: "1px solid #ccc", borderRadius: "3px" }}
            required
          />
          <div style={{display: "flex", gap: "5px", marginTop: "5px" }}>
            <button type="submit" style={{ padding: "5px 10px", backgroundColor: "#d9534f", color: "white", border: "none", borderRadius: "3px", cursor: "pointer" }}>
              Submit Report
            </button>
            <button type="button" onClick={() => setShowCommentReportForm(false)} style={{ padding: "5px 10px", border: "1px solid #ccc", borderRadius: "3px", cursor: "pointer", backgroundColor: "#f0f0f0" }}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div style={{ marginLeft: "20px", marginTop: "10px", paddingTop: "10px", borderTop: "1px dashed #eee" }}>
          <h4 style={{ margin: "0 0 5px 0", fontSize: "0.9em", color: "#333" }}>Replies:</h4>
          {comment.replies.map((reply) => (
            <Reply key={reply.id} reply={reply} />
          ))}
        </div>
      )}

      <button
        onClick={() => setShowReplyForm((prev) => !prev)}
        style={{ marginTop: "10px", padding: "5px 10px", backgroundColor: "#e9e9e9", border: "1px solid #ccc", borderRadius: "3px", cursor: "pointer" }}
      >
        {showReplyForm ? "Cancel Reply" : "Reply"}
      </button>

      {showReplyForm && (
        <form onSubmit={handleReplySubmit} style={{ marginTop: "10px" }}>
          <textarea
            rows={2}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write your reply..."
            style={{ width: "calc(100% - 12px)", marginBottom: "5px", padding: "5px", border: "1px solid #ccc", borderRadius: "3px" }}
          />
          <button type="submit" style={{ padding: "5px 10px", backgroundColor: "#5cb85c", color: "white", border: "none", borderRadius: "3px", cursor: "pointer" }}>Post Reply</button>
        </form>
      )}
    </div>
  );
};

// Reply component

const Reply = ({ reply }) => {

  if (!reply || !reply.user) {
    return <div style={{ color: "red", margin: "5px 0", fontSize: "0.9em" }}>Reply data is incomplete.</div>;
  }
  return (
    <div style={{ fontSize: "0.9em", marginBottom: "8px", paddingLeft: "10px", borderLeft: "2px solid #e0e0e0", backgroundColor: "#fafafa", padding: "5px" }}>
      <p style={{ margin: 0 }}>
        <Link to={`/user/${reply.user.id}`}>
          <strong>{reply.user.username || "Anonymous"}</strong>
        </Link>
        : {reply.content}
      </p>
      <small style={{ color: "#777" }}>Replied on: {new Date(reply.created_at).toLocaleString()}</small>
    </div>
  );
};

// Main ProjectDetails Component

export default function ProjectDetails() {
  const { id: projectId } = useParams(); 
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
  const [donationAmount, setDonationAmount] = useState("");
  const [userDonation, setUserDonation] = useState(0);

  const fetchUserDonation = async () => {
    try {
      const response = await axiosInstance.get(
        `http://localhost:8000/api/projects/${projectId}/donation-amount/`
      );
      setUserDonation(response.data.donation_amount);
    } catch (error) {
      console.error("Error fetching user donation:", error);
    }
  };

  const confirmCancel = async () => {
    setCanceling(true);
    try {
      await axiosInstance.post(
        `http://localhost:8000/api/projects/${projectId}/cancel/`
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

  const handleDonate = async () => {
    const amount = parseFloat(donationAmount);
    if (!amount || amount <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }

    try {
      await axiosInstance.post(
        `http://localhost:8000/api/projects/${projectId}/donate/`,
        {
          amount,
        }
      );

      setDonationAmount("");
      fetchProject(); // to update donation total
      fetchUserDonation();
    } catch (err) {
      console.error("Donation error:", err);
      alert("Error while donating. Make sure you're logged in.");
    }
  };

  // Fetch project details
  const [showProjectReportForm, setShowProjectReportForm] = useState(false);
  const [projectReportReason, setProjectReportReason] = useState("");

  const fetchProject = useCallback(() => {
    if (!projectId) {
        setLoading(false);
        setError("Project ID is missing from URL.");
        console.error("Project ID is missing. Cannot fetch project.");
        return;
    }
    setLoading(true);
    fetch(`http://localhost:8000/api/projects/${projectId}/`) 
      .then((res) => {
        if (!res.ok) {
          return res.json().then(errData => { // Note: res.json() can also fail if body is not JSON
            throw new Error(errData.detail || `Failed to fetch project (status: ${res.status})`);
          }).catch((jsonParseError) => { 
            console.error("Error parsing error response:", jsonParseError);
            throw new Error(`Failed to fetch project (status: ${res.status}, non-JSON error response)`);
          });
        }
        return res.json();
      })
      .then((data) => {
        setProject(data);
        setError(null); 
      })
      .catch((err) => {
        console.error("Fetch project error:", err);
        setError(err.message);
        setProject(null); 
      })
      .finally(() => {
        setLoading(false);
      });
  }, [projectId]); 

  // Fetch user rating
  const fetchUserRating = () => {
    axiosInstance
      .get(`http://localhost:8000/api/projects/${projectId}/my-rating/`)
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
    fetchUserDonation();
  }, [projectId,fetchProject]); 

  // Handle adding a new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !projectId) {
        console.warn("Comment is empty or project ID is missing.");
        return;
    }
    try {
      await axiosInstance.post(
        `http://localhost:8000/api/projects/${projectId}/comment/`,
        { content: newComment }
      );
      setNewComment("");
      fetchProject(); // Refresh comments
    } catch (err) {
       console.error("Error adding comment:", err.response?.data || err.message);
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
        `http://localhost:8000/api/projects/${projectId}/rate/`,
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
      console.error("Error submitting rating: token expired:", err.response?.data || err.message);
    }
  };

  const handleProjectReportSubmit = async (e) => {
    e.preventDefault();
    if (!projectReportReason.trim() || !projectId) {
        console.warn("Report reason is empty or project ID is missing.");
        return;
    }
    try {
      await axiosInstance.post(
        `http://localhost:8000/api/projects/${projectId}/report/`,
        { reason: projectReportReason }
      );
      setProjectReportReason("");
      setShowProjectReportForm(false);
      console.info(`Project ${projectId} reported successfully!`);
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.detail) {
        console.warn("Report project failed:", err.response.data.detail); 
      } else {
        console.error("Error reporting project:", err.response?.data || err.message);
      }
    }
  };

  // Loading or error UI
  if (loading) return <p style={{ textAlign: "center", padding: "20px", fontSize: "1.2em" }}>Loading project...</p>;
  if (error) return <p style={{ textAlign: "center", padding: "20px", color: "red", fontWeight: "bold" }}>Error: {error}</p>;
  if (!project) return <p style={{ textAlign: "center", padding: "20px" }}>No project found or project data is invalid.</p>;

  const projectCreator = project.project_creator;
  const categoryDetail = project.category_detail;
  const tagsDetail = Array.isArray(project.tags_detail) ? project.tags_detail : [];
  const images = Array.isArray(project.images) ? project.images : [];
  const comments = Array.isArray(project.comments) ? project.comments : [];

  return (
   <div
  style={{
    maxWidth: "700px",
    margin: "20px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    backgroundColor: "#fff",
  }}
>
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid #eee",
      paddingBottom: "15px",
      marginBottom: "20px",
    }}
  >
    <h2 style={{ margin: 0, color: "#333" }}>
      {project.title || "Untitled Project"}
    </h2>

    <div style={{ display: "flex", gap: "10px" }}>
      {currentUserId === project.project_creator.id && !project.is_cancelled && (
        !canceling ? (
          <button
            onClick={() => setShowCancelModal(true)}
            style={{
              backgroundColor: "#ffe0e0",
              color: "#c62828",
              border: "1px solid #f44336",
              borderRadius: "4px",
              padding: "6px 10px",
              cursor: "pointer",
            }}
          >
            Cancel Project
          </button>
        ) : (
          <button
            disabled
            style={{
              backgroundColor: "#eee",
              color: "#999",
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "6px 10px",
              cursor: "not-allowed",
            }}
          >
            Canceling...
          </button>
        )
      )}

      <button
        onClick={() => setShowProjectReportForm((prev) => !prev)}
        style={{
          padding: "6px 10px",
          backgroundColor: showProjectReportForm ? "#e0e0e0" : "#ffebee",
          color: "#c62828",
          border: "1px solid #f44336",
          borderRadius: "4px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "0.9em",
        }}
      >
        {showProjectReportForm ? "Cancel Report" : "Report Project"}
      </button>
    </div>
  </div>

  {showProjectReportForm && (
    <form
      onSubmit={handleProjectReportSubmit}
      style={{
        marginBottom: "20px",
        padding: "15px",
        background: "#fff5f5",
        border: "1px solid #fcc",
        borderRadius: "5px",
      }}
    >
      <h4 style={{ marginTop: 0, marginBottom: "10px", color: "#c62828" }}>
        Report This Project
      </h4>
      <textarea
        rows={3}
        value={projectReportReason}
        onChange={(e) => setProjectReportReason(e.target.value)}
        placeholder="Reason for reporting this project..."
        style={{
          width: "100%",
          marginBottom: "10px",
          padding: "10px",
          border: "1px solid #fcc",
          borderRadius: "3px",
        }}
        required
      />
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          type="submit"
          style={{
            padding: "8px 15px",
            background: "#d9534f",
            color: "white",
            border: "none",
            borderRadius: "3px",
            cursor: "pointer",
          }}
        >
          Submit Report
        </button>
        <button
          type="button"
          onClick={() => setShowProjectReportForm(false)}
          style={{
            padding: "8px 15px",
            border: "1px solid #ccc",
            borderRadius: "3px",
            backgroundColor: "#f0f0f0",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  )}

  <p>
    <b>Creator:</b>{" "}
    <Link to={`/user/${project.project_creator.id}`}>
      {project.project_creator.username || "Unknown"}
    </Link>
  </p>

  <p><b>Details:</b> {project.details}</p>
  <p><b>Total Target:</b> {project.total_target}</p>
  <p><b>Donated:</b> {project.donation_amount}</p>
  <p><b>Your Donation:</b> {userDonation}</p>
  <p><b>Category:</b> {project.category_detail.name}</p>
  <p>
    <b>Tags:</b>{" "}
    {project.tags_detail.length > 0
      ? project.tags_detail.map((tag) => tag.name).join(" - ")
      : "No tags"}
  </p>
  <p><b>Start Date:</b> {project.start_date}</p>
  <p><b>End Date:</b> {project.end_date}</p>
  <p><b>Average Rating:</b> {project.average_rating}</p>

  {project.is_cancelled && (
    <p style={{ color: "red", fontWeight: "bold" }}>PROJECT CANCELLED</p>
  )}

  {/* Rating */}
  {localStorage.getItem("access_token") && (
    <div style={{ marginTop: "20px" }}>
      <h3>Rating</h3>
      {!userRatingLoaded ? (
        <p>Loading rating...</p>
      ) : userRating !== null ? (
        <p>You rated this project: {userRating} ⭐</p>
      ) : (
        <>
          <select
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
          >
            <option value={0}>Select rating</option>
            {[1, 2, 3, 4, 5].map((val) => (
              <option key={val} value={val}>
                {"⭐".repeat(val)}
              </option>
            ))}
          </select>
          <button onClick={handleRate} style={{ marginLeft: "10px" }}>
            Submit Rating
          </button>
        </>
      )}
    </div>
  )}

  {/* Donation */}
  {localStorage.getItem("access_token") && (
    <div style={{ marginTop: "20px" }}>
      <h3>Donate to this project</h3>
      <input
        type="number"
        min="1"
        step="0.01"
        value={donationAmount}
        onChange={(e) => setDonationAmount(e.target.value)}
        placeholder="Enter donation amount"
      />
      <button onClick={handleDonate} style={{ marginLeft: "10px" }}>
        Donate
      </button>
    </div>
  )}

  {/* Images */}
  {project.images.length > 0 && (
    <div style={{ marginTop: "20px" }}>
      <h3 style={{ marginBottom: "10px", color: "#444" }}>Images</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {project.images.map((img) => (
          <img
            key={img.id}
            src={`http://localhost:8000/${img.image}`}
            alt={`Project img ${img.id}`}
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
              border: "1px solid #eee",
              borderRadius: "4px",
            }}
          />
        ))}
      </div>
    </div>
  )}

  {/* Cancel Modal */}
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
          <p>Project cannot be canceled. Donation amount exceeds 25%.</p>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={() => setShowCancelModal(false)}
              disabled={canceling}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  )}

      <div style={{ marginTop: "30px" }}>
        <h3 style={{ borderTop: "1px solid #eee", paddingTop: "20px", marginTop: "20px", color: "#444" }}>Comments</h3>
        {comments.length === 0 && <p>No comments yet. Be the first to comment!</p>}
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            refreshProject={fetchProject}
          />
        ))}
      </div>

      <div style={{ marginTop: "30px", borderTop: "1px solid #eee", paddingTop: "20px" }}>
        <h4 style={{color: "#444"}}>Add a Comment</h4>
        <form onSubmit={handleAddComment}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment..."
            rows={3}
            style={{ width: "calc(100% - 22px)", padding: "10px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "3px" }}
            required
          />
          <button type="submit" style={{ padding: "10px 15px", backgroundColor: "#5cb85c", color: "white", border: "none", borderRadius: "3px", cursor: "pointer" }}>Post Comment</button>
        </form>
      </div>
    </div>
  );
}
