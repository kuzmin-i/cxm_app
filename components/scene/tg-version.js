import React, { useRef, useState, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import styled from "styled-components";

import { Grid } from "antd";

import Camera from "../scene-core/camera";

//import ObjectM2 from "../models/m2-common";
import { OBJExporter } from "three/examples/jsm/exporters/OBJExporter";

import { Box, TransformControls, Plane } from "@react-three/drei";
import useStore from "../../store/store";
import Exporter3dm from "./exporter/3dm-exporter";
import SceneExportPreparation from "./exporter/scene-export-preparation";

//import ObjectM4Wire from "../models/m4-mesh_wire";
//import MeshM2 from "../models/m2-common-json";
import IFCModel from "../models/ifc-model";
import Clip from "../models/clip";
import useClippingStore from "../../store/clipping-planes";
import Mouse from "../models/mouse";
import BufferModel from "../models/buffer-model";

import useSWR from "swr";
import CursorProvider from "../providers/cursor-providers";

//import path, { dirname } from "path";

const MeasurerCanvas = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  pointer-events: none;

  z-index: 100;
`;

const { useBreakpoint } = Grid;

const LayersWrapper = styled.div`
  position: fixed;
  left: 40px;
  bottom: 140px;
  width: 100%;
  max-width: 250px;

  display: flex;
  flex-direction: column;

  z-index: 10;

  && > * + * {
    margin-top: 10px;
  }
`;

const Scene = ({ viewType }) => {
  const [percents, setPercents] = useState(0);

  const way = "s2"; // l - local, s - server

  /* ***** */

  /* Approach 1 */
  const [JSONlinks, setJSONllinks] = useState();

  /*if (way === "l") {
    const fetcher = (url) => fetch(url).then((res) => res.json());
    const { data: JSONlinks_data = [] } = useSWR("/api/readfiles", fetcher);

    useEffect(() => {
      if (JSONlinks_data) {
        setJSONllinks(JSONlinks_data);
      }
    }, [JSONlinks_data]);
  }*/

  /* Approach 2 */

  /*if (way === "s") {
    useEffect(() => {
      setJSONllinks(["https://mmodel.contextmachine.online:8181/"]);
    }, []);
  }*/

  /*if (way === "s2") {*/
    useEffect(() => {
      fetch("https://mmodel.contextmachine.online:8181/get_keys")
        .then((response) => {
          return response.json();
        })
        .then((keys) => {
          console.log("keys", keys);

          setJSONllinks(
            keys.map((item) => {
              return `https://mmodel.contextmachine.online:8181/get_part/${item}`;
            })
          );
        });
    }, []);
  /* } */

  const meshRef = useRef();

  const [windowSize, setWindowSize] = useState([1920, 1080]);

  const [measurer2d, setMeasurer2d] = useState(`M0 0`);

  const measurerRef = useRef();
  useEffect(() => {
    setWindowSize([windowSize[0], windowSize[1]]);
  }, []);

  return (
    <>
      <MeasurerCanvas>
        <svg
          width={windowSize[0]}
          height={windowSize[1]}
          viewBox={`0 0 ${windowSize[0]} ${windowSize[1]}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_3003_13616)">
            <path d={measurer2d} stroke="black" />
          </g>
          <defs>
            <clipPath id="clip0_3003_13616">
              <rect width={windowSize[0]} height={windowSize[1]} fill="white" />
            </clipPath>
          </defs>
        </svg>
      </MeasurerCanvas>

      <CursorProvider>
        <Canvas ref={meshRef}>
          <Camera {...{ viewType }} />

          <ambientLight />
          <pointLight position={[50, 50, 60]} intensity={8} />

          <Mouse {...{ measurer2d, setMeasurer2d }} />

          {/*<BufferModel />*/}
          {JSONlinks &&
            JSONlinks.length > 0 &&
            JSONlinks.map((path, i) => {
              return <BufferModel way={way} key={`b:${i}`} path={path} />;
            })}
          {/*  <IFCModel {...{ setPercents }} /> */}
        </Canvas>
      </CursorProvider>
    </>
  );
};

export default Scene;
