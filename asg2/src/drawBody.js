function drawBody(){
    let segmentLength = 0.2;  // Length of each segment
    let segmentCount = 10;    // Number of body segments
    let snakeColor = [0, 1, 0, 1]; // Green color for the body
    let tailColor = [0.5, 0.2, 0, 1]; // Darker color for the tail
    let bendAngle = Math.sin(g_seconds) * 10; // Sinusoidal bend for animation

    // Draw the tail first, flat on the ground
    let tail = new Cube();
    tail.color = tailColor;
    tail.matrix.setTranslate(0, -0.5, 0); // Set the position of the tail
    tail.matrix.scale(0.1, 0.05, 0.1); // Make the tail flat and small
    tail.render();

    // Draw the body segments
    for (let i = 1; i <= segmentCount; i++) { // Start from 1 to position segments after the tail
        let segment = new Cube();
        segment.color = snakeColor;
        segment.matrix.setTranslate(0, -0.5 + i * segmentLength, 0); // Stack vertically, starting above the tail
        segment.matrix.rotate(bendAngle * i, 0, 0, 1); // Rotate each segment for bend
        segment.matrix.scale(0.1, segmentLength, 0.1); // Scale to elongate the cube into a segment
        segment.render();
    }
}