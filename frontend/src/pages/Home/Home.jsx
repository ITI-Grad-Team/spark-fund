import CampaignDesc from "../../components/CampaignDesc/CampaignDesc";
import CampaignWideCard from "../../components/CampaignWideCard/CampaignWideCard";
import "./Home.css";
import CampaignSmallCard from "../../components/CampaignSmallCard/CampaignSmallCard";
import SectionHeader from "../../components/SectionHeader/SectionHeader";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { useEffect, useState } from "react";
import axiosInstance from "../../api/config";
import { BarLoader } from "react-spinners";

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [categories, setCategories] = useState([]);

  const lastFive = [...projects]
    .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
    .slice(0, 5);

  const currentDate = new Date();

  const topRated = [...projects]
    .filter(
      (project) =>
        !project.is_cancelled && new Date(project.end_date) > currentDate
    )
    .sort((a, b) => b.average_rating - a.average_rating)
    .slice(0, 5);

  useEffect(() => {
    axiosInstance.get("/category-names/").then((res) => {
      setCategories(res.data);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get("/projects")
      .then((res) => {
        setProjects(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <section className="container-fluid home">
      <section className="container hero">
        <h1>Make an impact to the world.</h1>

        <p>We offer complete solution to launch your social movements.</p>

        <div className="btns">
          {!isAuthenticated ? (
            <Link to="/login/" className="started-btn">
              Get Started
            </Link>
          ) : (
            <Link to="/create/" className="started-btn">
              Get Started
            </Link>
          )}

          <Link className="learn-btn" to="/about">
            Learn More
          </Link>
        </div>

        <img className="hero-image" src="/Frame.svg" alt="Hero image" />
        <img className="hero-shape" src="/hero-shape.svg" alt="Hero image" />

        {loading ? (
          <center>
          <BarLoader
            color="#6059c9"
            size={80}
            speedMultiplier={1.2}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
          </center>
        ) : (
          <div className="home-carousel">
            <Swiper
              modules={[Navigation]}
              navigation
              spaceBetween={20}
              slidesPerView={1}
            >
              {topRated.map((project) => (
                <SwiperSlide key={project.id}>
                  <CampaignWideCard project={project} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </section>

      <CampaignDesc />

      <section className="container categories">
        <SectionHeader
          header="Browse Campaigns"
          paragraph="See Your Desired Campaigns Based on There categories."
        />

        <div className="categories-card">
          {categories.map((category, index) => (
            <button key={index}>
              <Link to={`/projects/?category=${category}`}>{category}</Link>
            </button>
          ))}
        </div>
      </section>

      <div className="campaigns container">
        <SectionHeader
          header="Your voice matters"
          paragraph="These petitions need your help to achieve victory."
        />

        {loading ? (
          <div className="loader-wrapper">
            <center>
            <BarLoader
              color="#6059c9"
              size={80}
              speedMultiplier={1.2}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
            </center>
          </div>
          
        ) : (
          <div className="campaigns-grid">
            {lastFive.map((project) => (
              <CampaignSmallCard key={project.id} project={project} />
            ))}
          </div>
        )}

        <Link to="/projects" className="all-campaigns-btn">
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

          <Link to="/projects">
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
      <section className="cta container">
        <section className="cta-content">
          <h2>Start one today!</h2>

          <p>
            People everywhere are empowered to start campaigns, mobilize
            supporters, and work with Decision Makers to drive solutions.
          </p>

          <Link to="/create/">
            <img src="/feather-alt 1.svg" alt="feather icon" /> Start a Campaign
          </Link>
        </section>

        <div className="cta-image">
          <img src="/Frame1.png" alt="call to action image" />
        </div>
      </section>
    </section>
  );
};

export default Home;
