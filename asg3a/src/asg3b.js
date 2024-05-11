// Name: William Song
// Email: wihsong@ucsc.edu

// GLobal Variables --------------------------------------------------
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix
let u_ViewMatrix
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_whichTexture;

// Globals related UI elements 
let g_globalAngle=0;

// Animation 
var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0-g_startTime;

// Vertex shader program ---------------------------------------------
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`

// Fragment shader program -------------------------------------------
var FSHADER_SOURCE =`
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform int u_whichTexture;
  void main() {

    if(u_whichTexture == -2){
        gl_FragColor = u_FragColor;
    } else if (u_whichTexture == -1){
        gl_FragColor = vec4(v_UV, 1.0, 1.0);
    } else if(u_whichTexture == 0){
        gl_FragColor = texture2D(u_Sampler0, v_UV);
    } else if(u_whichTexture == 1) {
        gl_FragColor = texture2D(u_Sampler1, v_UV);
    } else {
        gl_FragColor = vec4(1,.2,.2,1);
    }

  }`

// Set up actions for the HTML UI elements ---------------------------
function addActionsForHTMLUI(){
  // Button Events
}

// WebGL -------------------------------------------------------------
function setupWebGL(){
  canvas = document.getElementById('webgl');
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  gl.enable(gl.DEPTH_TEST);
}

// Connect variables to GLSL -----------------------------------------
function connectVariablesToGLSL(){
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }
  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return false;
  }
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix')
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix')
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix')
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return;
  }
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

// Texture -----------------------------------------------------------
function initTextures() {
  var image = new Image();
  var image1 = new Image();
  if (!image) {
     console.log('Failed to create the image object');
     return false;
  }
  if (!image1) {
     console.log('Failed to create the image1 object');
     return false;
  }
  image.onload = function(){ sendTextureToTEXTURE0(image); };
  image1.onload = function(){ sendTextureToTEXTURE1(image1); };
  image.src = 'sky.jpg';
  image1.src = 'block.png';
  return true;
}

function sendTextureToTEXTURE0(image) {
  var texture0 = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0); // Activate texture unit 0
  gl.bindTexture(gl.TEXTURE_2D, texture0);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.uniform1i(u_Sampler0, 0);  // Link texture unit 0 to u_Sampler0
}

function sendTextureToTEXTURE1(image) {
  var texture1 = gl.createTexture();
  gl.activeTexture(gl.TEXTURE1); // Activate texture unit 1
  gl.bindTexture(gl.TEXTURE_2D, texture1);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.uniform1i(u_Sampler1, 1);  // Link texture unit 1 to u_Sampler1
}

// Main --------------------------------------------------------------
function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHTMLUI();
  document.onkeydown = keydown;
  initTextures();
  setupMouseControl();
  gl.clearColor(0, 0, 0, 1.0);
  requestAnimationFrame(tick);
}

// Tick --------------------------------------------------------------
function tick() {
  g_seconds = performance.now()/1000.0-g_startTime;
  console.log(g_seconds);
  renderAllShapes();
  requestAnimationFrame(tick);
}

// Render All Shapes -------------------------------------------------
function keydown(ev) {
  var moveSpeed = 0.2; // Adjust the speed of movement
  var forward = [g_at[0] - g_eye[0], g_at[1] - g_eye[1], g_at[2] - g_eye[2]]; // Direction vector
  var forwardNorm = normalize(forward); // Normalized direction vector
  var right = cross(forwardNorm, g_up); // Right vector perpendicular to forward and up vectors
  var rightNorm = normalize(right); // Normalized right vector

  switch (ev.keyCode) {
      case 87: // W key
          // Move forward in the direction of looking
          g_eye[0] += forwardNorm[0] * moveSpeed;
          g_eye[1] += forwardNorm[1] * moveSpeed;
          g_eye[2] += forwardNorm[2] * moveSpeed;
          g_at[0] += forwardNorm[0] * moveSpeed;
          g_at[1] += forwardNorm[1] * moveSpeed;
          g_at[2] += forwardNorm[2] * moveSpeed;
          break;
      case 83: // S key
          // Move backward in the direction of looking
          g_eye[0] -= forwardNorm[0] * moveSpeed;
          g_eye[1] -= forwardNorm[1] * moveSpeed;
          g_eye[2] -= forwardNorm[2] * moveSpeed;
          g_at[0] -= forwardNorm[0] * moveSpeed;
          g_at[1] -= forwardNorm[1] * moveSpeed;
          g_at[2] -= forwardNorm[2] * moveSpeed;
          break;
      case 65: // A key
          // Move left relative to current view
          g_eye[0] -= rightNorm[0] * moveSpeed;
          g_eye[1] -= rightNorm[1] * moveSpeed;
          g_eye[2] -= rightNorm[2] * moveSpeed;
          g_at[0] -= rightNorm[0] * moveSpeed;
          g_at[1] -= rightNorm[1] * moveSpeed;
          g_at[2] -= rightNorm[2] * moveSpeed;
          break;
      case 68: // D key
          // Move right relative to current view
          g_eye[0] += rightNorm[0] * moveSpeed;
          g_eye[1] += rightNorm[1] * moveSpeed;
          g_eye[2] += rightNorm[2] * moveSpeed;
          g_at[0] += rightNorm[0] * moveSpeed;
          g_at[1] += rightNorm[1] * moveSpeed;
          g_at[2] += rightNorm[2] * moveSpeed;
          break;
      case 81: // Q key
          // Rotate view left
          g_at = rotatePoint(g_at, g_eye, -5);
          break;
      case 69: // E key
          // Rotate view right
          g_at = rotatePoint(g_at, g_eye, 5);
          break;
  }
  renderAllShapes(); // Update the scene
  console.log("Key pressed:", ev.keyCode);
}

function normalize(v) {
  var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  return [v[0] / length, v[1] / length, v[2] / length];
}

function cross(u, v) {
  return [
      u[1] * v[2] - u[2] * v[1], // Cross product x
      u[2] * v[0] - u[0] * v[2], // Cross product y
      u[0] * v[1] - u[1] * v[0]  // Cross product z
  ];
}

function rotatePoint(point, around, angle) {
  var radians = angle * Math.PI / 180;
  var cos = Math.cos(radians);
  var sin = Math.sin(radians);
  var nx = cos * (point[0] - around[0]) - sin * (point[2] - around[2]) + around[0];
  var nz = sin * (point[0] - around[0]) + cos * (point[2] - around[2]) + around[2];
  return [nx, point[1], nz];
}

function setupMouseControl() {
  canvas.requestPointerLock = canvas.requestPointerLock ||
                              canvas.mozRequestPointerLock;

  document.exitPointerLock = document.exitPointerLock ||
                             document.mozExitPointerLock;

  canvas.onclick = function() {
      canvas.requestPointerLock();
  };

  // Event listener when the pointer lock state changes.
  document.addEventListener('pointerlockchange', lockChangeAlert, false);
  document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

  function lockChangeAlert() {
      if (document.pointerLockElement === canvas ||
          document.mozPointerLockElement === canvas) {
          console.log('The pointer lock status is now locked');
          document.addEventListener("mousemove", updatePosition, false);
      } else {
          console.log('The pointer lock status is now unlocked');  
          document.removeEventListener("mousemove", updatePosition, false);
      }
  }

  function rotateCamera(dx, dy) {
    // Convert degrees to radians and adjust the rotation speed
    var radX = dx * Math.PI / 180;
    var radY = dy * Math.PI / 180;

    // Rotate around the y-axis (horizontal movement)
    let cosY = Math.cos(radX);
    let sinY = Math.sin(radX);
    let direction = [g_at[0] - g_eye[0], g_at[1] - g_eye[1], g_at[2] - g_eye[2]];
    g_at[0] = cosY * direction[0] - sinY * direction[2] + g_eye[0];
    g_at[2] = sinY * direction[0] + cosY * direction[2] + g_eye[2];

    // Rotate around the x-axis (vertical movement)
    let cosX = Math.cos(radY);
    let sinX = Math.sin(radY);
    direction = [g_at[0] - g_eye[0], g_at[1] - g_eye[1], g_at[2] - g_eye[2]];
    let length = Math.sqrt(direction[0] * direction[0] + direction[2] * direction[2]); // Length on the xz plane
    g_at[1] = cosX * direction[1] - sinX * length + g_eye[1];
}

  var sensitivity = 0.1; // Adjust this value to your liking
  var movementX = 0;
  var movementY = 0;

  function updatePosition(e) {
      movementX += e.movementX;
      movementY += e.movementY;

      var dx = movementX * sensitivity;
      var dy = movementY * sensitivity;

      // Implement camera rotation based on dx, dy
      rotateCamera(dx, dy);
      movementX = 0;
      movementY = 0;
  }
}

var g_eye=[0,0,3];
var g_at=[0,0,-100];
var g_up=[0,1,0];

var g_map = [
  [1, 1, 1, 1, 1, 1, 1, 1], 
  [1, 0, 0, 0, 0, 0, 0, 1], 
  [1, 1, 1, 1, 1, 0, 1, 0], 
  [0, 1, 1, 1, 1, 0, 0, 0], 
  [0, 0, 0, 0, 0, 0, 0, 0], 
  [1, 0, 0, 0, 0, 0, 1, 0], 
  [1, 1, 1, 1, 1, 0, 1, 1], 
  [1, 0, 0, 0, 0, 0, 1, 1], 
]

function drawMap(){
  for (x=0; x<8; x++) {
    for (y=0; y<8; y++) {
      if (g_map[x][y]==1) {
        var body = new Cube();
        body.color = [1.0, 0.0, 1.0, 1.0];
        body.textureNum=1;
        body.matrix.translate(x-4, -0.75, y-5);
        body.render();
      }
    }
  }
}

function renderAllShapes(){
  var projMat = new Matrix4();
  projMat.setPerspective(60, canvas.width/canvas.height, 1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  var viewMat = new Matrix4();
  viewMat.setLookAt(g_eye[0], g_eye[1], g_eye[2], g_at[0], g_at[1], g_at[2], g_up[0], g_up[1], g_up[2]);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var body = new Cube();
	body.color = [1, 0, 0, 1];
  body.textureNum=1;
  body.matrix.translate(-0.25, -0.75, 0.0);
  body.matrix.rotate(-5, 1, 0, 0);
  body.matrix.scale(0.5,0.3,0.5);
  body.render();

  var arm = new Cube();
  arm.color = [1,1,0,1];
  arm.matrix.setTranslate(0, -0.5, 0);
  arm.matrix.rotate(-5, 1, 0, 0);
  var armMat = new Matrix4(arm.matrix);
  arm.matrix.scale(0.25, 0.7, 0.5);
  arm.matrix.translate(-0.5, 0, 0);
  arm.render();

  var hand = new Cube();
  hand.color = [1,0,1,1];
  hand.textureNum=0;
  hand.matrix = armMat;
  hand.matrix.translate(0, 0.65, 0);
  hand.matrix.rotate(1, 0, 0, 1);
  hand.matrix.scale(0.3,0.3,0.3);
  hand.matrix.translate(-0.5, 0, -0.001);
  hand.render();

  var ground = new Cube();
  ground.color=[1.0, 1.0, 1.0, 1.0];
  ground.textureNum=-2;
  ground.matrix.translate(0,-0.75,0);
  ground.matrix.scale(10, 0, 10);
  ground.matrix.translate(-0.5, 0, -0.5);
  ground.render();

  var sky = new Cube();
  sky.textureNum=0;
  sky.matrix.scale(50,50,50);
  sky.matrix.translate(-0.5, -0.5, -0.5);
  sky.render();

  drawMap();
}
