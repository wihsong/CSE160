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
let g_globalAngleY=45;
let g_headAngle=-20;
let g_leftEarAngle=0;
let g_rightEarAngle=0;
let g_upperBodyAngle=10;
let g_wholeBodyAngle=0;
let g_leftArmAngle=20;
let g_rightArmAngle=20;
let g_leftThighAngle=-80;
let g_leftUpperLegAngle=-90;
let g_leftLowerLegAngle=135;
let g_leftFootAngle=0;
let g_rightThighAngle=-80;
let g_rightUpperLegAngle=-90;
let g_rightLowerLegAngle=135;
let g_rightFootAngle=0;
let g_tail1XAngle = 0, g_tail1YAngle = 0, g_tail1ZAngle = 0;
let g_tail2XAngle = 15, g_tail2YAngle = 7, g_tail2ZAngle = 0;
let g_tail3XAngle = 20, g_tail3YAngle = 7, g_tail3ZAngle = 4;
let g_tail4XAngle = 10, g_tail4YAngle = 10, g_tail4ZAngle = 0;
let g_tail5XAngle = 0, g_tail5YAngle = -30, g_tail5ZAngle = 0;
let g_tail6XAngle = 0, g_tail6YAngle = -40, g_tail6ZAngle = 0;
let g_tail7XAngle = 0, g_tail7YAngle = -40, g_tail7ZAngle = 0;
let g_tail8XAngle = 0, g_tail8YAngle = -40, g_tail8ZAngle = 0;
let g_tail9XAngle = 0, g_tail9YAngle = -40, g_tail9ZAngle = 0;
let g_tail10XAngle = 0, g_tail10YAngle = -5, g_tail10ZAngle = 0;

