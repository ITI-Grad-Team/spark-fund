import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../api/config";
import "./ProjectDetails.css";
import CampaignSmallCard from "../../components/CampaignSmallCard/CampaignSmallCard";

// Utility function to get logged in user ID
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

// Reply Component
const Reply = ({ reply }) => {
  if (!reply?.user) {
    return <div className="error-message">Reply data is incomplete.</div>;
  }

  return (
    <div className="reply">
      <p>
        <Link to={`/user/${reply.user.id}`}>
          <strong>{reply.user.username || "Anonymous"}</strong>
        </Link>
        : {reply.content}
      </p>
      <small>Replied on: {new Date(reply.created_at).toLocaleString()}</small>
    </div>
  );
};

// Comment Component
const Comment = ({ comment, refreshProject }) => {
  const [replyContent, setReplyContent] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showCommentReportForm, setShowCommentReportForm] = useState(false);
  const [commentReportReason, setCommentReportReason] = useState("");

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    try {
      await axiosInstance.post(`/comments/${comment.id}/reply/`, {
        content: replyContent,
      });
      setReplyContent("");
      setShowReplyForm(false);
      refreshProject?.();
    } catch (err) {
      console.error("Error adding reply:", err.response?.data || err.message);
    }
  };

  const handleCommentReportSubmit = async (e) => {
    e.preventDefault();
    if (!commentReportReason.trim()) return;

    try {
      await axiosInstance.post(`/comments/${comment.id}/report/`, {
        reason: commentReportReason,
      });
      setCommentReportReason("");
      setShowCommentReportForm(false);
    } catch (err) {
      console.error(
        "Error reporting comment:",
        err.response?.data || err.message
      );
    }
  };

  if (!comment?.user) {
    return <div className="error-message">Comment data is incomplete.</div>;
  }

  return (
    <div className="comment">
      <div className="comment-header">
        <p>
          <Link to={`/user/${comment.user.id}`}>
            <strong>{comment.user.username || "Anonymous"}</strong>
          </Link>
          : {comment.content}
        </p>
        <button
          onClick={() => setShowCommentReportForm((prev) => !prev)}
          className={`report-button ${showCommentReportForm ? "active" : ""}`}
        >
          {showCommentReportForm ? "Cancel Report" : "Report"}
        </button>
      </div>

      <small>Posted on: {new Date(comment.created_at).toLocaleString()}</small>

      {showCommentReportForm && (
        <form onSubmit={handleCommentReportSubmit} className="report-form">
          <textarea
            rows={2}
            value={commentReportReason}
            onChange={(e) => setCommentReportReason(e.target.value)}
            placeholder="Reason for reporting this comment..."
            required
          />
          <div className="form-actions">
            <button type="submit" className="submit-button">
              Submit Report
            </button>
            <button
              type="button"
              onClick={() => setShowCommentReportForm(false)}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {comment.replies?.length > 0 && (
        <div className="replies-container">
          <h4>Replies:</h4>
          {comment.replies.map((reply) => (
            <Reply key={reply.id} reply={reply} />
          ))}
        </div>
      )}

      <button
        onClick={() => setShowReplyForm((prev) => !prev)}
        className="toggle-reply-button"
      >
        {showReplyForm ? "Cancel Reply" : "Reply"}
      </button>

      {showReplyForm && (
        <form onSubmit={handleReplySubmit} className="reply-form">
          <textarea
            rows={2}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write your reply..."
          />
          <button type="submit" className="submit-button">
            Post Reply
          </button>
        </form>
      )}
    </div>
  );
};

// Cancel Project Modal
const CancelProjectModal = ({
  show,
  onClose,
  onConfirm,
  loading,
  donationRatio,
}) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {donationRatio < 0.25 ? (
          <>
            <p>Are you sure you want to cancel this project?</p>
            <div className="modal-actions">
              <button onClick={onClose} disabled={loading}>
                No
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="confirm-button"
              >
                {loading ? "Canceling..." : "Yes, Cancel"}
              </button>
            </div>
          </>
        ) : (
          <>
            <p>Project cannot be canceled. Donation amount exceeds 25%</p>
            <div className="modal-actions">
              <button onClick={onClose} disabled={loading}>
                OK
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Project Details Main Component
const ProjectDetails = () => {
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
  const [showProjectReportForm, setShowProjectReportForm] = useState(false);
  const [projectReportReason, setProjectReportReason] = useState("");
  const [similarProjectsByTag, setSimilarProjectsByTag] = useState({});
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  // Add this effect
  useEffect(() => {
    if (project && project.tags_detail?.length > 0) {
      fetchSimilarProjectsByTag();
    }
  }, [project]);

  const fetchSimilarProjectsByTag = async () => {
    setLoadingSimilar(true);
    try {
      const currentTagNames = project.tags_detail.map((tag) => tag.name);
      const results = {};

      // Fetch 3 projects for each tag
      for (const tagName of currentTagNames) {
        const response = await axiosInstance.get(
          `/projects/?tag=${encodeURIComponent(tagName)}&limit=4`
        );
        // Filter out current project and store by tag name
        results[tagName] = response.data.filter((p) => p.id !== project.id);
      }

      setSimilarProjectsByTag(results);
    } catch (err) {
      console.error("Error fetching similar projects:", err);
    } finally {
      setLoadingSimilar(false);
    }
  };

  const fetchProject = useCallback(async () => {
    if (!projectId) {
      setError("Project ID is missing");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.get(`/projects/${projectId}/`);
      setProject(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch project");
      setProject(null);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const fetchUserRating = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        `/projects/${projectId}/my-rating/`
      );
      setUserRating(response.data.rating);
    } catch (err) {
      console.error("Error fetching user rating", err);
    } finally {
      setUserRatingLoaded(true);
    }
  }, [projectId]);

  const fetchUserDonation = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        `/projects/${projectId}/donation-amount/`
      );
      setUserDonation(response.data.donation_amount);
    } catch (error) {
      console.error("Error fetching user donation:", error);
    }
  }, [projectId]);

  useEffect(() => {
    setCurrentUserId(getLoggedInUserId());
  }, []);

  useEffect(() => {
    if (projectId) {
      fetchProject();
      fetchUserRating();
      fetchUserDonation();
    }
  }, [projectId, fetchProject, fetchUserRating, fetchUserDonation]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await axiosInstance.post(`/projects/${projectId}/comment/`, {
        content: newComment,
      });
      setNewComment("");
      fetchProject();
    } catch (err) {
      console.error("Error adding comment:", err.response?.data || err.message);
    }
  };

  const handleRate = async () => {
    if (rating < 1 || rating > 5) {
      alert("Please select a rating from 1 to 5");
      return;
    }

    try {
      await axiosInstance.post(`/projects/${projectId}/rate/`, { rating });
      setRating(0);
      // Refresh data after short delay
      setTimeout(() => {
        fetchUserRating();
        fetchProject();
      }, 500);
    } catch (err) {
      console.error(
        "Error submitting rating:",
        err.response?.data || err.message
      );
    }
  };

  const handleDonate = async () => {
    const amount = parseFloat(donationAmount);
    if (!amount || amount <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }

    try {
      await axiosInstance.post(`/projects/${projectId}/donate/`, {
        amount,
      });
      setDonationAmount("");
      fetchProject();
      fetchUserDonation();
    } catch (err) {
      console.error("Donation error:", err.response?.data || err.message);
    }
  };

  const confirmCancel = async () => {
    setCanceling(true);
    try {
      await axiosInstance.post(`/projects/${projectId}/cancel/`);
      setShowCancelModal(false);
      fetchProject();
    } catch (error) {
      console.error("Cancel error:", error);
    } finally {
      setCanceling(false);
    }
  };

  const handleProjectReportSubmit = async (e) => {
    e.preventDefault();
    if (!projectReportReason.trim()) return;

    try {
      await axiosInstance.post(`/projects/${projectId}/report/`, {
        reason: projectReportReason,
      });
      setProjectReportReason("");
      setShowProjectReportForm(false);
    } catch (err) {
      console.error(
        "Error reporting project:",
        err.response?.data || err.message
      );
    }
  };

  if (loading) return <div className="loading">Loading project...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!project) return <div>No project found</div>;

  const {
    title,
    details,
    total_target,
    category_detail,
    tags_detail = [],
    start_date,
    end_date,
    average_rating,
    donation_amount,
    images = [],
    comments = [],
    project_creator,
    is_cancelled,
  } = project;

  const donationRatio = donation_amount / total_target;

  console.log(tags_detail);

  return (
    <div className="project-details">
      <div className="project-header">
        <h2>{title || "Untitled Project"}</h2>
        {localStorage.getItem("access_token") && (
          <button
            onClick={() => setShowProjectReportForm((prev) => !prev)}
            className={`report-button ${showProjectReportForm ? "active" : ""}`}
          >
            {showProjectReportForm ? "Cancel Report" : "Report Project"}
          </button>
        )}
      </div>
      {showProjectReportForm && (
        <form onSubmit={handleProjectReportSubmit} className="report-form">
          <h4>Report This Project</h4>
          <textarea
            rows={3}
            value={projectReportReason}
            onChange={(e) => setProjectReportReason(e.target.value)}
            placeholder="Reason for reporting this project..."
            required
          />
          <div className="form-actions">
            <button type="submit" className="submit-button">
              Submit Report
            </button>
            <button
              type="button"
              onClick={() => setShowProjectReportForm(false)}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      {project_creator && (
        <p>
          <b>Creator: </b>
          <Link to={`/user/${project_creator.id}`}>
            {project_creator.username || "Unknown"}
          </Link>
          <img
            src={`http://127.0.0.1:8000${project_creator.profile_picture}`}
            alt="profile_pic"
          />
        </p>
      )}
      <p>
        <b>Details:</b> {details || "No details available."}
      </p>
      <p>
        <b>Total Target:</b> {total_target?.toLocaleString() || "N/A"}
      </p>
      <p>
        <b>Donated:</b> {donation_amount?.toLocaleString() || "N/A"}
      </p>
      {localStorage.getItem("access_token") && (
        <p>
          <b>Your Donation:</b> {userDonation?.toLocaleString() || "N/A"}
        </p>
      )}
      {category_detail && (
        <p>
          <b>Category:</b> {category_detail.name || "N/A"}
        </p>
      )}
      <p>
        <b>Tags:</b>{" "}
        {tags_detail.length > 0
          ? tags_detail.map((tag) => (
              <span key={tag.id} className="tag">
                {tag.name}
              </span>
            ))
          : "No tags"}
      </p>
      <p>
        <b>Start Date:</b>{" "}
        {start_date ? new Date(start_date).toLocaleDateString() : "N/A"}
      </p>
      <p>
        <b>End Date:</b>{" "}
        {end_date ? new Date(end_date).toLocaleDateString() : "N/A"}
      </p>
      <p>
        <b>Average Rating:</b>{" "}
        {average_rating !== null
          ? parseFloat(average_rating).toFixed(1)
          : "Not rated"}
      </p>
      {is_cancelled && (
        <div className="cancelled-banner">PROJECT CANCELLED</div>
      )}
      {currentUserId === project_creator?.id && !is_cancelled && (
        <>
          <button
            onClick={() => setShowCancelModal(true)}
            disabled={canceling}
            className="cancel-project-button"
          >
            {canceling ? "Canceling..." : "Cancel Project"}
          </button>

          <CancelProjectModal
            show={showCancelModal}
            onClose={() => setShowCancelModal(false)}
            onConfirm={confirmCancel}
            loading={canceling}
            donationRatio={donationRatio}
          />
        </>
      )}
      <div className="rating-section">
        {localStorage.getItem("access_token") ? (
          !userRatingLoaded ? (
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
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {"⭐".repeat(num)}
                  </option>
                ))}
              </select>
              <button onClick={handleRate} className="rate-button">
                Submit Rating
              </button>
            </>
          )
        ) : null}
      </div>
      {localStorage.getItem("access_token") &&
        !project.is_cancelled &&
        !(new Date(end_date) < Date.now()) && (
          <div className="donation-section">
            <h3>Donate to this project</h3>
            <input
              type="number"
              min="1"
              step="1"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              placeholder="Enter donation amount"
            />
            <button onClick={handleDonate} className="donate-button">
              Donate
            </button>
          </div>
        )}
      {new Date(end_date) < Date.now() && <p>PROJECT CLOSED</p>}
      {images.length > 0 && (
        <div className="project-images">
          <h3>Images</h3>
          <div className="images-grid">
            {images.map((img) => (
              <img
                key={img.id}
                src={
                  img.image.startsWith("http")
                    ? img.image
                    : `http://localhost:8000${img.image}`
                }
                alt={`Project ${title}`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = "none";
                }}
              />
            ))}
          </div>
        </div>
      )}
      {localStorage.getItem("access_token") && (
        <div className="comments-section">
          <h3>Comments</h3>
          {comments.length === 0 ? (
            <p>No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                refreshProject={fetchProject}
              />
            ))
          )}

          <form onSubmit={handleAddComment} className="add-comment-form">
            <h4>Add a Comment</h4>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment..."
              rows={3}
              required
            />
            <button type="submit" className="submit-button">
              Post Comment
            </button>
          </form>
        </div>
      )}

      {Object.keys(similarProjectsByTag).length > 0 && (
        <div className="similar-projects">
          <h3>Similar Projects</h3>
          {loadingSimilar ? (
            <div>Loading similar projects...</div>
          ) : (
            Object.entries(similarProjectsByTag).map(
              ([tagName, projects]) =>
                projects.length > 0 && (
                  <div key={tagName}>
                    <h4>{tagName}</h4>
                    <div className="row">
                      {projects.map((project) => (
                        <div className="col-md-3 mb-4" key={project.id}>
                          <CampaignSmallCard project={project} />
                        </div>
                      ))}
                    </div>
                  </div>
                )
            )
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
