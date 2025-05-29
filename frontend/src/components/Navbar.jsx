import { Link } from "react-router-dom";

const Navbar = () => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <div className="container-fluid">
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
  </nav>
);

export default Navbar;
