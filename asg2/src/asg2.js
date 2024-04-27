// Name: William Song
// Email: wihsong@ucsc.edu

// GLobal Variables --------------------------------------------------
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

// Globals related UI elements 
let g_globalAngleX=0;
let g_globalAngleY=0;
let g_yellowAngle=0;
let g_magentaAngle=0;
let g_yellowAnimation=false;

// Animation 
var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0-g_startTime;

// Vertex shader program ---------------------------------------------
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }`

// Fragment shader program -------------------------------------------
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor; 
  void main() {
    gl_FragColor = u_FragColor;
  }`

// Set up actions for the HTML UI elements ---------------------------
function addActionsForHTMLUI(){
  // Button Events
  document.getElementById('animationYellowOffButton').onclick = function() {g_yellowAnimation = false;};
  document.getElementById('animationYellowOnButton').onclick = function() {g_yellowAnimation = true;};

  // Slider Events
  document.getElementById('yellowSlide').addEventListener('mousemove', function() { g_yellowAngle = this.value; renderAllShapes(); });
  document.getElementById('magentaSlide').addEventListener('mousemove', function() { g_magentaAngle = this.value; renderAllShapes(); });
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
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

// Main --------------------------------------------------------------
function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHTMLUI();
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  addMouseControl(canvas, renderAllShapes);
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
function renderAllShapes(){
  var globalRotMat = new Matrix4().rotate(g_globalAngleY, 0, 1, 0); // Rotate around Y-axis
  globalRotMat.rotate(g_globalAngleX, 1, 0, 0); // Rotate around X-axis
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  drawBody();
}
