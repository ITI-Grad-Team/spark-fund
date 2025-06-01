import SectionHeader from "../SectionHeader/SectionHeader";
import "./CampaignDesc.css";

const CampaignDesc = () => {
  return (
    <section className="desc_section container">
      <SectionHeader
        header="Start your campaign today"
        paragraph="Campoal has a variety of features that make it the best place to start a petition."
      />

      <div></div>
    </section>
  );
};

export default CampaignDesc;
