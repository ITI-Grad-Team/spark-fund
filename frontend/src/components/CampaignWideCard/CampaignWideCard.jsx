import "./CampaignWideCard.css";

const CampaignWideCard = ({ project }) => {

  return (
    <section className="wide-card container">
      <section className="col-1">
        <img src="/Rectangle.png" alt="Project photo" />
      </section>

      <section className="col-2">
        <div>
          <h3>
            <img src="/paper-plane 2.png" alt="paper plan image" /> {project.project_creator.username}
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

        <progress value="60" max="100"></progress>

        <div className="campaign-details">
          <div className="btns">
            <button className="users-btn">
              <img src="/user 1.png" alt="User icon" /> {project.donation_amount}
            </button>
            <button className="tags-btn">
              <img src="/tag 1.png" alt="Tag Icon" /> {project.tags_detail.name}
            </button>
            <button className="comments-btn">
              <img src="/comments 1.png" alt="Comments Icon" /> {project.comments?.length || 0} comments
            </button>
          </div>

          <img className="owner" src="/Ellipse 53.png" alt="campaign owner" />
        </div>
      </section>
    </section>
  );
};

export default CampaignWideCard;
