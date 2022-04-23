import { useEffect, useRef, useState } from "react";
import { OrthographicCamera, OrbitControls } from "@react-three/drei";

/* Настраиваем камеру */
const Camera = (props) => {
  const [ready, setReady] = useState(false);

  const [zoom] = useState(60);
  const [position, setPosition] = useState([0, 0, 50]);
  const [target0, setTarget0] = useState([0, 0, 0]);

  const orbitRef = useRef();
  const cameraRef = useRef();

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (orbitRef && orbitRef.current && ready) {
      orbitRef.current.reset();
      setPosition([0, 0, 800]);
      setTarget0([0, 0, 0]);
      orbitRef.current.setPolarAngle((32 * Math.PI) / 180);
      orbitRef.current.setAzimuthalAngle((-45 * Math.PI) / 180);
    }
  }, [orbitRef, ready]);

  return (
    <>
      <OrthographicCamera
        ref={cameraRef}
        makeDefault
        {...{ zoom, position, rotation: [0, 0, 0] }}
      />
      <OrbitControls
        minPolarAngle={0}
        maxPolarAngle={Math.PI * 0.3}
        enableRotate
        enableZoom
        enablePan
        ref={orbitRef}
        target={target0}
      />
    </>
  );
};

export default Camera;
