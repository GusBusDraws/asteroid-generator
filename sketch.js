// @ts-nocheck
/// <reference path="./node_modules/@types/p5/global.d.ts" />

let points = [];
let subpoints = [];
let edges = [];
let rings = {};
let tris = [];
let rotationInc = 0.01;
let isRotating = true;
let rotateCounter = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL)
  resetSketch()
  console.log('Press SPACE to stop looping or r to reset.')
  // saveGif('00-gen-sphere.gif', 5, {});
}

function draw() {
  background(50);
  lights();
  // Allows interactive camera control with mouse
  orbitControl();
  // Spin the coordinate system
  rotateX(rotateCounter * rotationInc);
  rotateY(rotateCounter * rotationInc);
  rotateZ(rotateCounter * rotationInc);
  // workflow00Sphere();
  // workflow01Subarray();
  // workflow02RandXYZ();
  // workflow03Quadrant();
  // workflow04WiggleLines();
  // workflow05Steering();
  // workflow06PointDisks();
  workflow07();
  if (isRotating) {
    rotateCounter++
  }
}

function drawEdges(points, edges, color, width) {
  stroke(color);
  strokeWeight(width);
  for (let edge of edges) {
    let pt0 = points[edge[0]];
    let pt1 = points[edge[1]];
    line(pt0[0], pt0[1], pt0[2], pt1[0], pt1[1], pt1[2])
  }
}

function drawEdgesFromOrigin(points, color, width) {
  stroke(color);
  strokeWeight(width);
  for (let pt of points) {
    line(0, 0, 0, pt[0], pt[1], pt[2])
  }
}

function drawPoints(points, color, size) {
  for (let pt of points) {
    stroke(color);
    strokeWeight(size);
    point(pt[0], pt[1], pt[2]);
  }
}

function calcEllipsoid(rx, ry, rz, resolution) {
  let points = [];
  for (let i = 0; i < resolution; i++) {
    // Latitude angle (0 to PI)
    let phi = map(i, 0, resolution, 0, PI);
    for (let j = 0; j < resolution; j++) {
      // Longitude angle (0 to TWO_PI)
      let theta = map(j, 0, resolution, 0, TWO_PI);
      // Convert spherical coordinates to Cartesian coordinates
      let x = rx * sin(phi) * cos(theta);
      let y = ry * sin(phi) * sin(theta);
      let z = rz * cos(phi);
      // Add the point to the shape
      points.push([x, y, z]);
    }
  }
  return points
}

function createRing(center, nPts, rMin, rMax, phiRange) {
  let points = [];
  for (let i = 0; i < nPts; i++) {
    let r = random(rMin, rMax);
    // let phi = random(-phiRange/2, phiRange/2);
    // let theta = random(i*TWO_PI / (2*nPts), (i+1)*TWO_PI / (2*nPts));
    // let r = 50;
    let phi = PI/2;
    let theta = (2*i)*(TWO_PI / (2*nPts));
    // Convert spherical coordinates to Cartesian coordinates
    let x = r * sin(phi) * cos(theta) + center[0];
    let y = r * sin(phi) * sin(theta) + center[1];
    let z = r * cos(phi) + center[2];
     points.push([x, y, z])
  }
  return points
}

function createRotatedRing(options = {}) {
  const {
    center = [0, 0, 0],
    rotation = null,
    nPts = 3,
    rMin = 50,
    rMax = 50,
    phiRange = PI/2
  } = options;
  console.log(`center: ${center}, rotation: ${rotation}, nPts: ${nPts}, rMin: ${rMin}, rMax: ${rMax}, phiRange: ${phiRange}`);
  let points = [];
  for (let i = 0; i < nPts; i++) {
    let r = random(rMin, rMax);
    let phi = PI/2;
    let theta = (2*i)*(TWO_PI / (2*nPts));
    // Convert spherical coordinates to Cartesian coordinates
    let x = r * sin(phi) * cos(theta) + center[0];
    let y = r * sin(phi) * sin(theta) + center[1];
    let z = r * cos(phi) + center[2];
    if (rotation != null) {
      let pivot = createVector(center[0], center[1], center[2]);
      let originalPt = createVector(x, y, z);
      let rotatedPt = originalPt.copy();
      // WIP because these functions don't exist
      rotatedPt.rotateX(rotation[0]);
      rotatedPt.rotateY(rotation[1]);
      rotatedPt.rotateZ(rotation[2]);
      // The final coordinates are the rotated vector relative to the pivot
      let finalPt = p5.Vector.add(pivot, rotatedPt);
      [x, y, z] = finalPt.array
    }
    points.push([x, y, z])
  }
  return points
}

