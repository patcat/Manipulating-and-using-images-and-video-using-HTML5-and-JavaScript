var canvas = document.getElementById('our-canvas'), // Our canvas element
    context = canvas.getContext('2d');

window.addEventListener('DOMContentLoaded', initImageLoader);

function initImageLoader() {
  var location = window.location.href.replace(/\/+$/, "");
  loadFile(location+'/cat.jpg');
}

function loadFile(file) {
  var tempImageStore = new Image();
  
  // Set up our onload function - it won't run this code till we've loaded an image into our tempImageStore.
  tempImageStore.onload = function(ev) {
    // Gets the image width and height, sets the canvas size to match it.
    canvas.height = ev.target.height;
    canvas.width = ev.target.width;

    // Draw that image into our canvas element
    context.drawImage(ev.target, 0, 0);
  }

  tempImageStore.src = file;
  return true;
}