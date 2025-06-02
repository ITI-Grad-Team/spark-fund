import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

// Comment component
const Comment = ({ comment }) => {
  return (
    <div>
      <p>
        <Link to={`/user/${comment.user.id}`}>
          <strong>{comment.user.username}</strong>
        </Link>
        : {comment.content}
      </p>
      <small>Posted on: {new Date(comment.created_at).toLocaleString()}</small>

      {comment.replies && comment.replies.length > 0 && (
        <div style={{ marginLeft: "20px" }}>
          <h3>Replies</h3>
          {comment.replies.map((reply) => (
            <Reply key={reply.id} reply={reply} />
          ))}
        </div>
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

  useEffect(() => {
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
  }, [id]);

  if (loading) return <p>Loading project...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!project) return <p>No project found</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <p>
        <b>Creator</b>
        <Link to={`/user/${project.project_creator.id}`}>
          {project.project_creator.username}
        </Link>
      </p>
      <h2>{project.title}</h2>
      <p>{project.details}</p>

      <p>
        <b>Total Target:</b> {project.total_target}
      </p>

      <p>
        <b>Category:</b> {project.category_detail.name}
      </p>

      <p>
        <b>Tags:</b> {project.tags_detail.map((tag) => tag.name).join(", ")}
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
            src={img.image}
            alt={`Project img ${img.id}`}
            style={{ width: "100px", marginRight: "10px" }}
          />
        ))}
      </div>

      <div style={{ marginTop: "30px" }}>
        <h3>Comments</h3>
        {project.comments.length === 0 && <p>No comments yet</p>}
        {project.comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
