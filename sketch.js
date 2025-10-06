// @ts-check
/// <reference path="./node_modules/@types/p5/global.d.ts" />

// @ts-ignore
let points = [];
// @ts-ignore
let subpoints = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL)
  resetSketch()
  console.log('Press SPACE to stop looping or r to reset.')
  // Calculate and draw points
  points = calcEllipsoid(200, 200, 200, 10);
  subpoints = getRandomSubarray(points, 12);
  // saveGif('00-gen-sphere.gif', 5, {});
}

function draw() {
  background(50);
  // Allows interactive camera control with mouse
  orbitControl();
  // Spin the coordinate system
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  rotateZ(frameCount * 0.01);
  // @ts-ignore
  drawPoints(points, '#00ff00', 5);
  // @ts-ignore
  drawPoints(subpoints, '#ffffff', 10);
  // @ts-ignore
  draw3DShape(subpoints);
}

// @ts-ignore
function drawPoints(points, color, size) {
  for (let pt of points) {
    stroke(color);
    strokeWeight(size);
    point(pt[0], pt[1], pt[2]);
  }
}

// @ts-ignore
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

// @ts-ignore
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

// @ts-ignore
function getRandomSubarray(array, n) {
  // @ts-ignore
  let subarray = [];
  while (subarray.length < n) {
    let item = random(array);
    // @ts-ignore
    if (!subarray.includes(item)) {
      subarray.push(item)
    }
    console.log(subarray.length)
  }
  return subarray
}

function resetSketch() {
  background(0)
  points = [];
}
