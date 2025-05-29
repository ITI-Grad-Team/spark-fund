import "./Register.css";

const Register = () => {
  return (
    <section className="min-vh-100 d-flex justify-content-center align-items-center gradient-custom-3">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">
            <div className="card shadow" style={{ borderRadius: 15 }}>
              <div className="card-body p-5">
                <h2 className="text-center mb-4">
                  Create an account
                </h2>
                <form>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      id="username"
                      className="form-control"
                      placeholder="username"
                    />
                    <label htmlFor="username">Username</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      placeholder="Email"
                    />
                    <label htmlFor="email">Email</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="password"
                      id="password"
                      className="form-control"
                      placeholder="Password"
                    />
                    <label htmlFor="password">Password</label>
                  </div>
                  <div className="form-floating mb-4">
                    <input
                      type="password"
                      id="confirmPassword"
                      className="form-control"
                      placeholder="Confirm Password"
                    />
                    <label htmlFor="confirmPassword">Confirm Password</label>
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
                    >
                      Register
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
