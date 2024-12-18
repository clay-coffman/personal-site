import "aframe";
import "aframe-particle-system-component";
import { Entity, Scene } from "aframe-react";
import React from "react";

export default function AFrameComponent() {
  return (
    <Scene>
      <Entity
        primitive="a-box"
        color="red"
        position="0 0.5 -3"
        rotation="0 45 0"
      />
      <Entity primitive="a-sky" color="#6EBAA7" />
      <Entity primitive="a-camera">
        <Entity primitive="a-cursor" />
      </Entity>
    </Scene>
  );
}
