import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../api/config";
import "./ProjectDetails.css";
import CampaignSmallCard from "../../components/CampaignSmallCard/CampaignSmallCard";
import "../../components/ProjectComment/ProjectComment";
import ProjectComment from "../../components/ProjectComment/ProjectComment";
import Footer from "../../components/Footer/Footer";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

  const sliderSettings = {
    dots: true, // Show dot indicators
    infinite: true, // Loop the slider
    speed: 500, // Transition speed in ms
    slidesToShow: 1, // Show one slide at a time
    slidesToScroll: 1, // Scroll one slide at a time
    adaptiveHeight: true, // Adjust height based on the image
    autoplay: true, // Automatically change slides
    autoplaySpeed: 3000, // Change slide every 3 seconds
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
          <div className="campaign-post mb-4 p-4 rounded-4 shadow-sm bg-white">
            <h2 className="fw-bold fs-3 mb-3 text-dark">
              {title || "Untitled Project"}
            </h2>
            <p
              className="text-secondary fs-6"
              style={{ whiteSpace: "pre-line" }}
            >
              {details || "No details available."}
            </p>
          </div>

          {/* Images */}
          {images.length > 0 && (
            <div className="campaign-images mb-4 shadow-sm rounded-4">
              <Slider {...sliderSettings}>
                {images.map((img) => (
                  <div key={img.id}>
                    <img
                      src={
                        img.image.startsWith("http")
                          ? img.image
                          : `https://ahmedelsabbagh.pythonanywhere.com${img.image}`
                      }
                      alt={title}
                      className="img-fluid rounded-4"
                      style={{ width: "100%", objectFit: "cover" }}
                    />
                  </div>
                ))}
              </Slider>
            </div>
          )}

          {/* Comments */}
          {localStorage.getItem("access_token") && (
            <div className="campaign-comments">
              <hr />
              <h5 className="mb-3">Comments</h5>
              {comments.length === 0 ? (
                <p className="text-muted">No comments yet.</p>
              ) : (
                <div className="vstack gap-3">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-3 rounded-4 border shadow-sm bg-light-subtle"
                    >
                      <ProjectComment
                        comment={comment}
                        updateCommentReplies={updateCommentReplies}
                      />
                    </div>
                  ))}
                </div>
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

              {localStorage.getItem("access_token") && (
                <div className="col">
                  <div className="fw-bold fs-5 text-primary">
                    {userDonation?.toLocaleString() || "0"}
                  </div>
                  <div className="text-muted small">Your Donation</div>
                </div>
              )}
            </div>

            <div className="campaign-creator d-flex align-items-center justify-content-between">
              {project_creator && (
                <div className="d-flex align-items-center gap-2">
                  <Link
                    to={`/user/${project_creator.id}`}
                    className="text-decoration-none"
                  >
                    <img
                      src={`https://ahmedelsabbagh.pythonanywhere.com${project_creator.profile_picture}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/profile-blank.png";
                      }}
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
                  </>
                )}
              </div>
            </div>

            <CancelProjectModal
              show={showCancelModal}
              onClose={() => setShowCancelModal(false)}
              onConfirm={confirmCancel}
              loading={canceling}
              donationRatio={donationRatio}
            />

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
          {Object.keys(similarProjectsByTag).length > 0 && (
            <div className="mt-5">
              <h5 className="mb-3">Similar Projects</h5>
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
                            <div className="col-md-12 mb-3" key={project.id}>
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
      </section>

      <Footer />
    </section>
  );
};

export default ProjectDetails;
