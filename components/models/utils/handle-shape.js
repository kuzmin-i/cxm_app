import * as THREE from "three";

const handleShape = (vertices = [], isVertical = false) => {
  let shape = new THREE.Shape();

  vertices.map((point = [], i) => {
    const x = !isVertical ? point[0] : point[2];
    const y = !isVertical ? point[1] : point[1];

    if (i === 0) return shape.moveTo(x, y);
    return shape.lineTo(x, y);
  });

  return shape;
};

export default handleShape;
