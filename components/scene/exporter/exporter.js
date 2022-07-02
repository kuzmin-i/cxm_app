import { useEffect } from "react";
import { toRenderble } from "./toRenderble";
import { OBJExporter } from "three/examples/jsm/exporters/OBJExporter";
import { ColladaExporter } from "three/examples/jsm/exporters/ColladaExporter";
import useStore from "../../../store/store";
import { useThree } from "@react-three/fiber";

const useExporter = () => {
  const { scene } = useThree();

  const ObjFile = useStore(({ ObjFile }) => ObjFile);
  const setObjFile = useStore(({ setObjFile }) => setObjFile);

  const setSceneData = useStore(({ setSceneData }) => setSceneData);

  const exportDataUpdate = useStore(({ exportDataUpdate }) => exportDataUpdate);
  const setExportDataUpdate = useStore(
    ({ setExportDataUpdate }) => setExportDataUpdate
  );

  function save(blob, filename) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }

  useEffect(() => {
    if (scene && exportDataUpdate) {
      const copyScene = toRenderble(scene);

      const exporter = new OBJExporter();
      const result = exporter.parse(copyScene);

      console.log("data scene", scene);

      save(new Blob([result], { type: "text/plain" }), "data.obj");
    }
  }, [scene, exportDataUpdate]);

  return <mesh></mesh>;
};

const Exporter = () => {
  useExporter();

  return <mesh></mesh>;
};

export default Exporter;
