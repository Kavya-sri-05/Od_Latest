import React from "react";
import "./Contributors.css";

const Contributors = ({ images }) => {
  return (
    <div className="contributors-container visible">
      <h3>CONTRIBUTORS</h3>
      <p>
        This Student OD Application was created by the following students as a
        summer internship project:
      </p>
      <div className="contributors-grid">
        {images.map((item) => {
          const filename = item.filename;
          const displayName = item.name;
          const roll = item.roll;
          return (
            <div className="contributor" key={filename}>
              <img
                src={`/${filename}`}
                alt={displayName}
                className="contributor-img"
              />
              <div className="contributor-name">{displayName}</div>
              <div className="contributor-roll">{roll}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Contributors;
