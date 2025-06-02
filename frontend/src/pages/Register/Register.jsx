import "./Register.css";
import axiosInstance from "../../api/config";
import { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    profileImage: null,
  });

  const [alert, setAlert] = useState({ message: "", type: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      setFormData({ ...formData, profileImage: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setAlert({ message: "Passwords do not match", type: "danger" });
      setTimeout(() => setAlert({ message: "", type: "" }), 5000);
      return;
    }

    setIsSubmitting(true);

    const payload = new FormData();
    payload.append("username", formData.username);
    payload.append("email", formData.email);
    payload.append("password", formData.password);
    payload.append("confirm_password", formData.confirmPassword);
    payload.append("phone", formData.phone);
    if (formData.profileImage) {
      payload.append("profile_picture", formData.profileImage);
    }

    try {
      const res = await axiosInstance.post("/register/", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setAlert({ message: "Account created successfully!", type: "success" });
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        profileImage: null,
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
    <section className="min-vh-100 d-flex justify-content-center gradient-custom-3 mt-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-8 col-xl-7">
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

                {/* ----------------------form------------------------------------- */}

                <form onSubmit={handleSubmit} encType="multipart/form-data">

                {/* ----------------------profile image--------------------------- */}
                  <div className="profile-preview-wrapper text-center mb-3">
                    <label htmlFor="profileImage" style={{ cursor: "pointer" }}>
                      <img
                        src={
                          formData.profileImage
                            ? URL.createObjectURL(formData.profileImage)
                            : "/profile-blank.png" 
                        }
                        alt="Profile Preview"
                        className="profile-preview rounded-circle"
                        style={{
                          width: 120,
                          height: 120,
                          objectFit: "cover",
                          border: "2px solid #ccc",
                        }}
                      />
                    </label>
                    <input
                      type="file"
                      id="profileImage"
                      name="profileImage"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleChange}
                    />
                    {errors.profile_picture && (
                      <div className="text-danger mt-1 small">
                        {errors.profile_picture[0]}
                      </div>
                    )}
                  </div>
      {/* ----------------------End of profile image--------------------------- */}


      {/* ----------------------form fields--------------------------- */}
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <div className="form-floating">
                        <input
                          type="text"
                          id="username"
                          name="username"
                          className={`form-control ${
                            errors.username ? "is-invalid" : ""
                          }`}
                          placeholder="Username"
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
                    </div>

                    <div className="col-md-6 mb-3">
                      <div className="form-floating">
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
                    </div>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className={`form-control ${
                        errors.phone ? "is-invalid" : ""
                      }`}
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    <label htmlFor="phone">Phone Number</label>
                    {errors.phone && (
                      <div className="invalid-feedback">{errors.phone}</div>
                    )}
                  </div>
                  <div className="row">
                    <div className="col-md-6">
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
                    </div>

                    <div className="col-md-6">
                      <div className="form-floating mb-3">
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
                        <label htmlFor="confirmPassword">
                          Confirm Password
                        </label>
                        {errors.confirm_password && (
                          <div className="invalid-feedback">
                            {errors.confirm_password[0]}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
      {/* ----------------------End of form fields--------------------------- */}

                  <div className="form-check d-flex justify-content-center mb-3">
                    <input
                      className="form-check-input me-2"
                      type="checkbox"
                      id="rights"
                    />
                    <label className="form-check-label" htmlFor="rights">
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
