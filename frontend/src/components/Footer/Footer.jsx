import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <section className="container-fluid footer-background">
      <section className="footer container">
        <section className="footer-links">
          <div className="col-1">
            <h4>What is Campoal?</h4>

            <p>
              Campoal is a completed WordPress theme used to create Petition
              Platform, Foundation and Non-profit website where anyone can be
              start a social movement, collect supporters and fundraising to
              change something in society.
            </p>

            <div className="col-1-images">
              <img src="/GDPR compliant - GDPR Copy 5.svg" alt="GDPR icon" />
              <img
                src="/norton-by-symantec-vector-logo 1.svg"
                alt="norton logo"
              />
              <img src="/stripe-seeklogo.com 1.svg" alt="stripe logo" />
              <img src="/Group 8.svg" alt="paypal logo" />
            </div>
          </div>

          <div className="col-2">
            <h4>Company</h4>

            <div className="links">
              <Link to="/">About</Link>

              <Link to="/">Contact</Link>

              <Link to="/">Careers</Link>

              <Link to="/">Impact</Link>

              <Link to="/">Testimonials</Link>

              <Link to="/">Team Members</Link>
            </div>
          </div>

          <div className="col-3">
            <h4>Resources</h4>

            <div className="links">
              <Link to="/">Guide</Link>

              <Link to="/">FAQs</Link>

              <Link to="/">Press Kets</Link>

              <Link to="/">Compliance</Link>

              <Link to="/">Privacy Policy</Link>

              <Link to="/">Terms of Services</Link>
            </div>
          </div>

          <div className="col-4">
            <h4>Community</h4>

            <div className="links">
              <Link to="/">Shop</Link>

              <Link to="/">Blog</Link>

              <Link to="/">Forum</Link>

              <Link to="/">Membership</Link>

              <Link to="/">Help Center</Link>

              <Link to="/">Support Desk</Link>
            </div>
          </div>
        </section>

        <section className="footer-socials">
          <p>© 2025 Campoal. Powered by Python ITI 1st Team</p>

          <div className="social-links">
            <a href="">
              <img src="/Facebook_black 1.svg" alt="Facebook icon" />
            </a>
            <a href="">
              <img src="/Twitter_black 1.svg" alt="Twitter icon" />
            </a>
            <a href="">
              <img src="/Youtube_black 1.svg" alt="Youtube icon" />
            </a>
            <a href="">
              <img src="/Medium_black 1.svg" alt="Medium icon" />
            </a>
          </div>
        </section>
      </section>
    </section>
  );
};

export default Footer;
