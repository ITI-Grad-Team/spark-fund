import React, { useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/config";
import "../Login/Login.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [alert, setAlert] = useState({ message: "", type: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await axiosInstance.post("/auth/password/reset/", { email });
            setAlert({ message: res.data.message, type: "success" });
            setEmail("");
            setTimeout(() => setAlert({ message: "", type: "" }), 5000);
        } catch (error) {
            setAlert({
                message: error.response?.data?.error || "Failed to send reset email.",
                type: "danger",
            });
            setTimeout(() => setAlert({ message: "", type: "" }), 5000);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="login">
            <div className="container">
                <div className="card shadow my-login-card-style" style={{ borderRadius: 20 }}>
                    <div className="column-1">
                        <img src="/Frame2.png" alt="forgot password page image" />
                    </div>
                    <div className="card-body column-2">
                        <h4 className="text-center mb-2">Reset Your Password</h4>
                        <p className="text-center text-secondary mb-4">
                            Enter your email to receive a password reset link.
                        </p>
                        {alert.message && (
                            <div className={`alert alert-${alert.type}`} role="alert">
                                {alert.message}
                            </div>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className="form-floating mb-4">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="form-control"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <label htmlFor="email">Email</label>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary w-100 mb-3"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Sending..." : "Send Reset Link"}
                            </button>
                            <p className="text-center mt-3 mb-0">
                                Back to <Link to="/login">Login</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ForgotPassword;