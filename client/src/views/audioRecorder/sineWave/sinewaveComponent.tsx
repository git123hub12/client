import React from "react";
import Lottie from "lottie-react";
import animationData from "./logo_outline.json"; // Replace 'yourAnimation.json' with the path to your JSON file

const SineWavesComponent: React.FC = () => {
  return (
    <div>
      <Lottie
        animationData={animationData}
        loop
        autoplay
        style={{ width: 400, height: 400 }} // Adjust dimensions as needed
      />
    </div>
  );
};

export default SineWavesComponent;
