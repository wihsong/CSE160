function drawColoredTriangle(vertices, color) {
    const n = 3; // The number of vertices in a triangle

    // Create a buffer object
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.error('Failed to create the buffer object');
        return;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write data into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    // Get the attribute location, enable it
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    // Set the color for the triangle
    const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    gl.uniform4fv(u_FragColor, new Float32Array(color));

    // Draw the triangle
    gl.drawArrays(gl.TRIANGLES, 0, n);

    // Clean up
    gl.deleteBuffer(vertexBuffer);
}