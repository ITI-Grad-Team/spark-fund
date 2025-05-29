import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import ProjectDetails from "./pages/ProjectDetails";
import Navbar from "./components/Navbar";
import CreateProject from "./pages/CreateProject"

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
        <Route path="/create/" element={<CreateProject />} />
      </Routes>
    </Router>
  );
}

export default App;
