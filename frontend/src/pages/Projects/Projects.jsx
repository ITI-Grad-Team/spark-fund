import "./Projects.css";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import axiosInstance from "../../api/config";
import CampaignSmallCard from "../../components/CampaignSmallCard/CampaignSmallCard";
import { useSearchParams } from "react-router-dom";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  useEffect(() => {
    const url = category
      ? `/projects/?category=${encodeURIComponent(category)}`
      : "/projects/";

    axiosInstance
      .get(url)
      .then((res) => {
        console.log("API response:", res);
        setProjects(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <section className="container-fluid">
      {loading ? (
        <center>
          <div className="loader-wrapper">
            <BarLoader
              color="#6059c9"
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
