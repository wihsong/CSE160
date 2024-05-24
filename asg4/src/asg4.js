let gl;
let ext;

const vertexShaderSource = `
    attribute vec4 a_Position;
    attribute vec3 a_Normal;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ProjMatrix;
    uniform mat4 u_NormalMatrix;
    uniform vec3 u_LightPosition;
    uniform vec3 u_SpotLightDirection;
    uniform bool u_NormalVisualization;
    varying vec3 v_Normal;
    varying vec3 v_LightDir;
    varying vec3 v_SpotLightDir;
    varying vec3 v_Position;
    void main() {
        gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
        v_Position = vec3(u_ModelMatrix * a_Position);
        if (u_NormalVisualization) {
            v_Normal = a_Normal;
        } else {
            v_Normal = normalize(vec3(u_NormalMatrix * vec4(a_Normal, 0.0)));
        }
        v_LightDir = normalize(u_LightPosition - v_Position);
        v_SpotLightDir = normalize(u_SpotLightDirection);
    }
`;

const fragmentShaderSource = `
    precision mediump float;
    uniform bool u_Lighting;
    uniform bool u_NormalVisualization;
    uniform bool u_SpotLightEnabled;
    uniform vec3 u_LightColor;
    uniform vec3 u_SpotLightColor;
    varying vec3 v_Normal;
    varying vec3 v_LightDir;
    varying vec3 v_SpotLightDir;
    varying vec3 v_Position;
    void main() {
        if (u_NormalVisualization) {
            gl_FragColor = vec4((v_Normal + 1.0) / 2.0, 1.0); // Map normal to color range
        } else if (u_Lighting || u_SpotLightEnabled) {
            vec3 ambient = 0.1 * u_LightColor;
            vec3 diffuse = vec3(0.0);
            vec3 specular = vec3(0.0);
            vec3 spotlightDiffuse = vec3(0.0);
            vec3 spotlightSpecular = vec3(0.0);

            if (u_Lighting) {
                diffuse = max(dot(v_Normal, v_LightDir), 0.0) * u_LightColor;
                specular = pow(max(dot(reflect(-v_LightDir, v_Normal), normalize(-v_Position)), 0.0), 16.0) * u_LightColor;
            }

            if (u_SpotLightEnabled) {
                float spotEffect = dot(normalize(v_SpotLightDir), normalize(v_LightDir));
                if (spotEffect > 0.95) { // Spotlight cone cutoff
                    spotlightDiffuse = max(dot(v_Normal, v_LightDir), 0.0) * u_SpotLightColor;
                    spotlightSpecular = pow(max(dot(reflect(-v_LightDir, v_Normal), normalize(-v_Position)), 0.0), 16.0) * u_SpotLightColor;
                }
            }

            gl_FragColor = vec4(ambient + diffuse + specular + spotlightDiffuse + spotlightSpecular, 1.0);
        } else {
            gl_FragColor = vec4(vec3(0.1), 1.0); // If both lighting and spotlight are off, show a low ambient color
        }
    }
`;

let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let cameraAngleX = 0;
let cameraAngleY = 0;

