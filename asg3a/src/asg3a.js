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
let u_whichTexture;

// Globals related UI elements 
let g_globalAngle=0;

let g_animation=false;

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
  uniform int u_whichTexture;
  void main() {

    if(u_whichTexture == -2){
        gl_FragColor = u_FragColor;
    } else if (u_whichTexture == -1){
        gl_FragColor = vec4(v_UV, 1.0, 1.0);
    } else if(u_whichTexture == 0){
        gl_FragColor = texture2D(u_Sampler0, v_UV);
    } else {
        gl_FragColor = vec4(1,.2,.2,1);
    }

  }`

// Set up actions for the HTML UI elements ---------------------------
function addActionsForHTMLUI(){
  // Button Events
  document.getElementById('animationOffButton').onclick = function() {g_animation = false;};
  document.getElementById('animationOnButton').onclick = function() {g_animation = true;};
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
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

// Texture -----------------------------------------------------------
function initTextures() {
  var image = new Image();
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }

  image.onload = function(){ sendTextureToTEXTURE0(image); };
  image.src = 'sky.jpg';
  return true;
}

function sendTextureToTEXTURE0(image) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler0, 0);
  console.log('finished loadTexture');
}

// Main --------------------------------------------------------------
function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHTMLUI();
  document.onkeydown = keydown;
  initTextures();
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
  if (ev.keyCode==39) {
    g_eye[0] += 0.2;
  } else {
    g_eye[0] -= 0.2;
  }
  renderAllShapes();
  console.log(ev.keyCode);
}

var g_eye=[0,0,3];
var g_at=[0,0,-100];
var g_up=[0,1,0];

function renderAllShapes(){
  var projMat = new Matrix4();
  projMat.setPerspective(50, canvas.width/canvas.height, 1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  var viewMat = new Matrix4();
  viewMat.setLookAt(g_eye[0], g_eye[1], g_eye[2], g_at[0], g_at[1], g_at[2], g_up[0], g_up[1], g_up[2]);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var body = new Cube();
	body.color = [1, 0, 0, 1];
  body.textureNum=0;
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
}
