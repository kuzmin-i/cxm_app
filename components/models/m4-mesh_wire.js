import React, { Suspense, useEffect, useMemo, useState } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import { Rhino3dmLoader } from "three/examples/jsm/loaders/3DMLoader";

import { MeshStandardMaterial } from "three";

const Loader = ({ setPercentsLoaded, setLoadingObj }) => {
  const { progress } = useProgress();

  useEffect(() => {
    setPercentsLoaded(progress);
    setLoadingObj();
  }, [progress]);

  return <group />;
};

const Rhino3dmLogo = ({ url, setLayers, setObjects, setReady, ...props }) => {
  const model = useLoader(Rhino3dmLoader, url, (loader) =>
    loader.setLibraryPath("https://cdn.jsdelivr.net/npm/rhino3dm@0.15.0-beta/")
  );

  useEffect(() => {
    if (model) {
      setReady(true);

      const { children = [], userData = {} } = model ? model : {};
      const { layers = [] } = userData;

      let formatLayers = layers.map(({ name, color }) => {
        return { name, color, visible: true };
      });

      let material = new MeshStandardMaterial({
        color: "blue",
        transparent: true,
        opacity: 0.7,
      });

      setLayers(formatLayers);

      let primitives = children.map((key, _i) => {
        const { userData = {} } = key ? key : {};
        const { attributes = {} } = userData ? userData : {};
        const { layerIndex = null } = attributes ? attributes : {};

        return {
          object: (
            <primitive material={material} key={`prim:${_i}`} object={key} />
          ),
          layerIndex,
        };
      });

      setObjects(primitives);
    }
  }, [model]);

  return <group />;
};

const ObjectM4Wire = ({
  setLayers = () => {},
  hiddenLayers = [],
  setReady = () => {},
  setPercentsLoaded = () => {},
  setLoadingObj = () => {},
  visible,
}) => {
  const [objects, setObjects] = useState([]);

  return (
    <Suspense fallback={<Loader {...{ setPercentsLoaded, setLoadingObj }} />}>
      <group
        scale={[0.001, 0.001, 0.001]}
        rotation={[(-90 / 180) * Math.PI, 0, 0]}
      >
        <Rhino3dmLogo
          {...{ setObjects, setLayers, setReady }}
          url="/models/big_reduced_mesh.3dm"
        />

        {visible && (
          <group position={[0, 0, -1458]}>
            {objects.map(({ object, layerIndex }, m) => {
              return !hiddenLayers.includes(layerIndex) ? object : <></>;
            })}
          </group>
        )}
      </group>
    </Suspense>
  );
};

export default ObjectM4Wire;
