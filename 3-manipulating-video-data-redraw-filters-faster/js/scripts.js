var video = document.getElementById('our-video'),
    canvas = document.getElementById('our-canvas'),
    context = canvas.getContext('2d'),
    canvasWidth = Math.floor(canvas.clientWidth),
    canvasHeight = Math.floor(canvas.clientHeight),
    filter,
    options,
    pixels = 60,
    squareSize = canvasWidth / pixels;

video.addEventListener('play', function() {
  draw();
}, false);

function draw() {
  var imageData,
    data;

  if (video.paused || video.ended) return false;
  
  context.drawImage(video,0,0,canvasWidth,canvasHeight);

  imageData = context.getImageData(0,0,canvasWidth,canvasHeight);

  data = imageData.data;

  for (y=0; y<pixels; y++) {
    for (x=0; x<pixels; x++) {
      var red = imageData.data[((y * (imageData.width * 4)) + (x * 4))],
          green = imageData.data[((y * (imageData.width * 4)) + (x * 4)) + 1],
          blue = imageData.data[((y * (imageData.width * 4)) + (x * 4)) + 2];

          //red = 0;
          //green = 0;
          //blue = 0;

      // Put them onto the actual canvas we see in our new generated form
      context.fillStyle = 'rgb('+red+','+green+','+blue+')';
      context.fillRect((x*squareSize),(y*squareSize),((x+1)*squareSize),((y+1)*squareSize));
    }
  }

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