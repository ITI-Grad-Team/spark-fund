import "./Projects.css";
import { useEffect, useState } from "react";
import { RingLoader } from "react-spinners";
import axiosInstance from "../../api/config";
import CampaignSmallCard from "../../components/CampaignSmallCard/CampaignSmallCard";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/projects/?limit=10&offset=0")
      .then((res) => {
        console.log("API response:", res);
        setProjects(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);
  return (
    <section className="container-fluid">
      {loading ? (
        <center>
          <div className="loader-wrapper">
            <RingLoader
              color="#3b82f6"
              size={80}
              speedMultiplier={1.2}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        </center>
      ) : (
        <div className="campaigns-grid container padding">
          {projects.map((project) => (
            <CampaignSmallCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
};
export default Projects;
