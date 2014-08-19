var video = document.getElementById('our-video'),
    canvas = document.getElementById('our-canvas'),
    context = canvas.getContext('2d'),
    canvasWidth = Math.floor(canvas.clientWidth),
    canvasHeight = Math.floor(canvas.clientHeight),
    renderer = new THREE.WebGLRenderer({antialias: true}),
    camera = new THREE.Camera(45, canvasWidth/canvasHeight, 0.1, 10000),
    scene = new THREE.Scene(),
    cubeWidth = canvasWidth * 0.008,
    cubeHeight = canvasHeight * 0.008,
    sprite = THREE.ImageUtils.loadTexture("images/glow.png"),
    material = new THREE.ParticleBasicMaterial({
        size: cubeWidth * 3.5,
        map: sprite,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        vertexColors: true //allows 1 color per particle
    });

renderer.setSize(canvasWidth, canvasHeight);
renderer.setClearColorHex(0x000000, 1.0);

$('#our-3d').append(renderer.domElement);

video.playbackRate = 0.5;

video.addEventListener('play', function() {
  draw();
}, false);

function draw() {
  var imageData,
    data,
    pixels = 260,
    geometry = new THREE.Geometry(),
    particleIndex = 0,
    particleColors = new Array(),
    startingX = -cubeWidth * pixels / 2,
    startingY = cubeHeight * pixels / 2;

  if (video.paused || video.ended) return false;
  
  context.drawImage(video,0,0,canvasWidth,canvasHeight);

  imageData = context.getImageData(0,0,canvasWidth,canvasHeight);

  data = imageData.data;

  for (x=0; x<pixels; x++) {
    for (y=0; y<pixels; y++) {
      var xPos = x * cubeWidth + startingX,
          yPos = -y * cubeWidth + startingY,
          red = imageData.data[((y * (imageData.width * 4)) + (x * 4))],
          green = imageData.data[((y * (imageData.width * 4)) + (x * 4)) + 1],
          blue = imageData.data[((y * (imageData.width * 4)) + (x * 4)) + 2],
          zPos = (red + green + blue) / 3;
          particle = new THREE.Vertex(new THREE.Vector3(xPos, yPos, zPos));

        particleColors[particleIndex] = new THREE.Color(0xffffff);
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
    draw();
  });
}

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame       ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame    ||
         function(callback) {
           window.setTimeout(callback, 1000 / 60);
         };
})();