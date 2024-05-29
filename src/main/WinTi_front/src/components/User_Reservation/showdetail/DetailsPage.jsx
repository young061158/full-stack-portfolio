import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const DetailsPage = (showDetails) => {
  const { id } = useParams();
  const navigate = useNavigate();

  
  return (
    <div className="Details-page_CP">
      <div className="show-Info">
        <textarea
          className="form-control"
          id="floatingTextarea"
          value={
            showDetails.showDetails.performance?.discriptionText ||
            "No description available"
          }
          readOnly
        ></textarea>
      </div>
      <div className="actor-section">
        <div className="actor-title">출연진</div>
        <div className="actor-images">
          {showDetails.showDetails.actor.map((actor) => (
            <div className="actor">
              <img
                src={
                  actor.actorPath
                    ? `http://localhost:8080${actor.actorPath}`
                    : "#"
                }
                alt={`${actor.actorPath}`}
                className="Ellipse"
              />
              <div className="actor-name">{actor.actorName}</div>
              <div className="actor-character-name">{actor.characterName}</div>
            </div>
          ))}
        </div>
      </div>
      <img
        src={
          showDetails.showDetails.performance?.discriptionImg
            ? `http://localhost:8080${showDetails.showDetails.performance.discriptionImg}`
            : "#"
        }
        alt="공연소개"
        className="show_mainposter"
      />

      <label className="sub-guide">관람객 주의사항</label>

      <article className="article">
        {showDetails.showDetails.performance?.caveats || "No caveats available"}
      </article>
    </div>
  );
};

export default DetailsPage;