function createTrisManual(rings) {
  // Each triangle is a collection of two indices: The first corresponds to the ring, and the second corresponds to the index of the point in the ring
  tris = [
    // First face
    [[0, 0], [0, 1], [0, 2]],
    // 3 off ring 0
    [[0, 0], [0, 1], [1, 0]],
    [[0, 1], [0, 2], [1, 2]],
    [[0, 2], [0, 0], [1, 4]],
    // 6 between rings 0 & 1
    [[1, 1], [1, 0], [0, 1]],
    [[1, 1], [1, 2], [0, 1]],
    [[1, 3], [1, 2], [0, 2]],
    [[1, 3], [1, 4], [0, 2]],
    [[1, 5], [1, 4], [0, 0]],
    [[1, 5], [1, 0], [0, 0]],
    // 6 between rings 1 & 2
    [[1, 0], [1, 1], [2, 0]],
    [[1, 1], [1, 2], [2, 1]],
    [[1, 2], [1, 3], [2, 1]],
    [[1, 3], [1, 4], [2, 2]],
    [[1, 4], [1, 5], [2, 2]],
    [[1, 5], [1, 0], [2, 0]],
    // 3 between 2 & final face
    [[1, 1], [2, 0], [2, 1]],
    [[1, 3], [2, 1], [2, 2]],
    [[1, 5], [2, 2], [2, 0]],
    // Face of ring 2
    [[2, 0], [2, 1], [2, 2]]
  ];
  console.log(tris);
  return tris
}

function creepPoints(points, maxCreep) {
  for (let i = 0; i < points.length; i++) {
    let pt = points[i];
    for (let j = 0; j < 3; j++) {
      pt[j] += random(-maxCreep, maxCreep);
    }
  }
  return points
}

function draw3DShape(points) {
  noStroke();
  // Start drawing the shape
  beginShape(TRIANGLES);
  // Add vertices.
  for (let pt of points) {
    vertex(pt[0], pt[1], pt[2]);
  }
  // Stop drawing the shape.
  endShape();
}

function drawTris(tris, rings) {
  fill(255);
  stroke(255);
  beginShape(TRIANGLES);
  for (let tri of tris) {
    for (let v = 0; v < 3; v++) {
      ringIdx = tri[v][0];
      ptIdx = tri[v][1];
      vertex(
        rings[ringIdx][ptIdx][0],
        rings[ringIdx][ptIdx][1],
        rings[ringIdx][ptIdx][2],
      );
    }
  }
  endShape();
}

function generatePoints(n, range) {
  let points = [];
  for (let i = 0; i < n; i++) {
    let x = random(-1*range, range);
    let y = random(-1*range, range);
    let z = random(-1*range, range);
    points.push([x, y, z]);
  }
  return points
}

function getPointPerQuadrant(minRadius, maxRadius) {
  let points = [];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 4; j++) {
      let r =  random(minRadius, maxRadius);
      let phi = random(i*PI, (i+1)*PI);
      let theta = random(j*TWO_PI, (j+1)*TWO_PI);
      // Convert spherical coordinates to Cartesian coordinates
      let x = r * sin(phi) * cos(theta);
      let y = r * sin(phi) * sin(theta);
      let z = r * cos(phi);
      points.push([x, y, z]);
    }
  }
  return points
}

function getRandomSubarray(array, n) {
  let subarray = [];
  while (subarray.length < n) {
    let item = random(array);
    if (!subarray.includes(item)) {
      subarray.push(item)
    }
    console.log(subarray.length)
  }
  return subarray
}

function randomWalk(n, maxDist) {
  let points = [[0, 0, 0]];
  let edges = [];
  for (let i = 1; i < n; i++) {
    let pt0 = points[i-1];
    let x = pt0[0] + random(-maxDist, maxDist);
    let y = pt0[1] + random(-maxDist, maxDist);
    let z = pt0[2] + random(-maxDist, maxDist);
    points.push([x, y, z]);
    edges.push([i-1, i]);
  }
  return [points, edges]
}

