import "./CampaignWideCard.css";

const CampaignWideCard = () => {
  return (
    <section className="wide-card">
      <section className="col-1">
        <img src="/Rectangle.png" alt="Project photo" />
      </section>

      <section className="col-2">
        <div>
          <h3>
            <img src="/paper-plane 2.png" alt="paper plan image" /> Petition to
            Katy Dickson
          </h3>
        </div>

        <h2>
          Help American Girl understand why limb difference dolls are so
          important
        </h2>

        <p>
          My daughter, Jordan, started asking me why her dolls don't look just
          like her when she was four years old. We had just purchased her first
          Bitty Baby from Chicago's American Girl Store.
        </p>

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
