import React, { useEffect, useState } from "react";

const ResumeVRExperience = () => {
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        script.onerror = () => reject(`Failed to load script at ${src}`);
        document.head.appendChild(script);
      });
    };

    loadScript("https://aframe.io/releases/0.5.0/aframe.min.js")
      .then(() =>
        loadScript(
          "https://unpkg.com/aframe-environment-component@1.1.0/dist/aframe-environment-component.min.js"
        )
      )
      .then(() => setIsReady(true))
      .catch(setLoadError);

    return () => {
      // Clean up scripts
      document.querySelectorAll('script[src*="aframe"]').forEach((script) => {
        document.head.removeChild(script);
      });
    };
  }, []);

  if (loadError) {
    return <p>Error: {loadError}</p>;
  }

  if (!isReady) {
    return null; // or return <></>;
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <a-scene>
        <a-image
          key="1"
          src="/assets/p1.jpg"
          rotation="0 30 0"
          position="-2 1.5 -1.1"
        ></a-image>
        <a-image
          key="2"
          src="/assets/p2.jpg"
          rotation="0 15 0"
          position="-1 1.5 -1.5"
        ></a-image>
        <a-image
          key="3"
          src="/assets/p3.jpg"
          rotation="0 0 0"
          position="0 1.5 -1.7"
        ></a-image>
        <a-image
          key="4"
          src="/assets/p4.jpg"
          rotation="0 -15 0"
          position="1 1.5 -1.5"
        ></a-image>
        <a-image
          key="5"
          src="/assets/p5.jpg"
          rotation="0 -30 0"
          position="2 1.5 -1.1"
        ></a-image>
        <a-entity environment="preset: tron; dressingAmount: 50"></a-entity>
      </a-scene>
    </div>
  );
};

export default ResumeVRExperience;
