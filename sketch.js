// @ts-check
/// <reference path="./node_modules/@types/p5/global.d.ts" />

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL)
  resetSketch()
  console.log('Press SPACE to stop looping or r to reset.')
}

function draw() {
  background(50);
  // Allows interactive camera control with mouse
  orbitControl();
  // Spin the coordinate system
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  rotateZ(frameCount * 0.01);
  // Calculate and draw points
  let points = calcEllipsoid(100, 100, 100, 10)
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

function resetSketch() {
  background(0)
}
