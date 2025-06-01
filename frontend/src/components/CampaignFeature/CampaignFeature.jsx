import "./CampaignFeature.css";

const CampaignFeature = (prop) => {
  return (
    <section className="campaign-feature">
      <div className="feature-icon">
        <img src={prop.image} alt={prop.alt} />
      </div>

      <div className="feature-content">
        <h4>{prop.header}</h4>

        <p>{prop.paragraph}</p>
      </div>
    </section>
  );
};

export default CampaignFeature;
