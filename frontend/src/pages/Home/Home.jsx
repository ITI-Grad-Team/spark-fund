import CampaignDesc from "../../components/CampaignDesc/CampaignDesc";
import CampaignWideCard from "../../components/CampaignWideCard/CampaignWideCard";
import "./Home.css";

const Home = () => {
  return (
    <section className="container-fluid">
      <section className="container hero">
        <h1>Make an impact to the world.</h1>

        <p>We’re offer complete solution to launch your social movements.</p>

        <div className="btns">
          <button className="started-btn">Get Started</button>

          <button className="learn-btn">Learn More</button>
        </div>

        <img className="hero-image" src="/Frame.svg" alt="Hero image" />
        <img className="hero-shape" src="/hero-shape.svg" alt="Hero image" />

        <div className="home-carousel">
          <CampaignWideCard />

          <div className="carousel-btns">
            <button className="prev">Prev</button>
            <button>Next</button>
          </div>
        </div>
      </section>

      <CampaignDesc />
    </section>
  );
};

export default Home;
