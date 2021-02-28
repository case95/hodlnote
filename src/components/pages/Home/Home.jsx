import React, { Fragment } from "react";

import MyLink from "../../reausable/MyLink/MyLink";
import Card from "../../reausable/Card/Card";
import Container from "../../reausable/Container/Container";

import "./Home.css";

const Home = () => {
  const features = [
    {
      image: "https://en.bitcoin.it/w/images/en/2/29/BC_Logo_.png",
      alt: "Bitcoin",
      description: {
        title: "Bitcoin",
        description: "Lorem ipsum dolor sit amet.",
      },
    },
    {
      image:
        "https://www.logolynx.com/images/logolynx/b0/b0839301e62a21664ea82d24ab1a0414.png",
      alt: "Ethereum",
      description: {
        title: "Ethereum",
        description: "Lorem ipsum dolor sit amet.",
      },
    },
    {
      image:
        "https://cdn.iconscout.com/icon/free/png-256/cardano-1852412-1569633.png",
      alt: "Cardano",
      description: {
        title: "Cardano",
        description:
          "Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.",
      },
    },
  ];

  return (
    <div className="home">
      <div className="home-hero">
        <img
          src="https://cdn.discordapp.com/attachments/814812175436742667/814812257586380840/02ddd20767cfa24f488dcfdfda220b8f.png"
          alt="Tf"
          className="home-hero-image"
        />
        <Container className=" home-hero-content">
          <Fragment>
            <h1>BLABLABLA CRYPTO</h1>
            <p>
              Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem
              ipsum dolor sit amet.
            </p>
            <button className="home-hero-content-button">
              <MyLink>Browse!</MyLink>
            </button>
          </Fragment>
        </Container>
      </div>
      <hr />
      <div className="home-features">
        {features.map((feature) => {
          const { image, alt, description } = feature;
          return (
            <Card
              image={image}
              alt={alt}
              title={description.title}
              description={description.description}
            />
          );
        })}

        {/* <div className="home-features-card">test 1</div>
        <div className="home-features-card">test 2</div>
        <div className="home-features-card">test 3</div> */}
      </div>

      <hr></hr>

      <div className="home-start">
        <button className="home-start-button">
          <MyLink>Browse!</MyLink>
        </button>
        <div className="home-start-paragraph">
          <h1 className="home-start-paragraph-title">Start Test!</h1>
          <span className="home-start-paragraph-text">
            Lorem Ipsum Dolor Sit Amet
          </span>
        </div>
      </div>
      <hr></hr>
    </div>
  );
};

export default Home;
