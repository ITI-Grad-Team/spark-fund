import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => (
  <nav className="container-fluid navbar-background">
    <div className="container navbar">
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
          <Link className="signup-btn" to="/register">
            Sign up
          </Link>
          <Link className="signin-btn" to="/login">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar;
