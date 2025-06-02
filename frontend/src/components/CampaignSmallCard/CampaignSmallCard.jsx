import "./CampaignSmallCard.css";

const CampaignSmallCard = ({ project }) => {
  const {
    projectImage,
    header,
    title,
    description,
    followers,
    comments,
    ownerImage,
    progress,
    target,
  } = project;
  return (
    <section className="small-card">
      <img className="project-img" src={projectImage} alt={title} />

      <div className="small-card-content">
        <div className="header">
          <h3>
            <img src="/paper-plane 2.png" alt="paper plan image" /> {header}
          </h3>
        </div>

        <h2 className="title">{title}</h2>

        <p className="description">{description}</p>

        <div className="info">
          <div className="btns">
            <button className="users-btn">
              <img src="/user 1.png" alt="User icon" /> {followers}k supporter
            </button>

            <button className="comments-btn">
              <img src="/comments 1.png" alt="Comments Icon" /> {comments}
            </button>
          </div>

          <img src={ownerImage} alt="campaign owner image" />
        </div>
      </div>

      <progress value={progress} max={target}></progress>
    </section>
  );
};

export default CampaignSmallCard;
