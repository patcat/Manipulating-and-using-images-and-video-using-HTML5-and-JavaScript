var video = document.getElementById('our-video'),
    canvas = document.getElementById('our-canvas'),
    renderer = new THREE.WebGLRenderer({antialias: true}),
    canvasWidth = Math.floor(canvas.clientWidth),
    canvasHeight = Math.floor(canvas.clientHeight),
    camera = new THREE.Camera(45, canvasWidth/canvasHeight, 0.1, 10000),
    cameraRotation = 0,
    scene = new THREE.Scene(),
    cubeWidth = canvasWidth * 0.02, // 0.008
    cubeHeight = canvasHeight * 0.02,
    n = n ? n : 0,
    cubes = new Array(),
    sprite = THREE.ImageUtils.loadTexture('images/glow.png'),
    material = new THREE.ParticleBasicMaterial({
        size: cubeWidth * 3.5,
        map: sprite,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        vertexColors: true //allows 1 color per particle
    }),
    context = canvas.getContext('2d'),
    filter = window.location.hash.split('#')[1],
    requestFrame; // we store our requestanimationframe in here so we can stop and start it again

video.playbackRate = 0.5;

var webcamConstraints = {
  video: {
    mandatory: {
      maxWidth: 300,
      maxHeight: 300
    }
  }
};

window.addEventListener('DOMContentLoaded', function() {
   navigator.getUserMedia = (navigator.getUserMedia || 
                             navigator.webkitGetUserMedia || 
                             navigator.mozGetUserMedia || 
                             navigator.msGetUserMedia);
   if (navigator.getUserMedia) {
      // Request access to video only
      navigator.getUserMedia({
        video: {
          mandatory: {
            maxWidth: 300,
            maxHeight: 300
          }
        },
        audio:false
      },        
      function(stream) {
            var url = window.URL || window.webkitURL;
            video.src = url ? url.createObjectURL(stream) : stream;
            video.play();
      },
      function(error) {
            alert('Something went wrong. (error code ' + error.code + ')');
            return;
      });
   }
   else {
      alert('Sorry, the browser you are using doesn\'t support getUserMedia');
      return;
   }
});

video.addEventListener('play', function() {
  draw(video, context, canvasWidth, canvasHeight, filter);
}, false);

draw(video, context, canvasWidth, canvasHeight, filter);

function draw(v,c,w,h,filter) {
  var imageData,
    data,
    finalData = [],
    pixels = 150,
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
      var xPos = x * cubeWidth + startingX,
          yPos = -y * cubeWidth + startingY,
          red = imageData.data[((y * (imageData.width * 4)) + (x * 4)) + (canvasWidth)],
          green = imageData.data[((y * (imageData.width * 4)) + (x * 4)) + 1 + (canvasWidth)],
          blue = imageData.data[((y * (imageData.width * 4)) + (x * 4)) + 2 + (canvasWidth)],
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
  camera.position.x = -200;
  camera.position.y = -50;
  camera.position.z = 500; 

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