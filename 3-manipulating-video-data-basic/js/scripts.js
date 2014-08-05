var video = document.getElementById('our-video'),
    canvas = document.getElementById('our-canvas'),
    canvasWidth = Math.floor(canvas.clientWidth),
    canvasHeight = Math.floor(canvas.clientHeight),
    context = canvas.getContext('2d');

video.addEventListener('play', function() {
  draw(video, context, canvasWidth, canvasHeight);
}, false);

draw(video, context, canvasWidth, canvasHeight);

function draw(v,c,w,h) {
  var imageData,
    data;

  if (v.paused || v.ended) return false;
  
  c.drawImage(v,0,0,w,h);

  imageData = c.getImageData(0,0,w,h);

  data = imageData.data;
  for (var i = 0; i < data.length; i+=4) {
    // data[i] is red
    // data[i+1] is green
    // data[i+2] is blue;
    //data[i] = 0;
    //data[i+1] = 0;
    //data[i+2] = 0;
  }
  imageData.data = data;

  c.putImageData(imageData, 0, 0);

  requestAnimFrame(function() {
    draw(v,c,w,h);
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