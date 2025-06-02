import "./Login.css";
import axiosInstance from "../../api/config";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
}

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      const res = await axiosInstance.post("/login/", {
        username: formData.username,
        password: formData.password,
      });

      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      setAlert({ message: "Logged in successfully", type: "success" });

      window.location.href = "/";
    } catch (error) {
      setAlert({
        message: error.response?.data?.detail || "Login failed",
        type: "danger",
      });
      setTimeout(() => setAlert({ message: "", type: "" }), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="d-flex justify-content-center align-items-center login">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-4 col-xl-4">
              <div className="card shadow" style={{ borderRadius: 15 }}>
                <div className="card-body p-4">
                  <h4 className="text-center mb-2">Welcome</h4>
                  <p className="text-center text-secondary mb-4">
                    Please login to your account
                  </p>
                  {alert.message && (
                    <div className={`alert alert-${alert.type}`} role="alert">
                      {alert.message}
                    </div>
                  )}
                  <form onSubmit={handleSubmit}>
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        id="username"
                        name="username"
                        className="form-control"
                        placeholder="username"
                        required
                        onChange={handleChange}
                      />
                      <label htmlFor="username">username</label>
                    </div>
                    <div className="form-floating mb-4">
                      <input
                        type="password"
                        id="password"
                        name="password"
                        className="form-control"
                        placeholder="Password"
                        required
                        onChange={handleChange}
                      />
                      <label htmlFor="password">Password</label>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary w-100 mb-3"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Logging in..." : "Login"}
                    </button>

                    <div className="google-login justify-content-center mb-3 w-100">
                      <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                          const { credential } = credentialResponse;
                          if (credential) {
                           const decoded = parseJwt(credential);

                            try {
                              const res = await axiosInstance.post("/google-login/", {
                                email: decoded.email,
                                name: decoded.name,
                              });

                              localStorage.setItem("access_token", res.data.access);
                              localStorage.setItem("refresh_token", res.data.refresh);

                              setAlert({
                                message: "Logged in successfully",
                                type: "success",
                              });
                              setTimeout(() => setAlert({ message: "", type: "" }), 5000);

                              window.location.href = "/";
                            } catch (error) {
                              console.error("Google login error", error);
                              setAlert({
                                message: "Google login failed.",
                                type: "danger",
                              });
                              setTimeout(() => setAlert({ message: "", type: "" }), 5000);
                            }
                          }
                        }}
                        onError={() => {
                          setAlert({
                            message: "Google login error",
                            type: "danger",
                          });
                        }}
                      />
                    </div>

                    <p className="text-center mt-3 mb-0">
                      Don’t have an account?{" "}
                      <a href="#!">
                        <u>Register here</u>
                      </a>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
