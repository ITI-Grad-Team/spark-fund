import "./Login.css";
import axiosInstance from "../../api/config";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";

function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [resendEmail, setResendEmail] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      const res = await axiosInstance.post("/auth/login/", {
        username: formData.username,
        password: formData.password,
      });

      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      setAlert({ message: "Logged in successfully", type: "success" });

      window.location.href = "/";
    } catch (error) {
      console.error("Login error:", error.response?.data);
      if (
        error.response?.data?.non_field_errors?.includes(
          "No active account found with the given credentials"
        ) ||
        error.response?.data?.detail === "No active account found with the given credentials"
      ) {
        setAlert({
          message: "Your account is not activated. Please check your email or resend the activation link.",
          type: "danger",
        });
        setShowResend(true);
      } else {
        setAlert({
          message:
            error.response?.data?.non_field_errors?.[0] ||
            error.response?.data?.detail ||
            "Login failed",
          type: "danger",
        });
      }
      setTimeout(() => setAlert({ message: "", type: "" }), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendActivation = async () => {
    if (!resendEmail) {
      setAlert({ message: "Please enter your email address.", type: "danger" });
      setTimeout(() => setAlert({ message: "", type: "" }), 5000);
      return;
    }

    try {
      await axiosInstance.post("/resend-activation/", { email: resendEmail });
      setAlert({ message: "Activation email resent successfully.", type: "success" });
      setTimeout(() => setAlert({ message: "", type: "" }), 5000);
    } catch (error) {
      setAlert({
        message: error.response?.data?.error || "Failed to resend activation email.",
        type: "danger",
      });
      setTimeout(() => setAlert({ message: "", type: "" }), 5000);
    }
  };

  return (
    <>
      <section className="login">
        <div className="container">
          <div
            className="card shadow my-login-card-style"
            style={{ borderRadius: 20 }}
          >
            <div className="column-1">
              <img src="/Frame2.png" alt="login page image" />
            </div>

            <div className="card-body column-2">
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
                <div className="text-center mb-3">
                  <Link to="/forgot-password" className="text-secondary">
                    Forgot Password?
                  </Link>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100 mb-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>

                {showResend && (
                  <div className="mb-3">
                    <div className="form-floating mb-2">
                      <input
                        type="email"
                        id="resendEmail"
                        name="resendEmail"
                        className="form-control"
                        placeholder="Email"
                        value={resendEmail}
                        onChange={(e) => setResendEmail(e.target.value)}
                      />
                      <label htmlFor="resendEmail">Email</label>
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary w-100"
                      onClick={handleResendActivation}
                    >
                      Resend Activation Email
                    </button>
                  </div>
                )}

                <div className="google-login justify-content-center mb-3 w-100">
                  <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                      const { credential } = credentialResponse;
                      if (credential) {
                        const decoded = parseJwt(credential);

                        try {
                          const res = await axiosInstance.post(
                            "/google-login/",
                            {
                              email: decoded.email,
                              name: decoded.name,
                            }
                          );

                          localStorage.setItem("access_token", res.data.access);
                          localStorage.setItem(
                            "refresh_token",
                            res.data.refresh
                          );

                          setAlert({
                            message: "Logged in successfully",
                            type: "success",
                          });
                          setTimeout(
                            () => setAlert({ message: "", type: "" }),
                            5000
                          );

                          window.location.href = "/";
                        } catch (error) {
                          console.error("Google login error", error);
                          setAlert({
                            message: "Google login failed.",
                            type: "danger",
                          });
                          setTimeout(
                            () => setAlert({ message: "", type: "" }),
                            5000
                          );
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
                  <Link to="/register">Sign Up</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;