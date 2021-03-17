import React, { Fragment } from "react";
import { Link } from "react-router-dom";

// Importing custom components
import Card from "../../reausable/Card/Card";
import Container from "../../reausable/Container/Container";
import Button from "../../reausable/Button/Button";

import "./Home.css";

const Home = () => {
  const features = [
    {
      image: "https://en.bitcoin.it/w/images/en/2/29/BC_Logo_.png",
      alt: "Bitcoin",
      description: {
        title: "Bitcoin",
        text: "Lorem ipsum dolor sit amet.",
      },
    },
    {
      image:
        "https://www.logolynx.com/images/logolynx/b0/b0839301e62a21664ea82d24ab1a0414.png",
      alt: "Ethereum",
      description: {
        title: "Ethereum",
        text: "Lorem ipsum dolor sit amet.",
      },
    },
    {
      image:
        "https://cdn.iconscout.com/icon/free/png-256/cardano-1852412-1569633.png",
      alt: "Cardano",
      description: {
        title: "Cardano",
        text:
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
            <Link to="/browse" className="">
              <Button className="home-hero-content-button" type="link">
                {" "}
                Search!{" "}
              </Button>
            </Link>
          </Fragment>
        </Container>
      </div>
      <hr />
      <div className="home-features">
        {features.map((feature, index) => {
          const { image, alt, description } = feature;
          const { title, text } = description;
          return (
            <Card
              image={image}
              alt={alt}
              title={title}
              description={text}
              key={`card-${index}`}
            />
          );
        })}
      </div>

      <hr></hr>

      <div className="home-start">
        <Link to="/browse">
          <Button className="home-hero-content-button" type="link">
            {" "}
            Search!{" "}
          </Button>
        </Link>
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
