import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <div className="container-fluid">
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

      <div>
        <div>
          <img src="/search.svg" alt="search icon" /> Search
        </div>
        <Link className="navbar-brand" to="/">
          Home
        </Link>
        <Link className="navbar-brand" to="/create/">
          Post
        </Link>
        <Link className="navbar-brand" to="/login">
          Login
        </Link>
        <Link className="navbar-brand" to="/register">
          Register
        </Link>
      </div>
    </div>
  </nav>
);

export default Navbar;
