import "./About.css";

const About = () => {
  return (
    <section className="about-background-color">
      <section className="about">
        <div className="hero-background">
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
        </div>

        <div className="users">
          <div className="column-1">
            <p>Who use platform?</p>

            <h2>
              We believe that when everyone speaks out the problem of society
              and action together, the world will become a better place.
            </h2>
          </div>

          <div className="column-2">
            <div className="users-categories">
              <div className="users-img">
                <img src="/person-sign 2.svg" alt="person with a sign icon" />
              </div>

              <h4>Activists</h4>

              <p>
                Social activists can start a social movements and connect
                supporters in their communities.
              </p>
            </div>

            <div className="users-categories">
              <div className="users-img">
                <img src="/user-tie 2.svg" alt="user icon" />
              </div>

              <h4>Legislators</h4>

              <p>
                Decision makers at the highest levels of government are engaging
                with their constituents.
              </p>
            </div>

            <div className="users-categories">
              <div className="users-img">
                <img src="/users 1.svg" alt="community icon" />
              </div>

              <h4>Organizations</h4>

              <p>
                Leading organizations are advancing their causes and mobilizing
                new supporters.
              </p>
            </div>

            <div className="users-categories">
              <div className="users-img">
                <img src="/newspaper 2.svg" alt="newspaper icon" />
              </div>

              <h4>Reporters</h4>

              <p>
                Journalists are sourcing powerful stories and covering campaigns
                hundreds of times a day.
              </p>
            </div>
          </div>
        </div>

        <div className="voice">
          <h2>We believe in your voice</h2>

          <div className="paragraphs">
            <p>
              We're in here with a simple and clear mission is building a
              powerful platform for the change, helping people around the world
              to raise their voices, collecting signatures and contribute to the
              world.
            </p>

            <p>
              At Conikal, We believe that the power to change the world is in
              all human beings, we also believe that when everyone speaks out
              the problem of society and action together, the world will become
              a better place.
            </p>
          </div>

          <img src="/Mask Group.png" alt="protest image" />
        </div>
      </section>
    </section>
  );
};

export default About;
