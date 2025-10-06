// @ts-check
/// <reference path="./node_modules/@types/p5/global.d.ts" />

// @ts-ignore
let points = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL)
  resetSketch()
  console.log('Press SPACE to stop looping or r to reset.')
  // Calculate and draw points
  points = calcEllipsoid(200, 200, 200, 10)
  // saveGif('00-point-sphere.gif', 5, {});
}

function draw() {
  background(50);
  // Allows interactive camera control with mouse
  orbitControl();
  // Spin the coordinate system
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  rotateZ(frameCount * 0.01);
  stroke('#00ff00');
  drawPoints(points);
}

// @ts-ignore
function drawPoints(points) {
  for (let pt of points) {
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
function getRandomSubarray(array, n) {
  let subarray = [];
  while (getRandomSubarray.length < n) {
    let item = random(array);
    if (!subarray.includes(item)) {
      subarray.push(item)
    }
  }
  return subarray
}

function resetSketch() {
  background(0)
  points = [];
}
