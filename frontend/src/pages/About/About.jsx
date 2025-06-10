import "./About.css";

const About = () => {
  return (
    <section className="about-background-color">
      <section className="about">
        <div className="about-hero">
          <h1>World’s Petition Platform</h1>

          <p>
            We started in 2016 with the radical idea that anyone, anywhere,
            should be able to easily and securely to start their own petition.
            Today, we offer a trusted and easy-to-use platform for social
            movement accross the world.
          </p>

          <img src="/Frame9.svg" alt="About hero image" />
        </div>

        <div className="users-background">
          <div className="users">
            <div className="column-1">
              <p>Who use platform?</p>

              <h2>
                We believe that when everyone speaks out the problem of society
                and action together, the world will become a better place.
              </h2>
            </div>

            <div className="column-2">
              <div>
                <img src="" alt="" />

                <h4></h4>

                <p></p>
              </div>

              <div>
                <img src="" alt="" />

                <h4></h4>

                <p></p>
              </div>

              <div>
                <img src="" alt="" />

                <h4></h4>

                <p></p>
              </div>

              <div>
                <img src="" alt="" />

                <h4></h4>

                <p></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default About;
