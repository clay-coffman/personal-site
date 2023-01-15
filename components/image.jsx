import React from "react";
import styles from "@/components/image.module.css";

const Image = ({ photo }) => {
  return (
    <div className={styles.content}>
      <a href={photo.flickr_url} target="_blank" rel="noreferrer">
        <div className={styles.content_overlay}></div>
        <img alt={photo.title} {...photo} />

        <div className={styles.content_details}>
          <h3 className={styles.content_title}>{photo.title}</h3>
        </div>
      </a>
    </div>
  );
};

export default Image;
