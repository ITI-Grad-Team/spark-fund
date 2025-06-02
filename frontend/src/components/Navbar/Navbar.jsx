import { Link } from "react-router-dom";
import "./Navbar.css";
import axiosInstance from "../../api/config";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = async () => {
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
          <Link to="/">Campaigns</Link>
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
                Sign out
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