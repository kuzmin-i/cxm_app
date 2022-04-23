import React, { Suspense, useEffect, useMemo } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { Rhino3dmLoader } from "three/examples/jsm/loaders/3DMLoader";

const Rhino3dmLogo = ({ url, setActiveLayers, setObjects, ...props }) => {
  const [model, setModel] = useState(null);

  useEffect(() => {
    const _model = useLoader(Rhino3dmLoader, url, (loader) =>
      loader.setLibraryPath(
        "https://cdn.jsdelivr.net/npm/rhino3dm@0.15.0-beta/"
      )
    );

    setModel(_model);
  }, [url]);

  /*const model = useMemo(
    () =>
      useLoader(Rhino3dmLoader, url, (loader) =>
        loader.setLibraryPath(
          "https://cdn.jsdelivr.net/npm/rhino3dm@0.15.0-beta/"
        )
      ),
    [url]
  );*/

  useEffect(() => {
    if (model) {
      const { children = [], userData = {} } = model ? model : {};
      const { layers = [] } = userData;

      let formatLayers = layers.map(({ name, color }) => {
        return { name, color, visible: true };
      });

      setActiveLayers(formatLayers);

      let primitives = children.map((key, _i) => {
        const { userData = {} } = key ? key : {};
        const { attributes = {} } = userData ? userData : {};
        const { layerIndex = null } = attributes ? attributes : {};

        return {
          object: <primitive key={`prim:${_i}`} object={key} />,
          layerIndex,
        };
      });

      setObjects(primitives);
    }
  }, [model]);

  /*return <primitive object={model} />;*/
  return <group />;
};

const ObjectM1 = ({ setActiveLayers, objects, setObjects, hiddenLayers }) => {
  return (
    <Suspense fallback={null}>
      <group
        scale={[0.001, 0.001, 0.001]}
        rotation={[(-90 / 180) * Math.PI, 0, 0]}
      >
        <Rhino3dmLogo
          {...{ setActiveLayers, setObjects }}
          url="/models/m4.3dm"
        />

        {objects.map(({ object, layerIndex }, m) => {
          console.log("layerIndex", layerIndex);

          return !hiddenLayers.includes(layerIndex) ? object : <></>;
        })}
      </group>
    </Suspense>
  );
};

export default ObjectM1;
