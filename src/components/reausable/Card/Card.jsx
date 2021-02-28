import React from "react";

// Importing style
import "./Card.css";

const Card = ({ image, alt, title, description }) => {
  return (
    <div className="card">
      <div className="card-image">
        <img src={image} alt={alt} className="card-image-content" />
      </div>
      <div className="card-description">
        <h1 className="card-description-title">{title}</h1>
        <p className="card-description-text">{description}</p>
      </div>
    </div>
  );
};

export default Card;
