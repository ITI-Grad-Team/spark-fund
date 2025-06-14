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
    <div className="container py-4">
  <div className="row justify-content-center">
    {/* Left Column - Project Details */}
    <div className="col-lg-8 mb-4">
      <div
        className="card shadow-sm rounded-4"
        style={{ backgroundColor: "#f9f9f9" }}
      >
        {/* === Header === */}
        <div className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <img
              src={`http://127.0.0.1:8000${project_creator.profile_picture}`}
              onError={(e) => (e.target.src = "/profile-blank.png")}
              alt="profile"
              className="rounded-circle"
              style={{ width: "45px", height: "45px", objectFit: "cover" }}
            />
            <div>
              <Link to={`/user/${project_creator.id}`} className="fw-semibold text-dark text-decoration-none">
                {project_creator.username}
              </Link>
              <div className="text-muted small">
                {new Date(start_date).toLocaleDateString()}
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowProjectReportForm((prev) => !prev)}
            className="btn btn-sm btn-outline-secondary rounded-pill"
          >
            Report
          </button>
        </div>

        {/* === Body === */}
        <div className="px-4 py-3">
          <h3 className="fw-bold mb-2">{title}</h3>

          {images.length > 0 && (
            <div className="mb-3">
              <img
                src={`http://localhost:8000${images[0].image}`}
                alt={title}
                className="img-fluid rounded-3 w-100"
                style={{ maxHeight: "400px", objectFit: "cover" }}
              />
            </div>
          )}

          <p className="text-muted">{details}</p>

          <div className="bg-white rounded-3 p-3 shadow-sm mb-3 d-flex justify-content-around text-center">
            <div>
              <div className="fw-bold text-success">{donation_amount} EGP</div>
              <small className="text-muted">Donated</small>
            </div>
            <div>
              <div className="fw-bold">{total_target} EGP</div>
              <small className="text-muted">Target</small>
            </div>
            <div>
              <div className="fw-bold text-primary">{userDonation || 0} EGP</div>
              <small className="text-muted">Your Donation</small>
            </div>
          </div>

          {/* Rating + Donation */}
          <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
            <div>
              <strong>Avg Rating:</strong>{" "}
              {average_rating ? `${parseFloat(average_rating).toFixed(1)} ⭐` : "N/A"}
            </div>

            {userRating === null ? (
              <div className="d-flex gap-2">
                <select
                  className="form-select form-select-sm"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  <option value={0}>Rate</option>
                  {[1, 2, 3, 4, 5].map((r) => (
                    <option key={r} value={r}>
                      {r} ⭐
                    </option>
                  ))}
                </select>
                <button className="btn btn-sm btn-success" onClick={handleRate}>
                  Submit
                </button>
              </div>
            ) : (
              <div>You rated: {userRating} ⭐</div>
            )}

            <div className="ms-auto d-flex gap-2">
              <input
                type="number"
                min={1}
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                className="form-control form-control-sm w-50"
                placeholder="EGP"
              />
              <button className="btn btn-sm btn-primary" onClick={handleDonate}>
                Donate
              </button>
            </div>
          </div>

          <div className="mb-3">
            <span className="fw-semibold me-2">Category:</span>
            <span className="badge text-bg-light">{category_detail?.name}</span>
          </div>

          <div className="mb-4">
            <span className="fw-semibold me-2">Tags:</span>
            {tags_detail.map((tag) => (
              <span key={tag.id} className="badge rounded-pill bg-secondary-subtle text-dark me-1">
                #{tag.name}
              </span>
            ))}
          </div>

          {/* Comments */}
          <div className="pt-3 border-top">
            <h6 className="fw-bold mb-3">Comments</h6>
            {comments.length === 0 ? (
              <p className="text-muted">No comments yet. Be the first!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="mb-3">
                  <ProjectComment comment={comment} updateCommentReplies={updateCommentReplies} />
                </div>
              ))
            )}

            <form onSubmit={handleAddComment}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="form-control mb-2"
                placeholder="Write a comment..."
                rows="2"
                required
              />
              <button type="submit" className="btn btn-sm btn-outline-success">
                Comment
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    {/* Right Column - Similar Projects */}
    {Object.keys(similarProjectsByTag).length > 0 && (
      <div className="col-lg-4">
        <div className="sticky-top" style={{ top: "80px" }}>
          <div className="card shadow-sm rounded-4 p-3">
            <h5 className="fw-bold mb-3">Similar Projects</h5>
            {loadingSimilar ? (
              <p>Loading...</p>
            ) : (
              Object.entries(similarProjectsByTag).map(([tagName, projects]) =>
                projects.length > 0 ? (
                  <div key={tagName} className="mb-4">
                    <h6 className="fw-semibold">{tagName}</h6>
                    {projects.map((project) => (
                      <div key={project.id} className="mb-2">
                        <CampaignSmallCard project={project} />
                      </div>
                    ))}
                  </div>
                ) : null
              )
            )}
          </div>
        </div>
      </div>
    )}
  </div>
</div>

  );
};

export default ProjectDetails;
