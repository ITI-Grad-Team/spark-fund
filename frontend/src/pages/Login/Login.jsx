import './Login.css';


const Login = () => {
  return (
    <>
      <section className="min-vh-100 d-flex justify-content-center align-items-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-4 col-xl-4">
              <div className="card shadow" style={{ borderRadius: 15 }}>
                <div className="card-body p-4">
                  <h4 className="text-center mb-2">Welcome</h4>
                  <p className='text-center text-secondary mb-4'>Please login to your account</p>
                  <form>
                    <div className="form-floating mb-3">
                      <input
                        type="email"
                        id="email"
                        className="form-control"
                        placeholder="Email"
                        required
                      />
                      <label htmlFor="email">Email</label>
                    </div>
                    <div className="form-floating mb-4">
                      <input
                        type="password"
                        id="password"
                        className="form-control"
                        placeholder="Password"
                        required
                      />
                      <label htmlFor="password">Password</label>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary w-100 mb-3"
                    >
                      Login
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-primary w-100 mb-2"
                      style={{ backgroundColor: "#3b5998", color: "white" }}
                      onClick={() => {
                        alert("Login with Facebook clicked!");
                      }}
                    >
                      <i className="bi bi-facebook me-2"></i> Login with
                      Facebook
                    </button>

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