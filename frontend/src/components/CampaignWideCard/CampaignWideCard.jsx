import "./CampaignWideCard.css";

const CampaignWideCard = ({ project }) => {
  const { header, title, description } = project;
  return (
    <section className="wide-card container">
      <section className="col-1">
        <img src="/Rectangle.png" alt="Project photo" />
      </section>

      <section className="col-2">
        <div>
          <h3>
            <img src="/paper-plane 2.png" alt="paper plan image" /> {header}
          </h3>
        </div>

        <h2>{title}</h2>

        <p>{description}</p>

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
              <img src="/user 1.png" alt="User icon" /> 32.3k supporter
            </button>
            <button className="tags-btn">
              <img src="/tag 1.png" alt="Tag Icon" /> Children Rights
            </button>
            <button className="comments-btn">
              <img src="/comments 1.png" alt="Comments Icon" /> 12 comments
            </button>
          </div>

          <img className="owner" src="/Ellipse 53.png" alt="campaign owner" />
        </div>
      </section>
    </section>
  );
};

export default CampaignWideCard;
