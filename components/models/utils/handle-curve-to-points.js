import * as THREE from "three";

const curveToPoints = (rhino3dm, curve, pointLimit = 9999999999) => {
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
    console.info("degree 1 curve");
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
    let prevTanVec = new THREE.Vector3(prevTan[0], prevTan[1], prevTan[2]);

    let angle = tanVec.angleTo(prevTanVec);
    if (angle < 0.1) {
      continue;
    }
    ts.push(t);
  }

  rc = ts.map((t) => curve.pointAt(t));
  return rc;
};

export default curveToPoints;
