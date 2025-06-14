import { Link } from "react-router-dom";
import "./Navbar.css";
import axiosInstance from "../../api/config";
import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsAuthenticated(true);
      axiosInstance
        .get("/customuser/me/")
        .then((res) => {
          setUser(res.data);
          console.log("User data:", res.data.id);
          localStorage.setItem("user_id", res.data.id);
        })
        .catch((err) => {
          console.error("Error fetching current user:", err);
          if (err.response?.status === 401) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            setIsAuthenticated(false);
            navigate("/login");
          }
        });
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [navigate]);

  const handleLogout = async () => {
    setIsClicked(true);
    const refreshToken = localStorage.getItem("refresh_token");
    try {
      await axiosInstance.post("/logout/", { refresh_token: refreshToken });
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_id");
      setIsAuthenticated(false);
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_id");
      setIsAuthenticated(false);
      setUser(null);
      navigate("/login");
    } finally {
      setIsClicked(false);
    }
  };

  return (
    <nav className="container-fluid navbar">
      <div className="container">
        <div className="navbar-col-1">
          <Link className="navbar-brand" to="/">
            <img src="/navbar-logo.png" alt="Logo" />
          </Link>
          <div className="language">
            <button>
              <img src="/language.svg" alt="Language icon" /> Global
            </button>
          </div>
        </div>
        <div className="navbar-col-2">
          <Link className="search-btn" to="/projects">
            <img src="/search.svg" alt="search icon" /> Search
          </Link>
          <Link to="/">Home</Link>
          <Link to="/projects">Campaigns</Link>
          <Link to="/about">About</Link>
          <Link to="/">Contact</Link>
          <div>
            <Link to="/create/">
              <button className="create-btn">
                <img src="/edit 1.svg" alt="edit icon" /> Start a campaign
              </button>
            </Link>
          </div>
          <div className="sign-btns d-flex align-items-center gap-2">
            {isAuthenticated && user ? (
              <>
                <button className="logout-btn" onClick={handleLogout}>
                  {isClicked ? <ClipLoader color="white" size={20} /> : "Sign out"}
                </button>
                <img
                  src={
                    user?.profile_picture
                      ? `http://127.0.0.1:8000${user.profile_picture}`
                      : "/profile-blank.png"
                  }
                  alt="Profile"
                  className="rounded-circle"
                  style={{
                    width: 40,
                    height: 40,
                    objectFit: "cover",
                    border: "1px solid #ccc",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/user/${user.id}`)}
                />
              </>
            ) : (
              <>
                <Link className="signup-btn" to="/register">
                  Sign up
                </Link>
                <Link className="signin-btn" to="/login">
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;