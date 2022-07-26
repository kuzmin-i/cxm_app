import React, { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import * as THREE from "three";
import handleClipping from "./utils/handle-clipping";
import useClippingStore from "../../store/clipping-planes";

const IFCModel = ({ setPercents = () => {} }) => {
  const { IFCLoader } = require("web-ifc-three/IFCLoader");

  const [isLoaded, setLoaded] = useState(false);

  const ifcLoader = new IFCLoader();

  const { get, set } = useThree(({ get, set }) => ({ get, set }));
  const { scene } = useThree();

  useEffect(() => {
    if (scene /* && !isLoaded*/) {
      ifcLoader.ifcManager.setWasmPath("web-ifc/");
      ifcLoader.ifcManager.setOnProgress((e) => {
        const { loaded, total } = e;
        const part = (loaded / total) * 100;

        setPercents(part);
      });
      ifcLoader.load("/models/ifc/rails_fragment_tekla.ifc", function (model) {
        console.log("model", model);

        /* */

        const { geometry } = model;

        let mesh = new THREE.Mesh(
          geometry,
          new THREE.MeshNormalMaterial({ color: 0xfff000 })
        );

        model.position.set(-1600, 0, 100);
        model.scale.set(12, 12, 12); //18
        mesh.name = "ifc";

        scene.add(model);
        setLoaded(true);
      });
    }
  }, [scene, isLoaded]);

  return <></>;
};

export default IFCModel;
