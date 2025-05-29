import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8000/api/projects/${id}/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch project");
        return res.json();
      })
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not fetch project");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;
  if (!project) return null;

  return (
    <div className="container mt-5">
      <h2>{project.title}</h2>
      <p>{project.details}</p>
      <p>
        <strong>Target:</strong> {project.total_target} EGP
      </p>
      <p>
        <strong>Donated:</strong> {project.donation_amount} EGP
      </p>
      <p>
        <strong>Average Rating:</strong> {project.average_rating}
      </p>
      <p>
        <strong>Start:</strong> {project.start_date} | <strong>End:</strong>{" "}
        {project.end_date}
      </p>

      <p>
        <strong>Category:</strong> {project.category?.name}
      </p>

      <div className="mb-3">
        <strong>Tags:</strong>
        <ul className="list-inline">
          {project.tags.map((tag) => (
            <li key={tag.id} className="list-inline-item badge bg-primary me-1">
              {tag.name}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <strong>Images:</strong>
        <div className="row">
          {project.images.map((img) => (
            <div key={img.id} className="col-md-3">
              <img
                src={`http://localhost:8000${img.image}`}
                className="img-fluid rounded"
                alt="Project"
              />
            </div>
          ))}
        </div>
      </div>

      <hr />

      <div>
        <h5>Comments</h5>
        {project.comments.map((comment) => (
          <div key={comment.id} className="mb-3">
            <strong>{comment.user}</strong>
            <p>{comment.content}</p>
            <small className="text-muted">
              {new Date(comment.created_at).toLocaleString()}
            </small>

            {comment.replies.map((reply) => (
              <div key={reply.id} className="ms-3 mt-2">
                <strong>{reply.user}</strong>
                <p>{reply.content}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectDetails;
