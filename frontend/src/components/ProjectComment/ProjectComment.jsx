import { useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/config";

const Reply = ({ reply }) => {
  if (!reply?.user) {
    return <div className="text-danger">Reply data is incomplete.</div>;
  }

  return (
    <div className="reply mb-2 p-2 bg-body-secondary rounded-3">
      <div className="d-flex align-items-center gap-2 mb-1">
        <img
          src={`http://localhost:8000${reply.user.profile_picture}`}
          onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/profile-blank.png";
            }}
          alt="user"
          className="rounded-circle"
          style={{ width: "28px", height: "28px", objectFit: "cover" }}
        />
        <Link
          to={`/user/${reply.user.id}`}
          className="fw-semibold text-decoration-none"
        >
          {reply.user.username}
        </Link>
      </div>
      <p className="mb-1">{reply.content}</p>
      <small className="text-muted">
        Replied on: {new Date(reply.created_at).toLocaleString()}
      </small>
    </div>
  );
};

const ProjectComment = ({ comment, updateCommentReplies }) => {
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
        { content: replyContent }
      );
      updateCommentReplies(comment.id, response.data);
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
    return <div className="text-danger">Comment data is incomplete.</div>;
  }

  return (
    <div className="comment">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="d-flex align-items-center gap-2">
          <img
            src={`http://localhost:8000${comment.user.profile_picture}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/profile-blank.png";
            }}
            alt="user"
            className="rounded-circle"
            style={{ width: "32px", height: "32px", objectFit: "cover" }}
          />
          <Link
            to={`/user/${comment.user.id}`}
            className="text-decoration-none fw-bold"
          >
            {comment.user.username}
          </Link>
        </div>
        <button
          onClick={() => setShowCommentReportForm((prev) => !prev)}
          className="btn btn-sm btn-outline-danger rounded-pill"
        >
          {showCommentReportForm ? "Cancel Report" : "Report"}
        </button>
      </div>

      {/* Content */}
      <p className="mb-1">{comment.content}</p>
      <small className="text-muted">
        Posted on: {new Date(comment.created_at).toLocaleString()}
      </small>

      {/* Report Form */}
      {showCommentReportForm && (
        <form onSubmit={handleCommentReportSubmit} className="mt-3">
          <textarea
            rows={2}
            value={commentReportReason}
            onChange={(e) => setCommentReportReason(e.target.value)}
            className="form-control mb-2"
            placeholder="Reason for reporting this comment..."
            required
          />
          <div className="d-flex gap-2">
            <button
              type="submit"
              className="btn btn-sm btn-danger rounded-pill px-3"
            >
              Submit Report
            </button>
            <button
              type="button"
              onClick={() => setShowCommentReportForm(false)}
              className="btn btn-sm btn-secondary rounded-pill"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Replies */}
      {comment.replies?.length > 0 && (
        <div className="mt-3 ps-3 border-start">
          <h6 className="mb-2">Replies:</h6>
          {comment.replies.map((reply) => (
            <Reply key={reply.id} reply={reply} />
          ))}
        </div>
      )}

      {/* Reply Button */}
      <button
        onClick={() => setShowReplyForm((prev) => !prev)}
        className="btn btn-sm btn-outline-primary mt-3 rounded-pill"
      >
        {showReplyForm ? "Cancel Reply" : "Reply"}
      </button>

      {/* Reply Form */}
      {showReplyForm && (
        <form onSubmit={handleReplySubmit} className="mt-3">
          <textarea
            rows={2}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="form-control mb-2"
            placeholder="Write your reply..."
            required
          />
          <button
            type="submit"
            className="btn btn-sm btn-success rounded-pill px-3"
          >
            Post Reply
          </button>
        </form>
      )}
    </div>
  );
};

export default ProjectComment;
