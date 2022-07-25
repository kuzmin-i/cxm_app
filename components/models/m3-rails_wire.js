import React, { Suspense, useEffect, useMemo, useState } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import { Rhino3dmLoader } from "three/examples/jsm/loaders/3DMLoader";
import * as THREE from "three";

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
  const [model, setModel] = useState(null);

  useEffect(() => {
    const model = useLoader(Rhino3dmLoader, url, (loader) =>
      loader.setLibraryPath(
        "https://cdn.jsdelivr.net/npm/rhino3dm@0.15.0-beta/"
      )
    );

    setModel(model);
  }, []);

  useEffect(() => {
    if (model) {
      setReady(true);

      const { children = [], userData = {} } = model ? model : {};
      const { layers = [] } = userData;

      let formatLayers = layers.map(({ name, color }) => {
        return { name, color, visible: true };
      });

      setLayers(formatLayers);

      let primitives = children.map((key, _i) => {
        const { userData = {} } = key ? key : {};
        const { attributes = {} } = userData ? userData : {};
        const { layerIndex = null } = attributes ? attributes : {};

        let material = new MeshStandardMaterial({
          color: "#D8CDA5",
          opacity: 0.8,
          side: THREE.DoubleSide,
          transparent: true,
        });

        let material1 = new MeshStandardMaterial({
          color: "#696969",
          opacity: 0.8,
          side: THREE.DoubleSide,
          transparent: true,
        });

        return {
          object: (
            <primitive
              key={`prim:${_i}`}
              object={key}
              material={layerIndex === 0 ? material : material1}
            />
          ),
          layerIndex,
        };
      });

      setObjects(primitives);
    }
  }, [model]);

  return <group />;
};

const ObjectM3Wire = ({
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
          url="/models/big_rails_minmin1.3dm"
        />

        {visible &&
          objects.map(({ object, layerIndex }, m) => {
            return !hiddenLayers.includes(layerIndex) ? object : <></>;
          })}
      </group>
    </Suspense>
  );
};

export default ObjectM3Wire;
