const canvas = document.getElementById("glcanvas");
const gl = canvas.getContext("webgl2");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

gl.viewport(0,0,canvas.width,canvas.height);
gl.enable(gl.DEPTH_TEST);

// =====================
// SHADERS
// =====================
const vs = `#version 300 es
in vec3 position;
in vec3 normal;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProj;

out vec3 vNormal;
out vec3 vFragPos;

void main(){
  vFragPos = vec3(uModel * vec4(position,1.0));
  vNormal = mat3(uModel) * normal;
  gl_Position = uProj * uView * vec4(vFragPos,1.0);
}
`;

const fs = `#version 300 es
precision highp float;

in vec3 vNormal;
in vec3 vFragPos;

uniform vec3 lightPos;
uniform vec3 viewPos;

out vec4 fragColor;

void main(){
  vec3 norm = normalize(vNormal);
  vec3 lightDir = normalize(lightPos - vFragPos);

  float diff = max(dot(norm, lightDir),0.0);

  vec3 viewDir = normalize(viewPos - vFragPos);
  vec3 halfDir = normalize(lightDir + viewDir);
  float spec = pow(max(dot(norm, halfDir),0.0),32.0);

  vec3 color = vec3(0.2) + diff*vec3(0.5) + spec*vec3(1.0);
  fragColor = vec4(color,1.0);
}
`;

// =====================
// COMPILAR SHADERS
// =====================
function compilar(tipo, src){
  const s = gl.createShader(tipo);
  gl.shaderSource(s,src);
  gl.compileShader(s);
  return s;
}

const prog = gl.createProgram();
gl.attachShader(prog, compilar(gl.VERTEX_SHADER,vs));
gl.attachShader(prog, compilar(gl.FRAGMENT_SHADER,fs));
gl.linkProgram(prog);
gl.useProgram(prog);

// =====================
// MATRICES
// =====================
function identidad(){
  return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
}

function mult(a,b){
  let r = new Float32Array(16);
  for(let i=0;i<4;i++){
    for(let j=0;j<4;j++){
      for(let k=0;k<4;k++){
        r[i*4+j]+=a[i*4+k]*b[k*4+j];
      }
    }
  }
  return r;
}

function trans(m,x,y,z){
  let r = identidad();
  r[12]=x; r[13]=y; r[14]=z;
  return mult(m,r);
}

function rotY(m,a){
  let c=Math.cos(a), s=Math.sin(a);
  let r = new Float32Array([
    c,0,-s,0,
    0,1,0,0,
    s,0,c,0,
    0,0,0,1
  ]);
  return mult(m,r);
}

function rotZ(m,a){
  let c=Math.cos(a), s=Math.sin(a);
  let r = new Float32Array([
    c,s,0,0,
   -s,c,0,0,
    0,0,1,0,
    0,0,0,1
  ]);
  return mult(m,r);
}

let stack=[];
function push(m){ stack.push(new Float32Array(m)); }
function pop(){ return stack.pop(); }

// =====================
// CUBO
// =====================
const cubeVerts = new Float32Array([
 // posición        normal
 -1,-1,-1, 0,0,-1, 1,-1,-1, 0,0,-1, 1,1,-1, 0,0,-1,
 -1,-1,-1, 0,0,-1, 1,1,-1, 0,0,-1, -1,1,-1, 0,0,-1
]);

const vao = gl.createVertexArray();
gl.bindVertexArray(vao);

const vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,vbo);
gl.bufferData(gl.ARRAY_BUFFER,cubeVerts,gl.STATIC_DRAW);

const posLoc = gl.getAttribLocation(prog,"position");
const normLoc = gl.getAttribLocation(prog,"normal");

gl.enableVertexAttribArray(posLoc);
gl.vertexAttribPointer(posLoc,3,gl.FLOAT,false,24,0);

gl.enableVertexAttribArray(normLoc);
gl.vertexAttribPointer(normLoc,3,gl.FLOAT,false,24,12);

// =====================
// UNIFORMS
// =====================
const uModel = gl.getUniformLocation(prog,"uModel");
const uView = gl.getUniformLocation(prog,"uView");
const uProj = gl.getUniformLocation(prog,"uProj");

gl.uniform3f(gl.getUniformLocation(prog,"lightPos"),5,10,5);
gl.uniform3f(gl.getUniformLocation(prog,"viewPos"),0,5,20);

// VIEW / PROJECTION
function perspective(fov,aspect,n,f){
  let t = Math.tan(fov/2);
  return new Float32Array([
    1/(aspect*t),0,0,0,
    0,1/t,0,0,
    0,0,(n+f)/(n-f),-1,
    0,0,(2*n*f)/(n-f),0
  ]);
}

let view = trans(identidad(),0,-5,-25);
let proj = perspective(Math.PI/4, canvas.width/canvas.height, 0.1,100);

gl.uniformMatrix4fv(uView,false,view);
gl.uniformMatrix4fv(uProj,false,proj);

// =====================
// DIBUJO
// =====================
function draw(m){
  gl.uniformMatrix4fv(uModel,false,m);
  gl.bindVertexArray(vao);
  gl.drawArrays(gl.TRIANGLES,0,6);
}

// =====================
// ANIMACIÓN
// =====================
function render(){
  let t = performance.now()*0.001;

  gl.clearColor(0.6,0.6,0.6,1);
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

  let model = identidad();

  // ===== SISTEMA SOLAR =====
  push(model);
  draw(model);

  let p1 = rotY(model,t);
  p1 = trans(p1,8,0,0);
  draw(p1);

  let luna = rotY(p1,t*2);
  luna = trans(luna,2,0,0);
  draw(luna);

  model = pop();

  // ===== BRAZO =====
  push(model);

  model = trans(model,0,1,0);
  model = rotZ(model,Math.sin(t)*0.5);
  draw(model);

  model = trans(model,0,2,0);
  model = rotZ(model,Math.sin(t+1)*0.5);
  draw(model);

  model = trans(model,0,2,0);
  model = rotZ(model,Math.sin(t+2)*0.5);
  draw(model);

  model = pop();

  requestAnimationFrame(render);
}

render();