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

      <div className="campaigns container">
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

      <section className="role container">
        <section className="col-1">
          <div className="user-img">
            <img src="/user-tie 1.svg" alt="user icon" />
          </div>

          <h2>Owner</h2>

          <p>
            We help you easy start your campaign, collect donations, signatures.
            You can manage your campaign updates and your supporters on
            dashboard.
          </p>

          <Link to="/create/">
            Start a Campaign{" "}
            <img src="/angle-right 5.svg" alt="right arrow icon" />
          </Link>
        </section>

        <section className="col-2">
          <div className="user-img">
            <img src="/person-sign 1.svg" alt="user icon" />
          </div>

          <h2>Supporter</h2>

          <p>
            Help the campaigns achieve their goals. Make the world better by
            signing, sharing and donating to spread good values to the
            community.
          </p>

          <Link to="/">
            Donate to Campaign{" "}
            <img src="/angle-right 2.svg" alt="right arrow icon" />
          </Link>
        </section>
      </section>

      <section className="getting-started container">
        <div>
          <SectionHeader
            header="Get started in a few minutes"
            paragraph="Campoal supports a variety of the most popular category."
          />
        </div>

        <div className="start-groups">
          <div className="start-group">
            <div className="start-img">
              <img src="/rocket-launch 1.svg" alt="rocket icon" />
            </div>

            <h4>Launch</h4>

            <p>People and organizations can launch a campaign for free.</p>
          </div>

          <div className="start-group">
            <div className="start-img">
              <img src="/megaphone 1.svg" alt="megaphone icon" />
            </div>

            <h4>Viral</h4>

            <p>Sharing with friends, family and supporters builds momentum.</p>
          </div>

          <div className="start-group">
            <div className="start-img">
              <img src="/trophy 1.svg" alt="trophy icon" />
            </div>

            <h4>Victory</h4>

            <p>Decision make have the opportunity to respond your petition.</p>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Home;