let g_animation=false;
let g_hopAnimation=false;
let g_wholeBodyY=0;
let g_noseTwitch=0;

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
  // Animation
  document.getElementById('animationOffButton').onclick = function() {g_animation = false;};
  document.getElementById('animationOnButton').onclick = function() {g_animation = true;};

  // Walk/Stand Animation
  document.getElementById('animationHopButton').onclick = function() {g_hopAnimation = true;};
  document.getElementById('animationStandButton').onclick = function() {g_hopAnimation = false;};

  // Slider Events
  // Head and Body
  document.getElementById('headSlide').addEventListener('mousemove', function() { g_headAngle = this.value; document.getElementById('headValue').textContent = this.value; renderAllShapes(); });
  document.getElementById('leftEarSlide').addEventListener('mousemove', function() { g_leftEarAngle = this.value; document.getElementById('leftEarValue').textContent = this.value; renderAllShapes(); });
  document.getElementById('rightEarSlide').addEventListener('mousemove', function() { g_rightEarAngle = this.value; document.getElementById('rightEarValue').textContent = this.value; renderAllShapes(); });
  document.getElementById('upperBodySlide').addEventListener('mousemove', function() { g_upperBodyAngle = this.value; document.getElementById('upperValue').textContent = this.value; renderAllShapes(); });
  document.getElementById('wholeBodySlide').addEventListener('mousemove', function() { g_wholeBodyAngle = this.value; document.getElementById('wholeValue').textContent = this.value; renderAllShapes(); });

  // Arms
  document.getElementById('leftArmSlide').addEventListener('mousemove', function() { g_leftArmAngle = this.value; document.getElementById('leftArmValue').textContent = this.value; renderAllShapes(); });
  document.getElementById('rightArmSlide').addEventListener('mousemove', function() { g_rightArmAngle = this.value; document.getElementById('rightArmValue').textContent = this.value; renderAllShapes(); });

  // Left Leg
  document.getElementById('leftThighSlide').addEventListener('mousemove', function() { g_leftThighAngle = this.value; document.getElementById('leftThighValue').textContent = this.value; renderAllShapes(); });
  document.getElementById('leftUpperLegSlide').addEventListener('mousemove', function() { g_leftUpperLegAngle = this.value; document.getElementById('leftUpperLegValue').textContent = this.value; renderAllShapes(); });
  document.getElementById('leftLowerLegSlide').addEventListener('mousemove', function() { g_leftLowerLegAngle = this.value; document.getElementById('leftLowerLegValue').textContent = this.value; renderAllShapes(); });
  document.getElementById('leftFootSlide').addEventListener('mousemove', function() { g_leftFootAngle = this.value; document.getElementById('leftFootValue').textContent = this.value; renderAllShapes(); });

  // Right Leg
  document.getElementById('rightThighSlide').addEventListener('mousemove', function() { g_rightThighAngle = this.value; document.getElementById('rightThighValue').textContent = this.value; renderAllShapes(); });
  document.getElementById('rightUpperLegSlide').addEventListener('mousemove', function() { g_rightUpperLegAngle = this.value; document.getElementById('rightUpperLegValue').textContent = this.value; renderAllShapes(); });
  document.getElementById('rightLowerLegSlide').addEventListener('mousemove', function() { g_rightLowerLegAngle = this.value; document.getElementById('rightLowerLegValue').textContent = this.value; renderAllShapes(); });
  document.getElementById('rightFootSlide').addEventListener('mousemove', function() { g_rightFootAngle = this.value; document.getElementById('rightFootValue').textContent = this.value; renderAllShapes(); });

  // Tail Segments X, Y, Z
  document.getElementById('tail1XSlide').addEventListener('mousemove', function() {
    g_tail1XAngle = this.value;
    document.getElementById('tail1XValue').textContent = this.value;
    renderAllShapes();
  });
  document.getElementById('tail1YSlide').addEventListener('mousemove', function() {
    g_tail1YAngle = this.value;
    document.getElementById('tail1YValue').textContent = this.value;
    renderAllShapes();
  });
  document.getElementById('tail1ZSlide').addEventListener('mousemove', function() {
    g_tail1ZAngle = this.value;
    document.getElementById('tail1ZValue').textContent = this.value;
    renderAllShapes();
  });

  document.getElementById('tail2XSlide').addEventListener('mousemove', function() {
    g_tail2XAngle = this.value;
    document.getElementById('tail2XValue').textContent = this.value;
    renderAllShapes();
  });
  document.getElementById('tail2YSlide').addEventListener('mousemove', function() {
    g_tail2YAngle = this.value;
    document.getElementById('tail2YValue').textContent = this.value;
    renderAllShapes();
  });
  document.getElementById('tail2ZSlide').addEventListener('mousemove', function() {
    g_tail2ZAngle = this.value;
    document.getElementById('tail2ZValue').textContent = this.value;
    renderAllShapes();
  });

  document.getElementById('tail3XSlide').addEventListener('mousemove', function() {
    g_tail3XAngle = this.value;
    document.getElementById('tail3XValue').textContent = this.value;
    renderAllShapes();
  });
  document.getElementById('tail3YSlide').addEventListener('mousemove', function() {
    g_tail3YAngle = this.value;
    document.getElementById('tail3YValue').textContent = this.value;
    renderAllShapes();
  });
  document.getElementById('tail3ZSlide').addEventListener('mousemove', function() {
    g_tail3ZAngle = this.value;
    document.getElementById('tail3ZValue').textContent = this.value;
    renderAllShapes();
  });

  document.getElementById('tail4XSlide').addEventListener('mousemove', function() {
    g_tail4XAngle = this.value;
    document.getElementById('tail4XValue').textContent = this.value;
    renderAllShapes();
  });
  document.getElementById('tail4YSlide').addEventListener('mousemove', function() {
    g_tail4YAngle = this.value;
    document.getElementById('tail4YValue').textContent = this.value;
    renderAllShapes();
  });
  document.getElementById('tail4ZSlide').addEventListener('mousemove', function() {
    g_tail4ZAngle = this.value;
    document.getElementById('tail4ZValue').textContent = this.value;
    renderAllShapes();
  });

  document.getElementById('tail4XSlide').addEventListener('mousemove', function() {
    g_tail4XAngle = this.value;
    document.getElementById('tail4XValue').textContent = this.value;
    renderAllShapes();
  });
  document.getElementById('tail4YSlide').addEventListener('mousemove', function() {
    g_tail4YAngle = this.value;
    document.getElementById('tail4YValue').textContent = this.value;
    renderAllShapes();
  });
  document.getElementById('tail4ZSlide').addEventListener('mousemove', function() {
    g_tail4ZAngle = this.value;
    document.getElementById('tail4ZValue').textContent = this.value;
    renderAllShapes();
  });

  document.getElementById('tail5XSlide').addEventListener('mousemove', function() {
    g_tail5XAngle = this.value;
    document.getElementById('tail5XValue').textContent = this.value;
    renderAllShapes();
  });
  document.getElementById('tail5YSlide').addEventListener('mousemove', function() {
    g_tail5YAngle = this.value;
    document.getElementById('tail5YValue').textContent = this.value;
    renderAllShapes();
  });
  document.getElementById('tail5ZSlide').addEventListener('mousemove', function() {
    g_tail5ZAngle = this.value;
    document.getElementById('tail5ZValue').textContent = this.value;
    renderAllShapes();
  });

  document.getElementById('tail6XSlide').addEventListener('mousemove', function() {
    g_tail6XAngle = this.value;
    document.getElementById('tail6XValue').textContent = this.value;
    renderAllShapes();
  });
  document.getElementById('tail6YSlide').addEventListener('mousemove', function() {
    g_tail6YAngle = this.value;
    document.getElementById('tail6YValue').textContent = this.value;
    renderAllShapes();
  });
  document.getElementById('tail6ZSlide').addEventListener('mousemove', function() {
    g_tail6ZAngle = this.value;
    document.getElementById('tail6ZValue').textContent = this.value;
    renderAllShapes();
  });

  document.getElementById('tail7XSlide').addEventListener('mousemove', function() {
    g_tail7XAngle = this.value;
    document.getElementById('tail7XValue').textContent = this.value;
    renderAllShapes();
  });
  document.getElementById('tail7YSlide').addEventListener('mousemove', function() {
    g_tail7YAngle = this.value;
    document.getElementById('tail7YValue').textContent = this.value;
    renderAllShapes();
  });
  document.getElementById('tail7ZSlide').addEventListener('mousemove', function() {
    g_tail7ZAngle = this.value;
    document.getElementById('tail7ZValue').textContent = this.value;
    renderAllShapes();
  });

  document.getElementById('tail8XSlide').addEventListener('mousemove', function() {
    g_tail8XAngle = this.value;
    document.getElementById('tail8XValue').textContent = this.value;
    renderAllShapes();
  });
  document.getElementById('tail8YSlide').addEventListener('mousemove', function() {
    g_tail8YAngle = this.value;
    document.getElementById('tail8YValue').textContent = this.value;
    renderAllShapes();
  });
  document.getElementById('tail8ZSlide').addEventListener('mousemove', function() {
    g_tail8ZAngle = this.value;
    document.getElementById('tail8ZValue').textContent = this.value;
    renderAllShapes();
  });

  document.getElementById('tail9XSlide').addEventListener('mousemove', function() {
    g_tail9XAngle = this.value;
    document.getElementById('tail9XValue').textContent = this.value;
    renderAllShapes();
  });
  document.getElementById('tail9YSlide').addEventListener('mousemove', function() {
    g_tail9YAngle = this.value;
    document.getElementById('tail9YValue').textContent = this.value;
    renderAllShapes();
  });
  document.getElementById('tail9ZSlide').addEventListener('mousemove', function() {
    g_tail9ZAngle = this.value;
    document.getElementById('tail9ZValue').textContent = this.value;
    renderAllShapes();
  });

  document.getElementById('tail10XSlide').addEventListener('mousemove', function() {
    g_tail10XAngle = this.value;
    document.getElementById('tail10XValue').textContent = this.value;
    renderAllShapes();
  });
  document.getElementById('tail10YSlide').addEventListener('mousemove', function() {
    g_tail10YAngle = this.value;
    document.getElementById('tail10YValue').textContent = this.value;
    renderAllShapes();
  });
  document.getElementById('tail10ZSlide').addEventListener('mousemove', function() {
    g_tai103ZAngle = this.value;
    document.getElementById('tail10ZValue').textContent = this.value;
    renderAllShapes();
  });
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
  gl.clearColor(215/255, 182/255, 139/255, 1.0);
  addMouseControl(canvas, renderAllShapes);
  requestAnimationFrame(tick);
}