function main() {
    const canvas = document.getElementById('glcanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl = canvas.getContext('webgl');
    ext = gl.getExtension('OES_vertex_array_object');

    if (!gl) {
        console.error('WebGL not supported');
        return;
    }

    if (!ext) {
        console.error('OES_vertex_array_object extension not supported');
        return;
    }

    const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
    gl.useProgram(program);

    const a_Position = gl.getAttribLocation(program, 'a_Position');
    const a_Normal = gl.getAttribLocation(program, 'a_Normal');
    const u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix');
    const u_ViewMatrix = gl.getUniformLocation(program, 'u_ViewMatrix');
    const u_ProjMatrix = gl.getUniformLocation(program, 'u_ProjMatrix');
    const u_NormalMatrix = gl.getUniformLocation(program, 'u_NormalMatrix');
    const u_LightPosition = gl.getUniformLocation(program, 'u_LightPosition');
    const u_SpotLightDirection = gl.getUniformLocation(program, 'u_SpotLightDirection');
    const u_NormalVisualization = gl.getUniformLocation(program, 'u_NormalVisualization');
    const u_Lighting = gl.getUniformLocation(program, 'u_Lighting');
    const u_SpotLightEnabled = gl.getUniformLocation(program, 'u_SpotLightEnabled');
    const u_LightColor = gl.getUniformLocation(program, 'u_LightColor');
    const u_SpotLightColor = gl.getUniformLocation(program, 'u_SpotLightColor');

    const viewMatrix = new Matrix4();
    const projMatrix = new Matrix4();
    const modelMatrix = new Matrix4();
    const normalMatrix = new Matrix4();
    projMatrix.setPerspective(45, canvas.width / canvas.height, 0.1, 100);

    const cube = createCube(gl, ext, a_Position, a_Normal);
    const sphere = createSphere(gl, ext, a_Position, a_Normal, 1, 20, 20);
    const ground = createGround(gl, ext, a_Position, a_Normal);
    const walls = createWalls(gl, ext, a_Position, a_Normal);
    const lightCube = createLightCube(gl, ext, a_Position, a_Normal);

    let lightPosition = [2, 2, 2];
    let normalVisualization = false;
    let lighting = true;
    let spotLightEnabled = false;
    let lightColor = [1.0, 1.0, 1.0];
    let spotLightColor = [1.0, 1.0, 1.0];

    document.getElementById('toggle-lighting').onclick = () => {
        lighting = !lighting;
    };
    document.getElementById('toggle-normals').onclick = () => {
        normalVisualization = !normalVisualization;
    };
    document.getElementById('light-color').oninput = (e) => {
        const hex = e.target.value;
        lightColor = hexToRgbArray(hex);
    };

    canvas.addEventListener('mousedown', (e) => {
        if (e.button === 2) {
            spotLightEnabled = !spotLightEnabled;
            return;
        }
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    canvas.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;
            cameraAngleX += deltaX * 0.5;
            cameraAngleY += deltaY * 0.5;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        }
    });

    canvas.addEventListener('mouseup', () => {
        isDragging = false;
    });

    canvas.addEventListener('mouseleave', () => {
        isDragging = false;
    });

    canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    function render() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        viewMatrix.setIdentity();
        viewMatrix.rotate(cameraAngleY, 1, 0, 0);
        viewMatrix.rotate(cameraAngleX, 0, 1, 0);
        viewMatrix.translate(0, -2, -8);

        const angleX = cameraAngleX * Math.PI / 180;
        const angleY = cameraAngleY * Math.PI / 180;
        const spotLightDirection = [
            Math.sin(angleX) * Math.cos(angleY),
            Math.sin(angleY),
            -Math.cos(angleX) * Math.cos(angleY)
        ];

        gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
        gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
        gl.uniform3fv(u_LightPosition, lightPosition);
        gl.uniform3fv(u_SpotLightDirection, spotLightDirection);
        gl.uniform1i(u_NormalVisualization, normalVisualization);
        gl.uniform1i(u_Lighting, lighting);
        gl.uniform1i(u_SpotLightEnabled, spotLightEnabled);
        gl.uniform3fv(u_LightColor, lightColor);
        gl.uniform3fv(u_SpotLightColor, spotLightColor);

        drawObject(gl, ext, ground, u_ModelMatrix, u_NormalMatrix, [0, 0, 0]);
        drawObject(gl, ext, walls, u_ModelMatrix, u_NormalMatrix, [0, 0, 0]);
        drawObject(gl, ext, cube, u_ModelMatrix, u_NormalMatrix, [1, 0, 0]);
        drawObject(gl, ext, sphere, u_ModelMatrix, u_NormalMatrix, [-1, 0, 0]);
        drawObject(gl, ext, lightCube, u_ModelMatrix, u_NormalMatrix, lightPosition);

        lightPosition[0] = 2 * Math.sin(Date.now() / 1000);
        lightPosition[2] = 2 * Math.cos(Date.now() / 1000);

        requestAnimationFrame(render);
    }

    render();
}

