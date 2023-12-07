// src/components/Card.js
import React from "react";
import styles from "./styles.module.css";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faCodeFork } from "@fortawesome/free-solid-svg-icons";

const Card = ({
  name,
  stars,
  fork,
  forksCount,
  homepage,
  html_url,
  language,
  description,
}) => {
  return (
    <div className={styles.card}>
      {html_url && (
        <img
          src={`${html_url}/blob/master/screenshot.png?raw=true`}
          className={styles.cardImgTop}
          alt={name}
          onerror="this.onerror=null;this.src='/assets/images/default-project-image.png';"
        />
      )}
      <div className={styles.cardBody}>
        <div className="row">
          <div className="col">{language}</div>
          <div className="col">
            <FontAwesomeIcon icon={faStar} />
            {stars}
          </div>
          <div className="col">
            <FontAwesomeIcon icon={faCodeFork} />
            {forksCount}
          </div>
        </div>
        <h5 className={styles.cardTitle}>{name}</h5>
        <p className={styles.cardText}>{description}</p>
      </div>
      <div className={styles.cardFooter}>
        {homepage && (
          <a href={homepage} className={clsx(styles.btn, styles.btnPrimary)}>
            Try it out!
          </a>
        )}
        {html_url && (
          <a href={html_url} className={clsx(styles.btn, styles.btnPrimary)}>
            GitHub
          </a>
        )}
      </div>
    </div>
  );
};

export default Card;
