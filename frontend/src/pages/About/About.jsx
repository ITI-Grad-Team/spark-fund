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

        <div className="values-background">
          <div className="values">
            <h2>Our Values</h2>

            <div className="value">
              <div className="first">
                <span>01</span>

                <h4>Make more value, not money.</h4>

                <p>
                  We focus on creative and delivering value to people across the
                  world.
                </p>
              </div>

              <div className="second">
                <span>02</span>

                <h4>Make it simple, not stressful.</h4>

                <p>
                  We make everything simple, clearly and accessible to everyone.
                </p>
              </div>

              <div className="third">
                <span>03</span>

                <h4>Be human, not devil.</h4>

                <p>
                  We do the right things with love and sincerity to create
                  sustainability.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="story">
          <div className="story-content">
            <h2>Our Story</h2>

            <p>
              April 2016 when I was working part-time at a travel agency. At
              that time, there was an environmental problem in my country that
              made many people angry and they created a petition on Change dot
              org and shared it on Facebook. I am very interested in the idea of
              this website, it is really helpful and it has a strong life
              impact. I wonder why there is not such a website in my country? I
              think every country should have such a website and the world
              should have more than one in the community. So I decided to quit
              my part-time job and start developing a platform for social
              movements.
            </p>

            <p>
              Although I have some experience developing websites on WordPress
              at my company, I still face many challenges to develop and design.
              I work almost 12 hours a day, after 10 months the first version is
              released. I kept improving it over the next 3 years with hundreds
              of changes and new features added.
            </p>

            <p>
              Today, hundreds of websites powered by Campoal are running around
              the world, millions of people are signing to support for the
              problem they care about, starting social movements and making
              changes to make their country a better place. People have used
              websites to change tax laws in France, raise funds to protect
              animals in Germany, speak out about social problems in Turkey,
              Calls for an end to war in Middle Eastern countries Fundraising to
              help children in Africa and more.
            </p>

            <p>
              By empowering entrepreneurs and organizations to give people the
              opportunity to talk about their problems, I believe that anyone
              can make the world a better place.
            </p>

            <p>Long Ha – Founder</p>
          </div>

          <div className="story-img">
            <img src="Mask Group2.png" alt="filler image" />
            <img src="Mask Group(2).png" alt="filler image" />
            <img src="Mask Group(1).png" alt="filler image" />
            <img src="Mask Group(3).png" alt="filler image" />
          </div>
        </div>
      </section>
    </section>
  );
};

export default About;
