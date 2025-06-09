import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../api/config";
import "../Login/Login.css";

const ResetPassword = () => {
    const { uidb64, token } = useParams();
    const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
    const [alert, setAlert] = useState({ message: "", type: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setAlert({ message: "Passwords do not match.", type: "danger" });
            setTimeout(() => setAlert({ message: "", type: "" }), 5000);
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await axiosInstance.post(`/auth/password/reset/confirm/${uidb64}/${token}/`, {
                password: formData.password,
                confirm_password: formData.confirmPassword,
            });
            setAlert({ message: res.data.message, type: "success" });
            setFormData({ password: "", confirmPassword: "" });
            setTimeout(() => setAlert({ message: "", type: "" }), 5000);
        } catch (error) {
            setAlert({
                message: error.response?.data?.error || "Failed to reset password.",
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
                        <img src="/Frame2.png" alt="reset password page image" />
                    </div>
                    <div className="card-body column-2">
                        <h4 className="text-center mb-2">Set New Password</h4>
                        <p className="text-center text-secondary mb-4">
                            Enter your new password below.
                        </p>
                        {alert.message && (
                            <div className={`alert alert-${alert.type}`} role="alert">
                                {alert.message}
                            </div>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className="form-floating mb-3">
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className="form-control"
                                    placeholder="New Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="password">New Password</label>
                            </div>
                            <div className="form-floating mb-4">
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    className="form-control"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="confirmPassword">Confirm Password</label>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary w-100 mb-3"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;