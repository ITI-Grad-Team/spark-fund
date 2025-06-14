import "./Projects.css";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import axiosInstance from "../../api/config";
import CampaignSmallCard from "../../components/CampaignSmallCard/CampaignSmallCard";
import { useSearchParams } from "react-router-dom";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const searchInTitle = searchParams.get("title") === "true";
  const searchInTags = searchParams.get("tags") === "true";

  const [searchInput, setSearchInput] = useState(search);
  const [toggleTitle, setToggleTitle] = useState(searchInTitle);
  const [toggleTags, setToggleTags] = useState(searchInTags);

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchClick = () => {
    const newParams = new URLSearchParams(searchParams);

    if (searchInput.trim()) {
      newParams.set("search", searchInput.trim());
    } else {
      newParams.delete("search");
    }

    if (toggleTitle) newParams.set("title", "true");
    else newParams.delete("title");

    if (toggleTags) newParams.set("tags", "true");
    else newParams.delete("tags");

    setSearchParams(newParams);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams();
    if (category) queryParams.set("category", category);
    if (search) queryParams.set("search", search);
    if (searchInTitle) queryParams.set("title", "true");
    if (searchInTags) queryParams.set("tags", "true");

    const url = `/projects/?${queryParams.toString()}`;

    setLoading(true);
    axiosInstance
      .get(url)
      .then((res) => setProjects(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [category, search, searchInTitle, searchInTags]);

  return (
    <section className="container-fluid">
      {/* Search */}
      <div className="row my-4">
        <div className="col-md-8 offset-md-2">
          <div className="d-flex flex-column flex-md-row align-items-center gap-2">
            <input
              id="search-input"
              type="text"
              className="form-control"
              placeholder="Search..."
              value={searchInput}
              onChange={handleInputChange}
            />
            <button className="btn btn-primary" onClick={handleSearchClick}>
              Search
            </button>
          </div>
          <div className="d-flex justify-content-center mt-3 gap-3">
            <button
              className={`btn btn-sm ${toggleTitle ? "btn-success" : "btn-outline-secondary"}`}
              onClick={() => setToggleTitle((prev) => !prev)}
            >
              Title
            </button>
            <button
              className={`btn btn-sm ${toggleTags ? "btn-success" : "btn-outline-secondary"}`}
              onClick={() => setToggleTags((prev) => !prev)}
            >
              Tags
            </button>
          </div>
        </div>
      </div>

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
          {projects.length > 0 ? (
            projects.map((project) => (
              <CampaignSmallCard key={project.id} project={project} />
            ))
          ) : (
            <p className="text-center mt-4">No projects found.</p>
          )}
        </div>
      )}
    </section>
  );
};

export default Projects;
