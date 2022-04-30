import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import styled from "styled-components";

import { Grid } from "antd";

import ObjectM1 from "../models/m1";
import Camera from "../scene-core/camera";

import Layers from "../ui/layers";
import BottomNav from "../ui/bottom-nav";
import ObjectM2 from "../models/m2-common";
import ObjectM3 from "../models/m3-rails";
import ObjectM3Wire from "../models/m3-rails_wire";
import ObjectM4 from "../models/m4-mesh";
import { useEffect } from "react";
import Analyze from "../models/analyze";
import ObjectM4Wire from "../models/m4-mesh_wire";

const { useBreakpoint } = Grid;

const LayersWrapper = styled.div`
  position: fixed;
  left: 80px;
  bottom: 40px;
  width: 100%;
  max-width: 250px;

  display: flex;
  flex-direction: column;

  z-index: 10;

  && > * + * {
    margin-top: 10px;
  }
`;

const Scene = () => {
  const screens = useBreakpoint();

  const [layers, setActiveLayers] = useState(null);
  const [hiddenLayers, setHiddenLayers] = useState([]);

  /* Common */
  const [layers1, setLayers1] = useState(null);
  const [hiddenLayers1, setHiddenLayers1] = useState([]);
  const [isReady1, setReady1] = useState(false);

  /* Rails */
  const [layers2, setLayers2] = useState(null);
  const [hiddenLayers2, setHiddenLayers2] = useState([]);
  const [hideLayer2, setHideLayer2] = useState(false);
  const [isReady2, setReady2] = useState(false);

  /* Mesh */
  const [layers3, setLayers3] = useState(null);
  const [hiddenLayers3, setHiddenLayers3] = useState([]);
  const [hideLayer3, setHideLayer3] = useState([]);
  const [isReady3, setReady3] = useState(false);

  /* */
  const [view, setView] = useState("ortho");

  const [loadingObj, setLoadingObj] = useState(null);
  const [percentsLoaded, setPercentsLoaded] = useState(0);

  return (
    <>
      <BottomNav
        {...{
          view,
          setView,
          loadingObj,
          percentsLoaded,
          loadingVisible: !isReady3,
        }}
      />

      {screens.sm && (
        <LayersWrapper>
          {layers1 && (
            <Layers
              data={layers1}
              {...{
                hiddenLayers: hiddenLayers1,
                setHiddenLayers: setHiddenLayers1,
              }}
            />
          )}
          {layers2 && isReady1 && (
            <Layers
              one
              data={layers2}
              {...{
                hiddenLayers: hiddenLayers2,
                setHiddenLayers: setHiddenLayers2,
              }}
            />
          )}
          {layers3 && isReady2 && (
            <Layers
              data={layers3}
              {...{
                hiddenLayers: hiddenLayers3,
                setHiddenLayers: setHiddenLayers3,
              }}
            />
          )}
        </LayersWrapper>
      )}

      <Canvas>
        <Camera
          invalidateFrameloop={true}
          dpr={[1, 2]}
          raycaster={{ enabled: true }}
          colorManagement={false}
          view={view}
          gl={{
            powerPreference: "high-performance",
            antialias: true,
            stencil: false,
          }}
        />

        <ambientLight />
        <pointLight position={[50, 50, 60]} intensity={8} />
        {/*<mesh position={[50, 50, 60]} scale={[10, 10, 10]}>
          <planeBufferGeometry />
          <meshStandardMaterial color={"red"} />
        </mesh>*/}
        {/*null && (
          <ObjectM1
            {...{ setActiveLayers, objects, setObjects, hiddenLayers }}
          />
        )*/}

        <Analyze />
        {
          <ObjectM2
            setLayers={setLayers1}
            hiddenLayers={hiddenLayers1}
            setReady={setReady1}
            setPercentsLoaded={setPercentsLoaded}
            setLoadingObj={() => setLoadingObj("Layer 1 (Lines)")}
          />
        }
        {isReady1 && (
          <ObjectM3Wire
            setLayers={setLayers2}
            hiddenLayers={hiddenLayers2}
            setReady={setReady2}
            setPercentsLoaded={setPercentsLoaded}
            setLoadingObj={() => setLoadingObj("Layer 2 (Rails)")}
          />
        )}
        {isReady1 && null && (
          <ObjectM3
            setLayers={setLayers2}
            hiddenLayers={hiddenLayers2}
            setReady={setReady2}
            setPercentsLoaded={setPercentsLoaded}
            setLoadingObj={() => setLoadingObj("Layer 2 (Rails)")}
          />
        )}
        {isReady2 && (
          <ObjectM4Wire
            setLayers={setLayers3}
            hiddenLayers={hiddenLayers3}
            setReady={setReady3}
            setPercentsLoaded={setPercentsLoaded}
            setLoadingObj={() => setLoadingObj("Layer 3 (Roof Mesh)")}
          />
        )}
        {isReady2 && null && (
          <ObjectM4
            setLayers={setLayers3}
            hiddenLayers={hiddenLayers3}
            setReady={setReady3}
            setPercentsLoaded={setPercentsLoaded}
            setLoadingObj={() => setLoadingObj("Layer 3 (Roof Mesh)")}
          />
        )}
      </Canvas>
    </>
  );
};

export default Scene;
