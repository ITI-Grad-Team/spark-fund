import { Link } from "react-router-dom";
import "./Navbar.css";
import axiosInstance from "../../api/config";
import { useState, useEffect } from "react";
import { BarLoader, CircleLoader, ClipLoader, ClockLoader, DotLoader, RotateLoader } from "react-spinners";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = async () => {
    setIsClicked(true);
    const refreshToken = localStorage.getItem("refresh_token");
    try {
      await axiosInstance.post("/logout/", { refresh_token: refreshToken });
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setIsAuthenticated(false);
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setIsAuthenticated(false);
      window.location.href = "/login";
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
          <Link className="search-btn" to="/">
            <img src="/search.svg" alt="search icon" /> Search
          </Link>
          <Link to="/">Home</Link>
          <Link to="/projects">Campaigns</Link>
          <Link to="/">About</Link>
          <Link to="/">Contact</Link>
          <Link to="/">Blog</Link>
          <div>
            <Link to="/create/">
              <button className="create-btn">
                <img src="/edit 1.svg" alt="edit icon" /> Start a campaign
              </button>
            </Link>
          </div>
          <div className="sign-btns">
            {isAuthenticated ? (
              <button className="logout-btn" onClick={handleLogout}>
                {isClicked ? (<ClipLoader color="white" size={20} />) : "Sign out"}
              </button>
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