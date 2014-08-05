var video = document.getElementById('our-video'),
    canvas = document.getElementById('our-canvas'),
    canvasWidth = Math.floor(canvas.clientWidth),
    canvasHeight = Math.floor(canvas.clientHeight),
    context = canvas.getContext('2d'),
    filter = window.location.hash.split('#')[1];

video.addEventListener('play', function() {
  draw(video, context, canvasWidth, canvasHeight, filter);
}, false);

draw(video, context, canvasWidth, canvasHeight, filter);

function draw(v,c,w,h,filter) {
  var imageData,
    data,
    finalData = [];

  if (v.paused || v.ended) return false;
  
  c.drawImage(v,0,0,w,h);

  imageData = c.getImageData(0,0,w,h);

  data = imageData.data;

  for(y=0; y<canvasHeight; y++) {
    for(x=0; x<canvasWidth; x++) {
      var red = imageData.data[((y * (imageData.width * 4)) + (x * 4))],
          green = imageData.data[((y * (imageData.width * 4)) + (x * 4)) + 1],
          blue = imageData.data[((y * (imageData.width * 4)) + (x * 4)) + 2];

      // Put them onto the actual canvas we see in our new generated form
      c.fillStyle = 'rgb('+red+','+green+','+blue+')';
      c.fillRect(x,y,(x+1),(y+1));
    }
  }

  requestAnimFrame(function() {
    draw(v,c,w,h,filter);
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