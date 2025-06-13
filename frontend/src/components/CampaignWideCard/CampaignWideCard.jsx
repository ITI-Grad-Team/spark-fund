import { useNavigate } from "react-router-dom";
import "./CampaignWideCard.css";

const CampaignWideCard = ({ project }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/project/${project.id}`);
  };

  const donationPercentage =
    project.total_target > 0
      ? Math.min(100, (project.donation_amount / project.total_target) * 100)
      : 0;

  const projectImage =
    project.images?.length > 0
      ? `http://localhost:8000${project.images[0].image}`
      : "/Rectangle.png";

  const userProfilePic = project.project_creator?.profile_picture
    ? `http://127.0.0.1:8000${project.project_creator.profile_picture}`
    : "/Ellipse 53.png";

  return (
    <section
      className="wide-card container"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <section className="col-1">
        <img
          className="project-image"
          src={projectImage}
          alt={project.title}
          onError={(e) => {
            e.target.src = "/Rectangle.png";
          }}
        />
      </section>

      <section className="col-2">
        <div>
          <h3>
            <img src="/paper-plane 2.png" alt="paper plan image" />{" "}
            {project.project_creator?.username || "Unknown User"}
          </h3>
        </div>

        <h2>{project.title}</h2>

        <p>{project.details}</p>

        <div>
          <h3>
            <img src="/map-marker 1.png" alt="Map Marker image" /> Division No.
            6, AB, CA
          </h3>
        </div>

        <progress value={donationPercentage} max="100"></progress>

        <div className="campaign-details">
          <div className="btns">
            <button className="users-btn">
              <img src="/user 1.png" alt="User icon" />{" "}
              {donationPercentage.toFixed(0)}% funded
            </button>
            <button className="tags-btn">
              <img src="/tag 1.png" alt="Tag Icon" />{" "}
              {project.tags_detail?.[0]?.name || ""}
            </button>
            <button className="comments-btn">
              <img src="/comments 1.png" alt="Comments Icon" />{" "}
              {project.comments?.length || 0} comments
            </button>

            <button className="tags-btn rating-button">
              <img
                className="rating-image"
                src="/star-white-icon.png"
                alt="Rating Icon"
              />{" "}
              {project.average_rating || 0}
            </button>
          </div>

          <img
            className="owner"
            src={userProfilePic}
            alt="campaign owner"
            onError={(e) => {
              e.target.src = "/Ellipse 53.png";
            }}
          />
        </div>
      </section>
    </section>
  );
};

export default CampaignWideCard;
