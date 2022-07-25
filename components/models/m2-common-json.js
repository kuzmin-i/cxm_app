import { Point, PointMaterial, Points } from "@react-three/drei";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import * as THREE from "three";
import curveToPoints from "./utils/handle-curve-to-points";

const Line = ({ points = [] }) => {
  const ref = useRef();
  useLayoutEffect(() => {
    ref.current.geometry.setFromPoints(
      points.map((point) => new THREE.Vector3(...point))
    );
  }, [points]);

  return (
    <line ref={ref}>
      <bufferGeometry />
      <lineBasicMaterial color="hotpink" />
    </line>
  );
};

/*const file = "/models/big_reduced_mesh.3dm";*/
const file = "/models/big_common.3dm";

function meshToThreejs(mesh, material) {
  const loader = new THREE.BufferGeometryLoader();
  const geometry = loader.parse(mesh.toThreejsJSON());

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        attach={"material"}
        color={"blue"}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}

const lnCfgs = {
  color: "lightgrey",
  lineWidth: 0.3,
};

const MeshM2 = () => {
  const [meshes, setMeshes] = useState([]);

  useEffect(() => {
    if (window && window.rhino3dm()) {
      window.rhino3dm().then(async (m) => {
        let rhino = m;

        const checkInstance = (obj, type) => {
          switch (type) {
            case "mesh":
              return obj instanceof rhino.Mesh;
            case "lineCurve":
              return obj instanceof rhino.LineCurve;
            case "polylineCurve":
              return obj instanceof rhino.PolylineCurve;
            case "polyCurve":
              return obj instanceof rhino.PolyCurve;
            case "nurbscurve":
              return obj instanceof rhino.NurbsCurve;
            default:
              return false;
          }
        };

        let res = await fetch(file);
        let buffer = await res.arrayBuffer();

        let arr = new Uint8Array(buffer);
        let doc = rhino.File3dm.fromByteArray(arr);

        let objects = doc.objects();

        let material = new THREE.MeshNormalMaterial();

        let preparedObjects = [];

        for (let i = 0; i < objects.count; i++) {
          let mesh = objects.get(i).geometry();

          if (mesh instanceof rhino.Mesh) {
            /* Mesh */
            let threeMesh = meshToThreejs(mesh, material);

            preparedObjects.push(threeMesh);
          } else if (
            mesh instanceof rhino.LineCurve ||
            mesh instanceof rhino.NurbsCurve ||
            mesh instanceof rhino.PolylineCurve ||
            mesh instanceof rhino.PolyCurve
          ) {
            /* Polyline */

            const curveToPoints = (curve, pointLimit = 5000) => {
              let rhino3dm = rhino;

              let pointCount = pointLimit;
              let rc = [];
              let ts = [];

              if (curve instanceof rhino3dm.LineCurve) {
                return [curve.pointAtStart, curve.pointAtEnd];
              }

              if (curve instanceof rhino3dm.PolylineCurve) {
                pointCount = curve.pointCount;
                for (let i = 0; i < pointCount; i++) {
                  rc.push(curve.point(i));
                }
                return rc;
              }

              if (curve instanceof rhino3dm.PolyCurve) {
                let segmentCount = curve.segmentCount;
                for (let i = 0; i < segmentCount; i++) {
                  let segment = curve.segmentCurve(i);
                  let segmentArray = curveToPoints(segment, pointCount);
                  rc = rc.concat(segmentArray);
                  segment.delete();
                }
                return rc;
              }

              if (curve instanceof rhino3dm.NurbsCurve && curve.degree === 1) {
                // console.info("degree 1 curve");
              }

              let domain = curve.domain;
              let divisions = pointCount - 1.0;
              for (let j = 0; j < pointCount; j++) {
                let t = domain[0] + (j / divisions) * (domain[1] - domain[0]);
                if (t === domain[0] || t === domain[1]) {
                  ts.push(t);
                  continue;
                }
                let tan = curve.tangentAt(t);
                let tanVec = new THREE.Vector3(tan[0], tan[1], tan[2]);
                let prevTan = curve.tangentAt(ts.slice(-1)[0]);
                let prevTanVec = new THREE.Vector3(
                  prevTan[0],
                  prevTan[1],
                  prevTan[2]
                );

                let angle = tanVec.angleTo(prevTanVec);
                if (angle < 0.1) {
                  continue;
                }
                ts.push(t);
              }

              rc = ts.map((t) => curve.pointAt(t));
              return rc;
            };

            const rege = curveToPoints(mesh);

            const obj = <Line points={rege} {...lnCfgs} />;

            preparedObjects.push(obj);

            /*const loader = new THREE.BufferGeometryLoader();
            const geometry = loader.parse(mesh.ToPolyline());*/

            /*let threeMesh = objectToLine(mesh, material);

            preparedObjects.push(threeMesh);*/
          } else if (mesh instanceof rhino.Point) {
            const location = mesh.location;

            const point = (
              <Points>
                <PointMaterial
                  transparent
                  vertexColors
                  size={15}
                  sizeAttenuation={true}
                  depthWrite={false}
                />
                <Point position={location} color={"blue"} />
              </Points>
            );

            preparedObjects.push(point);
          }
        }

        setMeshes(preparedObjects);
      });
    }
  }, []);

  return (
    <group rotation={[-0.5 * Math.PI, 0, 0]} scale={[0.001, 0.001, 0.001]}>
      {meshes}
    </group>
  );
};

export default MeshM2;
