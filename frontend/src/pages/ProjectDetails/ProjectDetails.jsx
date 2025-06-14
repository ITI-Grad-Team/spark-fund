import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../api/config";
import "./ProjectDetails.css";
import CampaignSmallCard from "../../components/CampaignSmallCard/CampaignSmallCard";
import "../../components/ProjectComment/ProjectComment"
import ProjectComment from "../../components/ProjectComment/ProjectComment";

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
const Comment = ({ comment, updateCommentReplies }) => {
  // Changed refreshProject to updateCommentReplies
  const [replyContent, setReplyContent] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showCommentReportForm, setShowCommentReportForm] = useState(false);
  const [commentReportReason, setCommentReportReason] = useState("");

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    try {
      const response = await axiosInstance.post(
        `/comments/${comment.id}/reply/`,
        {
          content: replyContent,
        }
      );
      // Optimistically update replies
      updateCommentReplies(comment.id, response.data); // Call the new function
      setReplyContent("");
      setShowReplyForm(false);
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
      <hr />
      <div className="comment-header">
        <p>
          <Link to={`/user/${comment.user.id}`}>
            <strong>{comment.user.username || "Anonymous"}</strong>
          </Link>
          : {comment.content}
        </p>

        <div className="comment-btns">
          <button
            onClick={() => setShowReplyForm((prev) => !prev)}
            className="toggle-reply-button"
          >
            {showReplyForm ? "Cancel Reply" : "Reply"}
          </button>

          <button
            onClick={() => setShowCommentReportForm((prev) => !prev)}
            className={`report-btn ${showCommentReportForm ? "active" : ""}`}
          >
            {showCommentReportForm ? "Cancel Report" : "Report"}
          </button>
        </div>
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
          {comment.replies.map((reply) => (
            <div key={reply.id} className="reply">
              <hr />
              <Reply reply={reply} />
            </div>
          ))}
        </div>
      )}

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
  // const [userDonation, setUserDonation] = useState(0);
  const [showProjectReportForm, setShowProjectReportForm] = useState(false);
  const [projectReportReason, setProjectReportReason] = useState("");
  const [similarProjectsByTag, setSimilarProjectsByTag] = useState({});
  const [loadingSimilar, setLoadingSimilar] = useState(false);


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

  // const fetchUserDonation = useCallback(async () => {
  //   try {
  //     const response = await axiosInstance.get(
  //       `/projects/${projectId}/donation-amount/`
  //     );
  //     setUserDonation(response.data.donation_amount);
  //   } catch (error) {
  //     console.error("Error fetching user donation:", error);
  //   }
  // }, [projectId]);

  useEffect(() => {
    setCurrentUserId(getLoggedInUserId());
  }, []);

  useEffect(() => {
    if (projectId) {
      fetchProject();
      fetchUserRating();
      // fetchUserDonation();
    }
  }, [
    projectId,
    fetchProject,
    fetchUserRating,
    // fetchUserDonation
  ]);

  // New function to update replies for a specific comment
  const updateCommentReplies = useCallback((commentId, newReply) => {
    setProject((prevProject) => {
      if (!prevProject) return prevProject;

      const updatedComments = prevProject.comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply],
          };
        }
        return comment;
      });
      return {
        ...prevProject,
        comments: updatedComments,
      };
    });
  }, []);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      // Get the new comment from the API response
      const response = await axiosInstance.post(
        `/projects/${projectId}/comment/`,
        {
          content: newComment,
        }
      );

      setProject((prevProject) => ({
        ...prevProject,
        comments: [...prevProject.comments, response.data],
      }));

      setNewComment("");
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
      // fetchUserDonation();
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
    <section className="container-fluid details-background">
      <section className="container project-details">
        {/* Column 1 */}
        <div className="column-1">
          <h2 className="campaign-header">{title || "Untitled Project"}</h2>

          {/* Images */}
          {images.length > 0 && (
            <div className="campaign-images">
              {images.map((img) => (
                <div key={img.id}>
                  <img
                    src={
                      img.image.startsWith("http")
                        ? img.image
                        : `http://localhost:8000${img.image}`
                    }
                    alt={title}
                    className="img-fluid rounded-3"
                  />
                </div>
              ))}
            </div>
          )}

          <p className="campaign-details">
            {details || "No details available."}
          </p>

          {/* Comments */}
          {localStorage.getItem("access_token") && (
            <div className="campaign-comments">
              <hr />
              <h5>Comments:</h5>
              {comments.length === 0 ? (
                <p className="text-muted">No comments yet.</p>
              ) : (
                comments.map((comment) => (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    updateCommentReplies={updateCommentReplies}
                  />
                ))
              )}
              <form
                onSubmit={handleAddComment}
                className="campaign-comments-form"
              >
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add your comment..."
                  rows={3}
                  required
                  className="form-control mb-2 rounded-3"
                />

                <button type="submit" className="post-comment-btn">
                  Post Comment
                </button>
              </form>
            </div>
          )}

          {/* Similar Projects */}
          {Object.keys(similarProjectsByTag).length > 0 && (
            <div className="mt-5">
              <h5>Similar Projects</h5>
              {loadingSimilar ? (
                <p>Loading...</p>
              ) : (
                Object.entries(similarProjectsByTag).map(
                  ([tagName, projects]) =>
                    projects.length > 0 ? (
                      <div key={tagName} className="mb-4">
                        <h6 className="fw-semibold">{tagName}</h6>
                        <div className="row">
                          {projects.map((project) => (
                            <div className="col-md-3 mb-3" key={project.id}>
                              <CampaignSmallCard project={project} />
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null
                )
              )}
            </div>
          )}
        </div>

        {/* Column 2 */}
        <div className="column-2">
          <div
            className="column-2-content shadow"
            style={{ backgroundColor: "#fff" }}
          >
            <div className="row text-center my-4">
              <div className="col">
                <div className="fw-bold fs-5">
                  {total_target?.toLocaleString() || "0"}
                </div>
                <div className="text-muted small">Target</div>
              </div>

              <div className="col">
                <div className="fw-bold fs-5 text-success">
                  {donation_amount?.toLocaleString() || "0"}
                </div>
                <div className="text-muted small">Donated</div>
              </div>

              <div className="col">
                <div className="fw-bold fs-5 text-warning">
                  {average_rating !== null
                    ? parseFloat(average_rating).toFixed(1)
                    : "Not rated"}
                </div>
                <div className="text-muted small">Average Rating</div>
              </div>

              {/* {localStorage.getItem("access_token") && (
                <div className="col">
                  <div className="fw-bold fs-5 text-primary">
                    {userDonation?.toLocaleString() || "0"}
                  </div>
                  <div className="text-muted small">Your Donation</div>
                </div>
              )} */}
            </div>

            <div className="campaign-creator d-flex align-items-center justify-content-between">
              {project_creator && (
                <div className="d-flex align-items-center gap-2">
                  <Link
                    to={`/user/${project_creator.id}`}
                    className="text-decoration-none"
                  >
                    <img
                      src={`${
                        project_creator.profile_picture
                          ? `http://127.0.0.1:8000${project_creator.profile_picture}`
                          : `/user 1.png`
                      } `}
                      alt="profile_pic"
                      className="rounded-circle main-background"
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                      }}
                    />
                    {project_creator.username}
                  </Link>
                </div>
              )}
            </div>

            <div className="mb-3">
              <span className="badge bg-secondary-subtle text-dark">
                {category_detail?.name || "N/A"}
              </span>
            </div>

            <div className="mb-3">
              <span className="fw-semibold me-2">Tags:</span>
              {tags_detail.length > 0
                ? tags_detail.map((tag) => (
                    <span
                      key={tag.id}
                      className="badge bg-primary-subtle text-primary me-1 rounded-pill"
                    >
                      {tag.name}
                    </span>
                  ))
                : "No tags"}
            </div>

            <div className="mb-4 text-muted small d-flex align-items-center justify-content-between">
              <p className="mb-1">
                Start Date:{" "}
                {start_date ? new Date(start_date).toLocaleDateString() : "N/A"}
              </p>
              <p className="mb-1">
                End Date:{" "}
                {end_date ? new Date(end_date).toLocaleDateString() : "N/A"}
              </p>
            </div>

            <div className="donate-rate">
              {/* Rating */}
              <div className="rate">
                {localStorage.getItem("access_token") &&
                  (!userRatingLoaded ? (
                    <p>Loading rating...</p>
                  ) : userRating !== null ? (
                    <p>
                      You rated this project: <strong>{userRating} ⭐</strong>
                    </p>
                  ) : (
                    <div className="form-floating">
                      <select
                        value={rating}
                        name="rating"
                        id="rating"
                        onChange={(e) => setRating(parseInt(e.target.value))}
                        className="form-select"
                      >
                        <option value={0}>Select rating</option>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>
                            {"⭐".repeat(num)}
                          </option>
                        ))}
                      </select>
                      <label htmlFor="rating">Rating</label>
                      <button onClick={handleRate}>Submit</button>
                    </div>
                  ))}
              </div>

              {/* Donation */}
              {localStorage.getItem("access_token") &&
                !project.is_cancelled &&
                !(new Date(end_date) < Date.now()) && (
                  <div className="donate">
                    <div className="form-floating">
                      <input
                        type="number"
                        name="Amount"
                        id="Amount"
                        min="1"
                        step="1"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        placeholder="Amount"
                        className="form-control"
                      />
                      <label htmlFor="Amount">Amount</label>
                      <button onClick={handleDonate}>Donate</button>
                    </div>
                  </div>
                )}

              {new Date(end_date) < Date.now() && (
                <div className="alert alert-info text-center rounded-3">
                  📌 Project has ended
                </div>
              )}
            </div>

            <div className="danger-btns">
              <div className="report-btn">
                {localStorage.getItem("access_token") && (
                  <button
                    onClick={() => setShowProjectReportForm((prev) => !prev)}
                    className={`btn ${
                      showProjectReportForm ? "btn-outline-secondary" : "report"
                    } rounded-pill px-4`}
                  >
                    {showProjectReportForm ? "Cancel Report" : "Report Project"}
                  </button>
                )}
              </div>

              <div className="cancel-btn">
                {is_cancelled && (
                  <div className="alert alert-danger text-center rounded-3">
                    🚫 This project is cancelled
                  </div>
                )}

                {currentUserId === project_creator?.id && !is_cancelled && (
                  <>
                    <button
                      onClick={() => setShowCancelModal(true)}
                      disabled={canceling}
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
              </div>
            </div>

            {showProjectReportForm && (
              <form onSubmit={handleProjectReportSubmit} className="mb-4">
                <h5 className="fw-semibold">Report This Project</h5>
                <textarea
                  className="form-control mb-3 rounded-3"
                  rows={3}
                  value={projectReportReason}
                  onChange={(e) => setProjectReportReason(e.target.value)}
                  placeholder="Why are you reporting this project?"
                  required
                />
                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-danger rounded-pill px-4"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowProjectReportForm(false)}
                    className="btn btn-outline-secondary rounded-pill px-4"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </section>
  );
};

export default ProjectDetails;