// Tick --------------------------------------------------------------
function tick() {
  g_seconds = performance.now()/1000.0-g_startTime;
  console.log(g_seconds);
  updateAnimationAngles();
  if (specialAnimationActive) {
    playSpecialAnimation();
  }
  renderAllShapes();
  requestAnimationFrame(tick);
}

// Animation ---------------------------------------------------------
function updateAnimationAngles() {
  if (g_animation && g_hopAnimation) {
    g_wholeBodyY = 0;
    g_headAngle = -20 + 5*Math.sin(10*g_seconds);
    g_upperBodyAngle = 15 + 10*Math.sin(5*g_seconds);
    g_wholeBodyAngle = -10
    g_wholeBodyY = 0.3 + -0.3*Math.sin(5*g_seconds);
    g_leftEarAngle = 30 + 30*Math.sin(5*g_seconds);
    g_rightEarAngle = 30 + 30*Math.sin(5*g_seconds);
    g_leftArmAngle = 20 + -15*Math.sin(5*g_seconds);
    g_rightArmAngle = 20 + -15*Math.sin(5*g_seconds);
    g_leftThighAngle = -95 + 40*Math.sin(5*g_seconds);
    g_leftUpperLegAngle = -90 + -30*Math.sin(5*g_seconds);
    g_leftLowerLegAngle = 110 + 30*Math.sin(5*g_seconds);
    g_leftFootAngle = 10 + 15*Math.sin(5*g_seconds);
    g_rightThighAngle = -95 + 40*Math.sin(5*g_seconds);
    g_rightUpperLegAngle = -90 + -30*Math.sin(5*g_seconds);
    g_rightLowerLegAngle = 110 + 30*Math.sin(5*g_seconds);
    g_rightFootAngle = 10 + 15*Math.sin(5*g_seconds);
    g_tail1XAngle = 15 + 3*Math.sin(5*g_seconds+0.25*0);
    g_tail1YAngle = 0;
    g_tail1ZAngle = 0;
    g_tail2XAngle = 15 + 3*Math.sin(5*g_seconds+0.25*1);
    g_tail2YAngle = 0;
    g_tail2ZAngle = 0;
    g_tail3XAngle = 3*Math.sin(5*g_seconds+0.25*2);
    g_tail3YAngle = 0;
    g_tail3ZAngle = 0;
    g_tail4XAngle = 3*Math.sin(5*g_seconds+0.25*3);
    g_tail4YAngle = 0;
    g_tail4ZAngle = 0;
    g_tail5XAngle = 3*Math.sin(5*g_seconds+0.25*4);
    g_tail5YAngle = 0;
    g_tail5ZAngle = 0;
    g_tail6XAngle = 3*Math.sin(5*g_seconds+0.25*5);
    g_tail6YAngle = 0;
    g_tail6ZAngle = 0;
    g_tail7XAngle = 3*Math.sin(5*g_seconds+0.25*6);
    g_tail7YAngle = 0;
    g_tail7ZAngle = 0;
    g_tail8XAngle = 3*Math.sin(5*g_seconds+0.25*7);
    g_tail8YAngle = 0;
    g_tail8ZAngle = 0;
    g_tail9XAngle = 3*Math.sin(5*g_seconds+0.25*8);
    g_tail9YAngle = 0;
    g_tail9ZAngle = 0;
    g_tail10XAngle = 3*Math.sin(5*g_seconds+0.25*9);
    g_tail10YAngle = 0;
    g_tail10ZAngle = 0;
  } else if (g_animation && !g_hopAnimation) {
    g_wholeBodyY = 0;
    g_headAngle = -20 + 3*Math.sin(g_seconds);
    g_upperBodyAngle = 10 + 3*Math.sin(g_seconds);
    g_wholeBodyAngle = 0;
    g_wholeBodyY = -0.015*Math.sin(g_seconds);
    g_leftEarAngle = 5 + 5*Math.sin(g_seconds);
    g_rightEarAngle = 5 + 5*Math.sin(g_seconds);
    g_leftArmAngle = 20 + -5*Math.sin(g_seconds);
    g_rightArmAngle = 20 + -5*Math.sin(g_seconds);
    g_leftThighAngle = -80 + 5*Math.sin(g_seconds);
    g_leftUpperLegAngle = -90 + -5*Math.sin(g_seconds);
    g_leftLowerLegAngle = 135;
    g_leftFootAngle = 0;
    g_rightThighAngle = -80 + 5*Math.sin(g_seconds);
    g_rightUpperLegAngle = -90 + -5*Math.sin(g_seconds);
    g_rightLowerLegAngle = 135;
    g_rightFootAngle = 0;
    g_tail1XAngle = 5 + 2*Math.sin(g_seconds+0.25*0);
    g_tail1YAngle = 0;
    g_tail1ZAngle = 0;
    g_tail2XAngle = 15 + 2*Math.sin(g_seconds+0.25*1);
    g_tail2YAngle = 7 + 7*Math.sin(g_seconds);
    g_tail2ZAngle = 0;
    g_tail3XAngle = 20 + 2*Math.sin(g_seconds+0.25*2);
    g_tail3YAngle = 7 + 7*Math.sin(g_seconds);
    g_tail3ZAngle = 4;
    g_tail4XAngle = 10 + 2*Math.sin(g_seconds+0.25*3);
    g_tail4YAngle = 10 + 10*Math.sin(g_seconds);
    g_tail4ZAngle = 0;
    g_tail5XAngle = 2 + 2*Math.sin(g_seconds+0.25*4);
    g_tail5YAngle = -30 - 30*Math.sin(g_seconds);
    g_tail5ZAngle = 0;
    g_tail6XAngle = 2 + 2*Math.sin(g_seconds+0.25*5);
    g_tail6YAngle = -40 - 40*Math.sin(g_seconds);
    g_tail6ZAngle = 0;
    g_tail7XAngle = 2 + 2*Math.sin(g_seconds+0.25*6);
    g_tail7YAngle = -40 - 40*Math.sin(g_seconds);
    g_tail7ZAngle = 0;
    g_tail8XAngle = 2 + 2*Math.sin(g_seconds+0.25*7);
    g_tail8YAngle = -40 - 40*Math.sin(g_seconds);
    g_tail8ZAngle = 0;
    g_tail9XAngle = 2 + 2*Math.sin(g_seconds+0.25*8);
    g_tail9YAngle = -40 - 40*Math.sin(g_seconds);
    g_tail9ZAngle = 0;
    g_tail10XAngle = 2 + 2*Math.sin(g_seconds+0.25*9);
    g_tail10YAngle = -5 - 5*Math.sin(g_seconds);
    g_tail10ZAngle = 0;
  }
}

let specialAnimationActive = false;

document.addEventListener('click', function(event) {
  if (event.shiftKey) {
    specialAnimationActive = true;
    setTimeout(() => {
      specialAnimationActive = false; // Disable the special animation after a duration
      g_noseTwitch = 0;
    }, 1000);
  }
});


function playSpecialAnimation() {
  g_noseTwitch = 0.007 * Math.sin(50 * g_seconds);
}

// Render All Shapes -------------------------------------------------
function renderAllShapes(){
  var globalRotMat = new Matrix4().rotate(g_globalAngleY, 0, 1, 0);
  globalRotMat.rotate(g_globalAngleX, 1, 0, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  drawBody();
}
