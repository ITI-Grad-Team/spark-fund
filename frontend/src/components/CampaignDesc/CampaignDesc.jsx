import CampaignFeature from "../CampaignFeature/CampaignFeature";
import SectionHeader from "../SectionHeader/SectionHeader";
import "./CampaignDesc.css";

const CampaignDesc = () => {
  return (
    <section className="desc_section container">
      <SectionHeader
        header="Start your campaign today"
        paragraph="Campoal has a variety of features that make it the best place to start a petition."
      />

      <div className="desc-body">
        <div className="campaign-features">
          <CampaignFeature
            image="/chart-area 1.svg"
            alt="chart area icon"
            header="Manage your campaigns"
            paragraph="Track how many people signed the petition by week, month, year."
          />
          <CampaignFeature
            image="/donate 1.svg"
            alt="donate icon"
            header="Collecting donation"
            paragraph="Campaign owners can set up donations to receive donations from supporters."
          />
          <CampaignFeature
            image="/file-download 1.svg"
            alt="file download icon"
            header="Export Signature"
            paragraph="Download the signatures of supporters and submit to the decision makers."
          />
        </div>

        <img src="/Frame.png" alt="campaign features image" />
      </div>
    </section>
  );
};

export default CampaignDesc;