function randomSteer(n, minDist, maxDist, maxAngle) {
  let points = [[0, 0, 0]];
  let edges = [];
  let theta = random(0, TWO_PI);
  let phi = random(0, PI);
  let r = random(minDist, maxDist);
  let x = r * sin(phi) * cos(theta);
  let y = r * sin(phi) * sin(theta);
  let z = r * cos(phi);
  points.push([x, y, z]);
  edges.push([0, 1]);
  for (let i = 2; i < n; i++) {
    theta = theta + random(-maxAngle/2, maxAngle/2)
    phi = phi + random(-maxAngle/2, maxAngle/2)
    r = random(minDist, maxDist);
    x = x + r * sin(phi) * cos(theta);
    y = y + r * sin(phi) * sin(theta);
    z = z + r * cos(phi);
    points.push([x, y, z]);
    edges.push([i-1, i]);
  }
  return [points, edges]
}

function resetSketch() {
  background(0)
  points = [];
}

function workflow00Sphere() {
  if (frameCount == 1) {
    // Calculate and draw points
    points = calcEllipsoid(100, 100, 100, 10);
    subpoints = getRandomSubarray(points, 12);
  }
  drawPoints(points, '#00ff00', 5);
}

function workflow01Subarray() {
  if (frameCount == 1) {
    // Calculate points
    points = calcEllipsoid(200, 200, 200, 5);
    subpoints = getRandomSubarray(points, 12);
  }
  drawPoints(points, '#00ff00', 5);
  drawPoints(subpoints, '#ffffff', 10);
  draw3DShape(subpoints);
}

function workflow02RandXYZ() {
  if (frameCount == 1) {
    points = generatePoints(4, 50);
  }
  drawPoints(points, '#00ff00', 5);
  drawEdgesFromOrigin(points, '#ffffff', 1);
}

function workflow03Quadrant() {
  if (frameCount == 1) {
    points = getPointPerQuadrant(50, 100);
  }
  drawPoints(points, '#00ff00', 5);
  drawEdgesFromOrigin(points, '#ffffff', 1);
}

function workflow04WiggleLines() {
  if (frameCount == 1) {
    [points, edges] = randomWalk(10, 50);
  }
  points = creepPoints(points, 1);
  drawPoints(points, '#00ff00', 5);
  drawEdges(points, edges, '#ffffff', 1);
}

function workflow05Steering() {
  if (frameCount == 1) {
    [points, edges] = randomSteer(10, 25, 50, PI);
  }
  drawPoints(points, '#00ff00', 5);
  drawEdges(points, edges, '#ffffff', 1);
}

function workflow06PointDisks() {
  if (frameCount == 1) {
    [points, edges] = randomSteer(3, 50, 200, PI/2);
    // Draw ring with 3 points
    rings[0] = createRing(points[0], 3, 50, 75, PI);
    // Draw ring with 6 points
    rings[1] = createRing(points[1], 6, 75, 100, PI);
    // Draw ring with 3 points
    rings[2] = createRing(points[2], 3, 50, 75, PI);
  }
  drawPoints(points, '#ffffff', 5);
  drawEdges(points, edges, '#ffffff', 1);
  drawPoints(rings[0], '#ff0000', 5);
  drawPoints(rings[1], '#00ff00', 5);
  drawPoints(rings[2], '#0000ff', 5);
}

function workflow07() {
  if (frameCount == 1) {
    [points, edges] = randomSteer(3, 50, 200, PI/2);
    // Draw ring with 3 points
    rings[0] = createRing(points[0], 3, 50, 75, PI);
    // Draw ring with 6 points
    rings[1] = createRing(points[1], 6, 75, 100, PI);
    // Draw ring with 3 points
    rings[2] = createRing(points[2], 3, 50, 75, PI);
    tris = createTrisManual(rings);
  }
  drawPoints(points, '#ffffff', 5);
  drawEdges(points, edges, '#ffffff', 1);
  drawTris(tris, rings);
  drawPoints(rings[0], '#ff0000', 5);
  drawPoints(rings[1], '#00ff00', 5);
  drawPoints(rings[2], '#0000ff', 5);
}
