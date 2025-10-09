# Asteroid Generator
Built from a template that is based on the p5 + VS Code setup as
[published by Stef Tervelde and Raphaël de Courville](https://sableraph.notion.site/The-perfect-p5-js-VSCode-setup-for-everyday-creative-coding-414c7eb4fb524da28d53763777d427b8),
which assumes that p5 will be installed using [Node.js](https://nodejs.org/en).

## Installation
To install p5 to use with this template, first check that Node.js is installed:
```bash
node --version
```

If Node returns the version, make sure you have navigated to the project
directory and initialize a new Node package:
```bash
npm init -y
```

Then, download & install the p5 package:
```bash
npm install @types/p5
```

## Change Log
### grow-mesh
- 2025-10-08: Create triangles manually and draw
- 2025-10-08: Disable TS checks
- 2025-10-08: Add `createRing`
- 2025-10-07: Add `randomSteer`
- 2025-10-07: Add `randomWalk` and `creepPoints`
- 2025-10-07: Rename 'attempt' functions to 'workflow'
- 2025-10-06: Add rotation enable/disable
- 2025-10-06: Add `getPointPerQuadrant`
- 2025-10-06: Add `drawEdges`
### pick-points
- 2025-10-06: Make triangles with random subarray
- 2025-10-06: Add `getRandomSubarray`
### plot-ellipsoid
- 2025-10-04: Plot points around an ellipsoid
