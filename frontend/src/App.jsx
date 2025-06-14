import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import React, { Suspense, lazy } from "react";
import Footer from "./components/Footer/Footer";

const Home = lazy(() => import("./pages/Home/Home"));
const ProjectDetails = lazy(() =>
  import("./pages/ProjectDetails/ProjectDetails")
);
const CreateProject = lazy(() => import("./pages/CreateProject/CreateProject"));
const Login = lazy(() => import("./pages/Login/Login"));
const Register = lazy(() => import("./pages/Register/Register"));
const UserProfile = lazy(() => import("./pages/UserProfile/UserProfile"));
const Projects = lazy(() => import("./pages/Projects/Projects"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword/ResetPassword"));
const About = lazy(() => import("./pages/About/About"));

function App() {
  return (
    <Router>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:uidb64/:token" element={<ResetPassword />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
          <Route path="/create" element={<CreateProject />} />
          <Route path="/user/:id" element={<UserProfile />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Suspense>
      <Footer />
    </Router>
  );
}

export default App;

