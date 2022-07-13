import { useEffect, useRef, useState } from "react";
import {
  OrthographicCamera,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { useThree } from "@react-three/fiber";

/* Настраиваем камеру */
const Camera = (props = {}) => {
  const { viewType } = props;

  /* Шаг 1: refs и useThree */

  const perspectiveCam = useRef();
  const orthoCam = useRef();
  const { get, set } = useThree(({ get, set }) => ({ get, set }));

  useEffect(() => {
    const changeView = () => {
      setTarget0([0, 0, 0]);

      if (viewType === "perspective") {
        set({ camera: perspectiveCam.current });

        setZoom(20);
        setPosition([-500, 900, 800]);
      } else {
        set({ camera: orthoCam.current });

        if (viewType === "top") {
          setZoom(6);
          setPosition([0, 1900, 0]);
        } else {
          setZoom(6);
          setPosition([-500, 900, 800]);
        }
      }
    };

    changeView();
  }, [get, set, viewType]);

  const [zoom, setZoom] = useState(0);
  const [position, setPosition] = useState([0, 0, 50]);
  const [target0, setTarget0] = useState([0, 0, 0]);

  return (
    <>
      <PerspectiveCamera
        name="perspective"
        ref={perspectiveCam}
        fov={100}
        {...{ zoom, position, rotation: [0, 0, 0] }}
      />

      <OrthographicCamera
        name="ortho"
        ref={orthoCam}
        {...{ zoom, position, rotation: [0, 0, 0] }}
      />

      <OrbitControls
        minPolarAngle={0}
        maxPolarAngle={Math.PI * 0.7}
        enableRotate={viewType === "top" ? false : true}
        enableZoom
        enablePan
        rev
        panSpeed={0.1}
        target={target0}
        makeDefault
      />
    </>
  );
};

export default Camera;
