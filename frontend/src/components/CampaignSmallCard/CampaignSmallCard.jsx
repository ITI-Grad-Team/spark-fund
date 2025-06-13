import "./CampaignSmallCard.css";
import { useNavigate } from "react-router-dom";

const CampaignSmallCard = ({ project }) => {
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
      : "../../../public/Rectangle.png";

  const userProfilePic = project.project_creator?.profile_picture
    ? `http://127.0.0.1:8000${project.project_creator.profile_picture}`
    : "../../../public/Ellipse 53.png";

  return (
    <section
      className="small-card"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <img
        className="project-img"
        src={projectImage}
        alt={project.title}
        onError={(e) => {
          e.target.src = "../../../public/Rectangle.png";
        }}
      />

      <div className="content">
        <div className="small-card-content">
          <div className="header">
            <h3>
              <img src="/paper-plane 2.png" alt="paper plane" />{" "}
              {project.project_creator?.username || "Unknown User"}
            </h3>
          </div>

          <h2 className="title">{project.title}</h2>

          <p className="description">{project.details}</p>

          <div className="info">
            <div className="btns">
              <button className="users-btn">
                <img src="/user 1.png" alt="User icon" />{" "}
                {donationPercentage.toFixed(0)}% funded
              </button>
            </div>

            <img
              src={userProfilePic}
              alt="campaign owner"
              className="profile-picture"
              onError={(e) => {
                e.target.src = "../../../public/Ellipse 53.png";
              }}
            />
          </div>
        </div>

        <div className="card-progress">
          <progress
            value={project.donation_amount}
            max={project.total_target}
          ></progress>
        </div>
      </div>
    </section>
  );
};

export default CampaignSmallCard;
