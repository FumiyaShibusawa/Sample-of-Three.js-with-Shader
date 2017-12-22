var scene, camera, control, renderer, geometry, material, mesh, time;

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var particles = 300000;

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 10000);
camera.position.set(0, 20.0, 60.0);
camera.lookAt(new THREE.Vector3());
controls = new THREE.OrbitControls(camera);
controls.autoRotate = true;

renderer = new THREE.WebGLRenderer();
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor(0xffffff, 0.0);
document.body.appendChild(renderer.domElement);
window.addEventListener('resize', onWindowResize, false);

function onWindowResize(){
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
  renderer.setSize(WIDTH, HEIGHT);
}

var ParamsShaderMaterial = {
  uniforms: {
    "time": {value: 1.0}
  },
  vertexShader: [
    "precision mediump float;",
    "attribute vec4 color;",
    "uniform float time;",
    "varying vec4 vColor;",
    "void main() {",
    "vColor = color;",
    "gl_PointSize = 1.5;",
    "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
    "}"
  ].join( "\n" ),
  fragmentShader: [
    "precision mediump float;",
    "uniform float time;",
    "varying vec4 vColor;",
    "void main() {",
    "float t = time * 0.001;",
    "gl_FragColor = vec4( vColor.r * abs(sin(t)), vColor.g * abs(cos(t)), vColor.b * abs(sin(t)), 1.0 );",
    "}"
  ].join( "\n" ),
  side: THREE.DoubleSide,
  transparent: true
}

init();
animate();

function init(){
  geometry = new THREE.BufferGeometry();
  let positions = [];
  let colors = [];
  let x, y, z;
  for(let i = 0; i < particles; i++){
    x = Math.random() * 2.0 - 1.0;
    y = Math.random() * 2.0 - 1.0;
    z = Math.random() * 2.0 - 1.0;
    if(x * x + y * y + z * z <= 1) {
      positions.push(x * 500.0);
      positions.push(y * 10.0);
      positions.push(z * 500.0);
      colors.push(Math.random() * 255.0);
      colors.push(Math.random() * 255.0);
      colors.push(Math.random() * 255.0);
      colors.push(Math.random() * 255.0);
    }
  }
  let positionAttribute = new THREE.Float32BufferAttribute(positions, 3);
  let colorAttribute = new THREE.Uint8BufferAttribute(colors, 4);
  colorAttribute.normalized = true;
  geometry.addAttribute( 'position', positionAttribute );
  geometry.addAttribute( 'color', colorAttribute );
  material = new THREE.ShaderMaterial(ParamsShaderMaterial);
  mesh = new THREE.Points(geometry, material);
  scene.add(mesh);
}

function animate(){
  requestAnimationFrame(animate);
  render();
}

function render(){
  time = performance.now();
  material.uniforms.time.value = time;
  mesh.rotation.x = (Math.cos(Math.PI * time * 0.1 / 360) * 0.05) + 0.1;
  mesh.rotation.y += Math.PI / 720;
  renderer.render(scene, camera);
}
