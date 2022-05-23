import { useEffect, useRef, useState } from "react";
import {
  OrthographicCamera,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import * as THREE from "three";

/* Настраиваем камеру */
const Camera = (props = {}) => {
  const { view, setNewPointPosition = () => {}, ...otherProps } = props;

  const [ready, setReady] = useState(false);

  const [zoom] = useState(10);
  const [position, setPosition] = useState([0, 0, 50]);
  const [target0, setTarget0] = useState([0, 0, 0]);

  const orbitRef = useRef();
  const cameraRef = useRef();
  const camera1Ref = useRef();

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (orbitRef && orbitRef.current && view && ready) {
      orbitRef.current.reset();
      setPosition([0, 0, 800]);
      setTarget0([0, 0, 0]);

      if (view === "perspective") {
        orbitRef.current.setPolarAngle((32 * Math.PI) / 180);
        orbitRef.current.setAzimuthalAngle((-45 * Math.PI) / 180);
      }

      if (view === "ortho") {
        orbitRef.current.setPolarAngle((32 * Math.PI) / 180);
        orbitRef.current.setAzimuthalAngle((-45 * Math.PI) / 180);
      }

      if (view === "top") {
        orbitRef.current.setPolarAngle((-90 * Math.PI) / 180);
        orbitRef.current.setAzimuthalAngle((0 * Math.PI) / 180);
      }
    }
  }, [orbitRef, ready, view]);

  return (
    <>
      {view === "ortho" || view === "top" ? (
        <OrthographicCamera
          ref={cameraRef}
          makeDefault
          {...{ zoom, position, rotation: [0, 0, 0] }}
        />
      ) : (
        <perspectiveCamera
          ref={camera1Ref}
          makeDefault
          {...{ zoom, position, rotation: [0, 0, 0] }}
        />
      )}
      <OrbitControls
        minPolarAngle={0}
        maxPolarAngle={Math.PI * 0.7}
        enableRotate={view === "ortho"}
        enableZoom
        enablePan
        ref={orbitRef}
        target={target0}
        makeDefault
      />
    </>
  );
};

export default Camera;
