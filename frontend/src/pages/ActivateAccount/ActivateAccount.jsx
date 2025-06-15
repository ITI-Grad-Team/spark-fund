
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/config";
import { ClipLoader } from "react-spinners";

const ActivateAccount = () => {
    const { uidb64, token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const activateAccount = async () => {
            try {
                const response = await axiosInstance.get(`/activate/${uidb64}/${token}/`);
                setStatus("success");
                setMessage(response.data.message || "Your account has been successfully activated!");
                setTimeout(() => navigate("/login"), 3000); // Redirect to login after 3 seconds
            } catch (error) {
                setStatus("error");
                setMessage(
                    error.response?.data?.error ||
                    "Invalid or expired activation link. Please request a new one."
                );
            }
        };
        activateAccount();
    }, [uidb64, token, navigate]);

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 text-center" style={{ maxWidth: "400px" }}>
                {status === "loading" && (
                    <>
                        <ClipLoader color="#007bff" size={50} />
                        <p className="mt-3">Activating your account...</p>
                    </>
                )}
                {status === "success" && (
                    <>
                        <h3 className="text-success">Success!</h3>
                        <p>{message}</p>
                        <p>Redirecting to login...</p>
                    </>
                )}
                {status === "error" && (
                    <>
                        <h3 className="text-danger">Error</h3>
                        <p>{message}</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate("/register")}
                        >
                            Register Again
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ActivateAccount;
