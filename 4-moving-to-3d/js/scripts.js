var video = document.getElementById('our-video'),
    canvas = document.getElementById('our-canvas'),
    renderer = new THREE.WebGLRenderer({antialias: true}),
    canvasWidth = Math.floor(canvas.clientWidth),
    canvasHeight = Math.floor(canvas.clientHeight),
    camera = new THREE.Camera(45, canvasWidth/canvasHeight, 0.1, 10000),
    cameraRotation = 0,
    scene = new THREE.Scene(),
    cubeWidth = canvasWidth * 0.008,
    cubeHeight = canvasHeight * 0.008,
    n = n ? n : 0,
    cubes = new Array(),
    sprite = THREE.ImageUtils.loadTexture("images/glow.png"),
    material = new THREE.ParticleBasicMaterial({
        size: cubeWidth * 3.5,
        map: sprite,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        vertexColors: true //allows 1 color per particle
    }),
    context = canvas.getContext('2d'),
    filter = window.location.hash.split('#')[1];

video.playbackRate = 0.5;

video.addEventListener('play', function() {
  draw(video, context, canvasWidth, canvasHeight, filter);
}, false);

draw(video, context, canvasWidth, canvasHeight, filter);

function draw(v,c,w,h,filter) {
  var imageData,
    data,
    finalData = [],
    pixels = 260,
    squareSize = w / pixels,
    geometry = new THREE.Geometry(),
    particleIndex = 0,
    particleColors = new Array(),
    startingX = -cubeWidth * pixels / 2,
    startingY = cubeHeight * pixels / 2;

  if (v.paused || v.ended) return false;
  
  c.drawImage(v,0,0,w,h);

  imageData = c.getImageData(0,0,w,h);

  data = imageData.data;

  for (y=0; y<pixels; y++) {
    cubes[y] = new Array();

    for (x=0; x<pixels; x++) {
      var xPos = y * cubeWidth + startingX,
          yPos = -x * cubeWidth + startingY,
          red = imageData.data[((y * (imageData.width * 4)) + (x * 4))],
          green = imageData.data[((y * (imageData.width * 4)) + (x * 4)) + 1],
          blue = imageData.data[((y * (imageData.width * 4)) + (x * 4)) + 2],
          zPos = (red + green + blue) / 3;
          particle = new THREE.Vertex(new THREE.Vector3(xPos, yPos, zPos));

        particleColors[particleIndex] = new THREE.Color(0xff6600);
        particleColors[particleIndex].setRGB((red/255), (green/255), (blue/255));

        particleIndex++;

        geometry.vertices.push(particle);
    }
  }

  geometry.colors = particleColors;

  var particleSystem = new THREE.ParticleSystem(geometry, material);
  particleSystem.sortParticles = true;

  scene = new THREE.Scene();
  scene.addChild(particleSystem);

  camera.lookAt(scene.position);
  camera.position.x = 25;
  camera.position.y = -50;
  camera.position.z = 200; 

  renderer.render(scene, camera);

  requestAnimFrame(function() {
    draw(v,c,w,h,filter);
  });
}

renderer.setSize(canvasWidth, canvasHeight);
renderer.setClearColorHex(0x000000, 1.0);
renderer.clear();   

$('#our-3d').append(renderer.domElement);

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame       ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame    ||
         function(callback) {
           window.setTimeout(callback, 1000 / 60);
         };
})();