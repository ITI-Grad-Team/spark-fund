import "./CampaignSmallCard.css";

const CampaignSmallCard = ({ project }) => {
  return (
    <>
      <section className="small-card">
        <img className="project-img" src="/Rectangle.png" alt={project.title} />

        <div className="content">
          <div className="small-card-content">
            <div className="header">
              <h3>
                <img src="/paper-plane 2.png" alt="paper plane" />{" "}
                {project.project_creator.username}
              </h3>
            </div>

            <h2 className="title">{project.title}</h2>

            <p className="description">{project.details}</p>

            <div className="info">
              <div className="btns">
                <button className="users-btn">
                  <img src="/user 1.png" alt="User icon" />{" "}
                  {Math.floor(Math.random() * 10)}k supporter
                </button>

                <button className="comments-btn">
                  <img src="/comments 1.png" alt="Comments Icon" />{" "}
                  {project.comments?.length || 0}
                </button>
              </div>

              <img
                src={project.project_creator.profile_picture}
                alt="campaign owner"
              />
            </div>
          </div>

          <progress
            value={Math.floor(Math.random() * Number(project.total_target))}
            max={project.total_target}
          ></progress>
        </div>
      </section>
    </>
  );
};

export default CampaignSmallCard;
