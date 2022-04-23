import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

import ObjectM1 from "../models/m1";
import Camera from "../scene-core/camera";

import Layers from "../ui/layers";

const Scene = () => {
  const [layers, setActiveLayers] = useState(null);
  const [hiddenLayers, setHiddenLayers] = useState([]);
  const [objects, setObjects] = useState([]);

  return (
    <>
      {layers && (
        <Layers data={layers} {...{ hiddenLayers, setHiddenLayers }} />
      )}

      <Canvas>
        <Camera
          invalidateFrameloop={true}
          dpr={[1, 2]}
          raycaster={{ enabled: true }}
          colorManagement={false}
          gl={{
            powerPreference: "high-performance",
            antialias: true,
            stencil: false,
          }}
        />

        <ambientLight />
        <pointLight position={[10, 10, 10]} />

        <ObjectM1 {...{ setActiveLayers, objects, setObjects, hiddenLayers }} />
      </Canvas>
    </>
  );
};

export default Scene;
