// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = u_Size;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor; 
  void main() {
    gl_FragColor = u_FragColor;
  }`

//GLobal Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

function setupWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}

function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_Size
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }
}

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Globals related UI elements
let g_selectedColor=[1.0,1.0,1.0,1.0];
let g_selectedSize=30;
let g_selectedType=POINT;
let g_selectedSegments = 10;

// Set up actions for the HTML UI elements
function addActionsForHTMLUI(){
  // Button Events (Shape Type)
  document.getElementById('clearButton').onclick = function() {g_shapesList=[]; renderAllShapes(); };
  document.getElementById('drawButton').onclick = function() { drawImage(); };

  document.getElementById('pointButton').onclick = function() {g_selectedType=POINT};
  document.getElementById('triButton').onclick = function() {g_selectedType=TRIANGLE};
  document.getElementById('circleButton').onclick = function() {g_selectedType=CIRCLE};

  // Color Slider Events
  document.getElementById('redSlide').addEventListener('mouseup', function() { g_selectedColor[0] = this.value/100; });
  document.getElementById('greenSlide').addEventListener('mouseup', function() { g_selectedColor[1] = this.value/100; });
  document.getElementById('blueSlide').addEventListener('mouseup', function() { g_selectedColor[2] = this.value/100; });

  // Size Slider Events
  document.getElementById('sizeSlide').addEventListener('mouseup', function() { g_selectedSize = this.value; });

  // Segment SLider Events
  document.getElementById('segmentSlide').addEventListener('input', function() { g_selectedSegments = parseInt(this.value); renderAllShapes(); });
}

function main() {

  // Set up canvas and gl variables
  setupWebGL();
  // Set up GLSL shader programs and conenct GLSL variables
  connectVariablesToGLSL();

  // Set up actions for the HTML UI elements
  addActionsForHTMLUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;

  canvas.onmousemove = function(ev) {if(ev.buttons ==1) { click(ev) } }
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_shapesList = [];
/*
var g_points = [];  // The array for the position of a mouse press
var g_colors = [];  // The array to store the color of a point
var g_sizes = []; // The array to store the size
*/

function click(ev) {
  
  // Extract the even click and return it in WebGL coordinates
  [x,y] = convertCoordinatesEventToGL(ev);

  // Create and store the new point
  let point;
  if (g_selectedType==POINT) {
    point = new Point();
  } else if (g_selectedType==TRIANGLE) {
    point = new Triangle();
  } else {
    point = new Circle();
  }
  point.position=[x,y];
  point.color=g_selectedColor.slice();
  point.size=g_selectedSize;
  g_shapesList.push(point);

  // Draw every shape that is supposed to be in the canvas
  renderAllShapes();
}

// Extract the event click and return it in WebGL coordinates
function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y]);
}

// Draw every shape that is supposed to be in the canvas
function renderAllShapes(){
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // var len = g_points.length;
  var len = g_shapesList.length;

  for(var i = 0; i < len; i++) {

    g_shapesList[i].render();

  }
}

function drawImage() {
  // Clear existing shapes
  g_shapesList = [];
  renderAllShapes();
  

  drawColoredTriangle([0, 0, 0, -0.1, 0.1, -0.1], [0.2, 0.2, 0.2, 1]);
  drawColoredTriangle([0, 0, 0.1, 0, 0.1, -0.1], [0.2, 0.2, 0.2, 1]);
  drawColoredTriangle([0.1, 0, 0.1, -0.05, 0.2, 0], [0.2, 0.2, 0.2, 1]);
  drawColoredTriangle([0, 0, 0, -0.1, -0.1, -0.1], [0.2, 0.2, 0.2, 1]);
  drawColoredTriangle([0, 0, -0.1, 0, -0.1, -0.1], [0.2, 0.2, 0.2, 1]);
  drawColoredTriangle([-0.1, 0, -0.2, 0, -0.1, -0.1], [0.2, 0.2, 0.2, 1]);
  drawColoredTriangle([-0.2, 0, -0.2, -0.1, -0.1, -0.1], [0.2, 0.2, 0.2, 1]);
  drawColoredTriangle([-0.2, 0, -0.2, -0.1, -0.3, -0.1], [0.2, 0.2, 0.2, 1]);
  drawColoredTriangle([-0.2, 0, -0.3, 0, -0.3, -0.1], [0.2, 0.2, 0.2, 1]);
  drawColoredTriangle([-0.3, 0, -0.4, 0, -0.3, -0.1], [0.2, 0.2, 0.2, 1]);
  drawColoredTriangle([-0.3, -0.1, -0.4, -0.1, -0.4, 0], [0.2, 0.2, 0.2, 1]);
  drawColoredTriangle([-0.4, 0, -0.4, -0.1, -0.5, -0.1], [0.2, 0.2, 0.2, 1]);
  drawColoredTriangle([-0.4, 0, -0.5, 0, -0.5, -0.1], [0.2, 0.2, 0.2, 1]);
  drawColoredTriangle([-0.5, 0, -0.5, -0.05, -0.6, 0], [0.2, 0.2, 0.2, 1]);

  drawColoredTriangle([0, 0.1, 0.2, 0.1, 0.2, 0.3], [1, 1, 1, 1]);
  drawColoredTriangle([0, 0.1, -0.2, 0.1, -0.2, 0.25], [1, 1, 1, 1]);
  drawColoredTriangle([0, 0.2, 0.1, 0.2, 0, 0.3], [1, 1, 1, 1]);
  drawColoredTriangle([-0.2, 0.1, -0.2, 0.2, -0.3, 0.1], [1, 1, 1, 1]);
  drawColoredTriangle([-0.2, 0.2, -0.2, 0.3, -0.3, 0.2], [1, 1, 1, 1]);
  drawColoredTriangle([-0.3, 0.1, -0.35, 0.2, -0.4, 0.1], [1, 1, 1, 1]);
  drawColoredTriangle([-0.4, 0.1, -0.6, 0.3, -0.6, 0.1], [1, 1, 1, 1]);
  drawColoredTriangle([-0.4, 0.2, -0.4, 0.3, -0.5, 0.2], [1, 1, 1, 1]);

  drawColoredTriangle([0, -0.2, -0.2, -0.2, -0.2, -0.3], [0.85, 0.7, 0.68, 1]);
  drawColoredTriangle([-0.4, -0.2, -0.2, -0.2, -0.2, -0.3], [0.85, 0.7, 0.68, 1]);

  drawColoredTriangle([0.3, -0.1, 0.4, -0.1, 0.4, 0], [0.96, 0.9, 0.87, 1]);
  drawColoredTriangle([0.5, 0, 0.5, -0.1, 0.6, -0.1], [0.96, 0.9, 0.87, 1]);
  drawColoredTriangle([0.5, 0, 0.5, 0.1, 0.6, 0.1], [0.96, 0.9, 0.87, 1]);
  drawColoredTriangle([0.5, 0, 0.5, 0.1, 0.4, 0], [0.96, 0.9, 0.87, 1]);
  drawColoredTriangle([0.4, 0.1, 0.5, 0.1, 0.4, 0], [0.96, 0.9, 0.87, 1]);
  drawColoredTriangle([0.3, 0.1, 0.3, 0.2, 0.4, 0.1], [0.96, 0.9, 0.87, 1]);
  drawColoredTriangle([0.3, -0.1, 0.4, -0.1, 0.4, -0.2], [0.96, 0.9, 0.87, 1]);
  drawColoredTriangle([0.3, -0.1, 0.3, -0.2, 0.4, -0.2], [0.96, 0.9, 0.87, 1]);
  drawColoredTriangle([0.3, -0.3, 0.3, -0.2, 0.4, -0.2], [0.96, 0.9, 0.87, 1]);
  drawColoredTriangle([0.3, -0.3, 0.4, -0.3, 0.4, -0.2], [0.96, 0.9, 0.87, 1]);
  drawColoredTriangle([0.5, -0.2, 0.5, -0.1, 0.6, -0.1], [0.96, 0.9, 0.87, 1]);
  drawColoredTriangle([0.5, -0.2, 0.6, -0.2, 0.6, -0.1], [0.96, 0.9, 0.87, 1]);
  drawColoredTriangle([0.5, -0.2, 0.6, -0.2, 0.6, -0.3], [0.96, 0.9, 0.87, 1]);
  drawColoredTriangle([0.5, -0.2, 0.5, -0.3, 0.6, -0.3], [0.96, 0.9, 0.87, 1]);
}