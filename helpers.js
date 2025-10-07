function keyPressed() {
    // Set spacebar to toggle play/pause of drawing loop
    if (key === ' ') {
      if (isRotating) {
        isRotating = false;
        console.log('Rotation disabled. Press SPACE to enable.')
      } else {
        isRotating = true;
        console.log('Rotation enabled. Press SPACE to disable.')
      }
    }
    if (key === 'r') {
      resetSketch();
    }
  }
  