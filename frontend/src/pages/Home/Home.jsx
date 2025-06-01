import CampaignDesc from "../../components/CampaignDesc/CampaignDesc";
import CampaignWideCard from "../../components/CampaignWideCard/CampaignWideCard";
import "./Home.css";
import { projects } from "../../lib/projects";
import CampaignSmallCard from "../../components/CampaignSmallCard/CampaignSmallCard";
import SectionHeader from "../../components/SectionHeader/SectionHeader";
import { Link } from "react-router-dom";

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
          <div className="campaign-cards">
            {projects.map((project) => (
              <CampaignWideCard project={project} key={project.id} />
            ))}
          </div>

          <div className="carousel-btns">
            <button className="prev">Prev</button>
            <button>Next</button>
          </div>
        </div>
      </section>

      <CampaignDesc />

      <div className="campaigns">
        <SectionHeader
          header="Your voice matters"
          paragraph="These petitions need your help to achieve victory."
        />

        <div className="campaigns-grid">
          {projects.map((project) => (
            <CampaignSmallCard key={project.id} project={project} />
          ))}
        </div>

        <Link to="/" className="all-campaigns-btn">
          All campaigns <img src="/angle-right 5.svg" alt="right arrow icon" />
        </Link>
      </div>
    </section>
  );
};

export default Home;
