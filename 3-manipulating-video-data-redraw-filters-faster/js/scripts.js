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
    finalData = [],
    pixels = 64,
    squareSize = w / pixels;

  if (v.paused || v.ended) return false;
  
  c.drawImage(v,0,0,w,h);

  imageData = c.getImageData(0,0,w,h);

  data = imageData.data;

  for(y=0; y<pixels; y++) {
    for(x=0; x<pixels; x++) {
      var red = imageData.data[((y * (imageData.width * 4)) + (x * 4))],
          green = imageData.data[((y * (imageData.width * 4)) + (x * 4)) + 1],
          blue = imageData.data[((y * (imageData.width * 4)) + (x * 4)) + 2];

      // Put them onto the actual canvas we see in our new generated form
      c.fillStyle = 'rgb('+red+','+green+','+blue+')';
      c.fillRect((x*squareSize),(y*squareSize),((x+1)*squareSize),((y+1)*squareSize));
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