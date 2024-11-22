import React, { useState, useEffect } from "react";
import styles from "./ScrollToTopButton.module.css";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    setIsClicked(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Remove the clicked state after the animation duration
    setTimeout(() => setIsClicked(false), 600); // Match animation duration
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    isVisible && (
      <button
        className={`${styles.scrollToTopButton} ${
          isClicked ? styles.clicked : ""
        }`}
        onClick={scrollToTop}
      >
        ↑
      </button>
    )
  );
};

export default ScrollToTopButton;
