var video = document.getElementById('our-video'),
    canvas = document.getElementById('our-canvas'),
    context = canvas.getContext('2d'),
    canvasWidth = Math.floor(canvas.clientWidth),
    canvasHeight = Math.floor(canvas.clientHeight);

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
  for (var i = 0; i < data.length; i+=4) {
    // data[i] is red
    // data[i+1] is green
    // data[i+2] is blue;
    //data[i] = 0;
    //data[i+1] = 0;
    data[i+2] = 255;
  }
  imageData.data = data;

  context.putImageData(imageData, 0, 0);

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