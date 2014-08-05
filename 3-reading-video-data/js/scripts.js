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
  if (v.paused || v.ended) return false;
  
  c.drawImage(v,0,0,w,h);

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