import "./Register.css";
import axiosInstance from "../../api/config";
import { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [alert, setAlert] = useState({
    message: "",
    type: "",
  });

  const [errors, setErrors] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setAlert({ message: "Passwords do not match", type: "danger" });
      setTimeout(() => setAlert({ message: "", type: "" }), 5000);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axiosInstance.post("/register/", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword,
      });

      setAlert({ message: "Account created successfully!", type: "success" });
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => setAlert({ message: "", type: "" }), 5000);
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: "Something went wrong. Please try again." });
      }

      setTimeout(() => setErrors({}), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-vh-100 d-flex justify-content-center align-items-center gradient-custom-3">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">
            <div className="card shadow" style={{ borderRadius: 15 }}>
              <div className="card-body p-5">
                <h2 className="text-center mb-4">Create an account</h2>
                {alert.message && (
                  <div
                    className={`alert alert-${alert.type} text-center`}
                    role="alert"
                  >
                    {alert.message}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      id="username"
                      name="username"
                      className={`form-control ${
                        errors.username ? "is-invalid" : ""
                      }`}
                      placeholder="username"
                      value={formData.username}
                      onChange={handleChange}
                    />
                    <label htmlFor="username">Username</label>
                    {errors.username && (
                      <div className="invalid-feedback">
                        {errors.username[0]}
                      </div>
                    )}
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <label htmlFor="email">Email</label>
                    {errors.email && (
                      <div className="invalid-feedback">
                        {errors.email[0]}
                      </div>
                    )}
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className={`form-control ${
                        errors.password ? "is-invalid" : ""
                      }`}
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <label htmlFor="password">Password</label>
                    {errors.password && (
                      <div className="invalid-feedback">
                        {errors.password[0]}
                      </div>
                    )}
                  </div>
                  <div className="form-floating mb-4">
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className={`form-control ${
                        errors.confirm_password ? "is-invalid" : ""
                      }`}
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    {errors.confirm_password && (
                      <div className="invalid-feedback">
                        {errors.confirm_password[0]}
                      </div>
                    )}
                  </div>
                  <div className="form-check d-flex justify-content-center mb-3">
                    <input
                      className="form-check-input me-2"
                      type="checkbox"
                      id="form2Example3cg"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="form2Example3cg"
                    >
                      I agree to all statements in{" "}
                      <a href="#!" className="text-body">
                        <u className="text-secondary">Terms of service</u>
                      </a>
                    </label>
                  </div>
                  <div className="d-flex justify-content-center">
                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Registering..." : "Register"}
                    </button>
                  </div>
                  <p className="text-center text-muted mt-2 mb-0">
                    Already have an account?{" "}
                    <a href="/login">
                      <u id="login">Login here</u>
                    </a>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