function createProgram(gl, vertexSource, fragmentSource) {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Could not link shaders:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }

    return program;
}

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Could not compile shader:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function createCube(gl, ext, a_Position, a_Normal) {
    const vertices = new Float32Array([
        // Front face
        -1.0, -1.0,  1.0,   0.0,  0.0,  1.0,
         1.0, -1.0,  1.0,   0.0,  0.0,  1.0,
         1.0,  1.0,  1.0,   0.0,  0.0,  1.0,
        -1.0,  1.0,  1.0,   0.0,  0.0,  1.0,
        // Back face
        -1.0, -1.0, -1.0,   0.0,  0.0, -1.0,
         1.0, -1.0, -1.0,   0.0,  0.0, -1.0,
         1.0,  1.0, -1.0,   0.0,  0.0, -1.0,
        -1.0,  1.0, -1.0,   0.0,  0.0, -1.0,
        // Top face
        -1.0,  1.0, -1.0,   0.0,  1.0,  0.0,
         1.0,  1.0, -1.0,   0.0,  1.0,  0.0,
         1.0,  1.0,  1.0,   0.0,  1.0,  0.0,
        -1.0,  1.0,  1.0,   0.0,  1.0,  0.0,
        // Bottom face
        -1.0, -1.0, -1.0,   0.0, -1.0,  0.0,
         1.0, -1.0, -1.0,   0.0, -1.0,  0.0,
         1.0, -1.0,  1.0,   0.0, -1.0,  0.0,
        -1.0, -1.0,  1.0,   0.0, -1.0,  0.0,
        // Right face
         1.0, -1.0, -1.0,   1.0,  0.0,  0.0,
         1.0,  1.0, -1.0,   1.0,  0.0,  0.0,
         1.0,  1.0,  1.0,   1.0,  0.0,  0.0,
         1.0, -1.0,  1.0,   1.0,  0.0,  0.0,
        // Left face
        -1.0, -1.0, -1.0,  -1.0,  0.0,  0.0,
        -1.0,  1.0, -1.0,  -1.0,  0.0,  0.0,
        -1.0,  1.0,  1.0,  -1.0,  0.0,  0.0,
        -1.0, -1.0,  1.0,  -1.0,  0.0,  0.0
    ]);

    const indices = new Uint16Array([
         0,  1,  2,  0,  2,  3,  // front
         4,  5,  6,  4,  6,  7,  // back
         8,  9, 10,  8, 10, 11,  // top
        12, 13, 14, 12, 14, 15,  // bottom
        16, 17, 18, 16, 18, 19,  // right
        20, 21, 22, 20, 22, 23   // left
    ]);

    const vao = ext.createVertexArrayOES();
    const vbo = gl.createBuffer();
    const ebo = gl.createBuffer();

    ext.bindVertexArrayOES(vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(a_Normal);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    ext.bindVertexArrayOES(null);

    return { vao, indices };
}

function createSphere(gl, ext, a_Position, a_Normal, radius, latBands, longBands) {
    const vertices = [];
    const normals = [];
    const indices = [];

    for (let latNumber = 0; latNumber <= latBands; ++latNumber) {
        const theta = latNumber * Math.PI / latBands;
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);

        for (let longNumber = 0; longNumber <= longBands; ++longNumber) {
            const phi = longNumber * 2 * Math.PI / longBands;
            const sinPhi = Math.sin(phi);
            const cosPhi = Math.cos(phi);

            const x = cosPhi * sinTheta;
            const y = cosTheta;
            const z = sinPhi * sinTheta;

            normals.push(x);
            normals.push(y);
            normals.push(z);
            vertices.push(radius * x);
            vertices.push(radius * y);
            vertices.push(radius * z);
        }
    }

    for (let latNumber = 0; latNumber < latBands; ++latNumber) {
        for (let longNumber = 0; longNumber < longBands; ++longNumber) {
            const first = (latNumber * (longBands + 1)) + longNumber;
            const second = first + longBands + 1;
            indices.push(first);
            indices.push(second);
            indices.push(first + 1);

            indices.push(second);
            indices.push(second + 1);
            indices.push(first + 1);
        }
    }

    const vao = ext.createVertexArrayOES();
    const vbo = gl.createBuffer();
    const nbo = gl.createBuffer();
    const ebo = gl.createBuffer();

    ext.bindVertexArrayOES(vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.bindBuffer(gl.ARRAY_BUFFER, nbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Normal);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    ext.bindVertexArrayOES(null);

    return { vao, indices };
}

function createGround(gl, ext, a_Position, a_Normal) {
    const vertices = new Float32Array([
        // Ground
        -5.0, 0.0, -5.0,  0.0, 1.0, 0.0,
         5.0, 0.0, -5.0,  0.0, 1.0, 0.0,
         5.0, 0.0,  5.0,  0.0, 1.0, 0.0,
        -5.0, 0.0,  5.0,  0.0, 1.0, 0.0
    ]);

    const indices = new Uint16Array([
        0, 1, 2,
        0, 2, 3
    ]);

    const vao = ext.createVertexArrayOES();
    const vbo = gl.createBuffer();
    const ebo = gl.createBuffer();

    ext.bindVertexArrayOES(vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(a_Normal);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    ext.bindVertexArrayOES(null);

    return { vao, indices };
}

function createWalls(gl, ext, a_Position, a_Normal) {
    const vertices = new Float32Array([
        // Back wall
        -5.0, 0.0, -5.0,  0.0, 0.0, 1.0,
         5.0, 0.0, -5.0,  0.0, 0.0, 1.0,
         5.0, 5.0, -5.0,  0.0, 0.0, 1.0,
        -5.0, 5.0, -5.0,  0.0, 0.0, 1.0,
        // Left wall
        -5.0, 0.0, -5.0,  1.0, 0.0, 0.0,
        -5.0, 5.0, -5.0,  1.0, 0.0, 0.0,
        -5.0, 5.0,  5.0,  1.0, 0.0, 0.0,
        -5.0, 0.0,  5.0,  1.0, 0.0, 0.0,
        // Right wall
         5.0, 0.0, -5.0, -1.0, 0.0, 0.0,
         5.0, 5.0, -5.0, -1.0, 0.0, 0.0,
         5.0, 5.0,  5.0, -1.0, 0.0, 0.0,
         5.0, 0.0,  5.0, -1.0, 0.0, 0.0,
        // Ceiling
        -5.0, 5.0, -5.0,  0.0, -1.0, 0.0,
         5.0, 5.0, -5.0,  0.0, -1.0, 0.0,
         5.0, 5.0,  5.0,  0.0, -1.0, 0.0,
        -5.0, 5.0,  5.0,  0.0, -1.0, 0.0
    ]);

    const indices = new Uint16Array([
        // Back wall
         0,  1,  2,
         0,  2,  3,
        // Left wall
         4,  5,  6,
         4,  6,  7,
        // Right wall
         8,  9, 10,
         8, 10, 11,
        // Ceiling
        12, 13, 14,
        12, 14, 15
    ]);

    const vao = ext.createVertexArrayOES();
    const vbo = gl.createBuffer();
    const ebo = gl.createBuffer();

    ext.bindVertexArrayOES(vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(a_Normal);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    ext.bindVertexArrayOES(null);

    return { vao, indices };
}

function createLightCube(gl, ext, a_Position, a_Normal) {
    const vertices = new Float32Array([
        // Front face
        -0.1, -0.1,  0.1,   0.0,  0.0,  1.0,
         0.1, -0.1,  0.1,   0.0,  0.0,  1.0,
         0.1,  0.1,  0.1,   0.0,  0.0,  1.0,
        -0.1,  0.1,  0.1,   0.0,  0.0,  1.0,
        // Back face
        -0.1, -0.1, -0.1,   0.0,  0.0, -1.0,
         0.1, -0.1, -0.1,   0.0,  0.0, -1.0,
         0.1,  0.1, -0.1,   0.0,  0.0, -1.0,
        -0.1,  0.1, -0.1,   0.0,  0.0, -1.0,
        // Top face
        -0.1,  0.1, -0.1,   0.0,  1.0,  0.0,
         0.1,  0.1, -0.1,   0.0,  1.0,  0.0,
         0.1,  0.1,  0.1,   0.0,  1.0,  0.0,
        -0.1,  0.1,  0.1,   0.0,  1.0,  0.0,
        // Bottom face
        -0.1, -0.1, -0.1,   0.0, -1.0,  0.0,
         0.1, -0.1, -0.1,   0.0, -1.0,  0.0,
         0.1, -0.1,  0.1,   0.0, -1.0,  0.0,
        -0.1, -0.1,  0.1,   0.0, -1.0,  0.0,
        // Right face
         0.1, -0.1, -0.1,   1.0,  0.0,  0.0,
         0.1,  0.1, -0.1,   1.0,  0.0,  0.0,
         0.1,  0.1,  0.1,   1.0,  0.0,  0.0,
         0.1, -0.1,   0.1,   1.0,  0.0,  0.0,
        // Left face
        -0.1, -0.1, -0.1,  -1.0,  0.0,  0.0,
        -0.1,  0.1, -0.1,  -1.0,  0.0,  0.0,
        -0.1,  0.1,  0.1,  -1.0,  0.0,  0.0,
        -0.1, -0.1,  0.1,  -1.0,  0.0,  0.0
    ]);

    const indices = new Uint16Array([
         0,  1,  2,  0,  2,  3,  // front
         4,  5,  6,  4,  6,  7,  // back
         8,  9, 10,  8, 10, 11,  // top
        12, 13, 14, 12, 14, 15,  // bottom
        16, 17, 18, 16, 18, 19,  // right
        20, 21, 22, 20, 22, 23   // left
    ]);

    const vao = ext.createVertexArrayOES();
    const vbo = gl.createBuffer();
    const ebo = gl.createBuffer();

    ext.bindVertexArrayOES(vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(a_Normal);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    ext.bindVertexArrayOES(null);

    return { vao, indices };
}

function drawObject(gl, ext, object, u_ModelMatrix, u_NormalMatrix, translation) {
    const modelMatrix = new Matrix4();
    const normalMatrix = new Matrix4();

    modelMatrix.setTranslate(translation[0], translation[1], translation[2]);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();

    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

    ext.bindVertexArrayOES(object.vao);
    gl.drawElements(gl.TRIANGLES, object.indices.length, gl.UNSIGNED_SHORT, 0);
    ext.bindVertexArrayOES(null);
}

function hexToRgbArray(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r / 255, g / 255, b / 255];
}

main();
