import { useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import handleClipping from "./utils/handle-clipping";
import useClippingStore from "../../store/clipping-planes";
import { Box, Point, Points, Line } from "@react-three/drei";
import { BufferAttribute } from "three";

const Clip = () => {
  const { scene, gl, camera } = useThree();
  gl.localClippingEnabled = true;

  const planes = useClippingStore(({ planes }) => planes);

  const [model, setModel] = useState(null);
  const [points, setPoints] = useState(null);

  function init() {
    // load the model
    const loader = new GLTFLoader();
    loader.load("/models/gltf/sphere.gltf", (gltf) => {
      const model = gltf.scene.children[0];
      const mergedGeometry = model.geometry;
      model.material = new THREE.MeshBasicMaterial();
      model.position.set(20, 0, 0);
      model.scale.set(16, 16, 16);

      const clonedGeometry = model.geometry.clone();
      clonedGeometry.applyMatrix4(model.matrix);
      const ptCloud = clonedGeometry.attributes.position.array;
      /*let ptCout = ptCloud.length / 3;
      let ptList = [];
      for (let i = 0; i < ptCout; i++) {
        

        let p = [ptCloud[i * 3] * 10, ptCloud[i * 3 + 1] * 10, ptCloud[i * 3 + 2] * 10];

        ptList.push(p);
      }*/

      setPoints(new BufferAttribute(new Float32Array(ptCloud), 3));

      handleClipping({ scene, model, init: true });
      setModel(model);
    });
  }

  useEffect(() => {
    if (model) {
      handleClipping({ scene, model });
    }
  }, [model, planes, scene]);

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      {points && (
        <points>
          <bufferGeometry>
            <bufferAttribute attach={"attributes-position"} {...points} />
          </bufferGeometry>
          <pointsMaterial
            size={1}
            threshold={0.1}
            color={0xff00ff}
            sizeAttenuation={true}
          />
        </points>
      )}
    </>
  );
};

export default Clip;
