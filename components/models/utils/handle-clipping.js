import * as THREE from "three";
import { MeshBVH, MeshBVHVisualizer, CONTAINED } from "three-mesh-bvh";

const handleClipping = ({ scene, model, init = false }) => {
  const tempVector = new THREE.Vector3();
  const tempVector1 = new THREE.Vector3();
  const tempVector2 = new THREE.Vector3();
  const tempVector3 = new THREE.Vector3();
  const tempLine = new THREE.Line3();
  const inverseMatrix = new THREE.Matrix4();
  const localPlane = new THREE.Plane();

  const params = {
    useBVH: true,

    helperDisplay: false,
    helperDepth: 10,

    wireframeDisplay: true,
    displayModel: true,

    invert: false,
  };

  let initialClip = false;

  /* Шаг 1: Clipping плоскость, матрица которой копируется далее */
  let clippingPlanes = [new THREE.Plane()];

  let planeMesh = scene.getObjectByName("clippingPlane");

  /* Шаг 2: создание Геом. Буффера под обрезную линию c 100000 сегментами */
  const lineGeometry = new THREE.BufferGeometry();
  const linePosAttr = new THREE.BufferAttribute(
    new Float32Array(300000),
    3,
    false
  );
  linePosAttr.setUsage(THREE.DynamicDrawUsage);
  lineGeometry.setAttribute("position", linePosAttr);
  let outlineLines = new THREE.LineSegments(
    lineGeometry,
    new THREE.LineBasicMaterial()
  );
  outlineLines.material.color.set(0xff0000).convertSRGBToLinear();
  outlineLines.frustumCulled = false;
  outlineLines.renderOrder = 3;

  outlineLines.scale.copy(model.scale);
  outlineLines.position.copy(model.position);

  outlineLines.material.color.set(0xff0000).convertSRGBToLinear();

  /* Шаг 3: */
  const surfaceModel = model.clone();
  surfaceModel.material = new THREE.MeshStandardMaterial({
    depthFunc: THREE.EqualDepth,
    transparent: true,
    opacity: 0.5,
  });
  surfaceModel.renderOrder = 1;

  model.updateMatrixWorld(true);

  /* Шаг 4 */
  // Adjust all the materials to draw front and back side with stencil for clip cap
  const matSet = new Set();
  const materialMap = new Map();
  let frontSideModel = model;
  frontSideModel.updateMatrixWorld(true);
  frontSideModel.traverse((c) => {
    if (c.isMesh) {
      if (materialMap.has(c.material)) {
        c.material = materialMap.get(c.material);
        return;
      }

      matSet.add(c.material);

      const material = c.material.clone();
      material.color.set(0xfff000);
      material.roughness = 1.0;
      material.metalness = 0.0;
      material.side = THREE.FrontSide;
      material.stencilWrite = true;
      material.stencilFail = THREE.IncrementWrapStencilOp;
      material.stencilZFail = THREE.IncrementWrapStencilOp;
      material.stencilZPass = THREE.IncrementWrapStencilOp;
      material.clippingPlanes = clippingPlanes;

      materialMap.set(c.material, material);
      c.material = material;
    }
  });

  materialMap.clear();

  let backSideModel = frontSideModel.clone();
  backSideModel.traverse((c) => {
    if (c.isMesh) {
      if (materialMap.has(c.material)) {
        c.material = materialMap.get(c.material);
        return;
      }

      const material = c.material.clone();
      material.color.set(0xff0000);
      material.roughness = 1.0;
      material.metalness = 0.0;
      material.colorWrite = false;
      material.depthWrite = false;
      material.side = THREE.BackSide;
      material.stencilWrite = true;
      material.stencilFail = THREE.DecrementWrapStencilOp;
      material.stencilZFail = THREE.DecrementWrapStencilOp;
      material.stencilZPass = THREE.DecrementWrapStencilOp;
      material.clippingPlanes = clippingPlanes;

      materialMap.set(c.material, material);
      c.material = material;
    }
  });

  // create the collider and preview mesh
  const mergedGeometry = model.geometry;

  let colliderBvh = new MeshBVH(mergedGeometry, { maxLeafTris: 3 });
  mergedGeometry.boundsTree = colliderBvh;

  const mergedGeometry1 = model.geometry.clone();
  mergedGeometry1.applyMatrix4(model.matrixWorld);
  let colliderBvh1 = new MeshBVH(mergedGeometry, { maxLeafTris: 3 });
  mergedGeometry.boundsTree = colliderBvh1;

  /* Вайрфрейм: отрезанный кусок */
  let colliderMesh = new THREE.Mesh(
    mergedGeometry,
    new THREE.MeshBasicMaterial({
      wireframe: true,
      transparent: true,
      opacity: 0.15,
      depthWrite: false,
    })
  );
  colliderMesh.renderOrder = 2;
  colliderMesh.position.copy(model.position);
  colliderMesh.rotation.copy(model.rotation);
  colliderMesh.scale.copy(model.scale);

  let bvhHelper = new MeshBVHVisualizer(
    colliderMesh,
    parseInt(params.helperDepth)
  );
  bvhHelper.depth = parseInt(params.helperDepth);
  bvhHelper.update();

  // create group of meshes and offset it so they're centered
  const group = new THREE.Group();

  if (init) {
    scene.add(
      frontSideModel,
      backSideModel,
      surfaceModel,
      colliderMesh,
      bvhHelper,
      outlineLines
    );
  }

  const box = new THREE.Box3();
  box.setFromObject(frontSideModel);
  box.getCenter(group.position).multiplyScalar(-1);
  group.updateMatrixWorld(true);
  if (init) {
    scene.add(group);
  }

  if (bvhHelper) {
    bvhHelper.visible = params.helperDisplay;
    colliderMesh.visible = params.wireframeDisplay;

    frontSideModel.visible = params.displayModel;
    backSideModel.visible = params.displayModel;
  }

  function render() {
    planeMesh.updateMatrixWorld();

    const clippingPlane = clippingPlanes[0];
    clippingPlane.normal.set(0, 0, params.invert ? 1 : -1);
    clippingPlane.constant = 0;
    clippingPlane.applyMatrix4(planeMesh.matrixWorld);

    // Perform the clipping
    if (colliderBvh && !initialClip) {
      initialClip = true;

      // get the clipping plane in the local space of the BVH
      inverseMatrix.copy(colliderMesh.matrixWorld).invert();
      localPlane.copy(clippingPlane).applyMatrix4(inverseMatrix);

      let index = 0;
      const posAttr = outlineLines.geometry.attributes.position;

      colliderBvh1.shapecast({
        intersectsBounds: (box) => {
          // if we're not using the BVH then skip straight to iterating over all triangles
          if (!params.useBVH) {
            return CONTAINED;
          }

          return clippingPlane.intersectsBox(box);
        },

        intersectsTriangle: (tri) => {
          // check each triangle edge to see if it intersects with the plane. If so then
          // add it to the list of segments.
          let count = 0;

          tempLine.start.copy(tri.a);
          tempLine.end.copy(tri.b);
          if (localPlane.intersectLine(tempLine, tempVector)) {
            posAttr.setXYZ(index, tempVector.x, tempVector.y, tempVector.z);
            index++;
            count++;
          }

          tempLine.start.copy(tri.b);
          tempLine.end.copy(tri.c);
          if (localPlane.intersectLine(tempLine, tempVector)) {
            posAttr.setXYZ(index, tempVector.x, tempVector.y, tempVector.z);
            count++;
            index++;
          }

          tempLine.start.copy(tri.c);
          tempLine.end.copy(tri.a);
          if (localPlane.intersectLine(tempLine, tempVector)) {
            posAttr.setXYZ(index, tempVector.x, tempVector.y, tempVector.z);
            count++;
            index++;
          }

          // When the plane passes through a vertex and one of the edges of the triangle, there will be three intersections, two of which must be repeated
          if (count === 3) {
            tempVector1.fromBufferAttribute(posAttr, index - 3);
            tempVector2.fromBufferAttribute(posAttr, index - 2);
            tempVector3.fromBufferAttribute(posAttr, index - 1);
            // If the last point is a duplicate intersection
            if (
              tempVector3.equals(tempVector1) ||
              tempVector3.equals(tempVector2)
            ) {
              count--;
              index--;
            } else if (tempVector1.equals(tempVector2)) {
              // If the last point is not a duplicate intersection
              // Set the penultimate point as a distinct point and delete the last point
              posAttr.setXYZ(index - 2, tempVector3);
              count--;
              index--;
            }
          }

          // If we only intersected with one or three sides then just remove it. This could be handled
          // more gracefully.
          if (count !== 2) {
            index -= count;
          }
        },
      });

      // set the draw range to only the new segments and offset the lines so they don't intersect with the geometry
      outlineLines.geometry.setDrawRange(0, index);
      outlineLines.position.copy(clippingPlane.normal).multiplyScalar(-0.00001);

      posAttr.needsUpdate = true;
    }
  }

  render();
};

export default handleClipping;
