var canvas = document.getElementById('our-canvas'), // Our canvas element
    context = canvas.getContext('2d'),
    image = null; // We will store our currently loaded image here

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

    // We read in the data in our canvas element now, storing it as an array of data in the form of a one dimensional array of RGBARGBA... etc.
    image = context.getImageData(0, 0, ev.target.width, ev.target.height);

    imageFromCanvas();
  }

  tempImageStore.src = file;
  return true;
}

function imageFromCanvas() {
  var data = image.data;
  for (var i = 0; i < data.length; i+=4) {
    // data[i] is red
    // data[i+1] is green
    // data[i+2] is blue;
    
    data[i] = 255;
    //data[i+1] = 0;
    //data[i+2] = 0;
  }
  image.data = data;
    
  context.putImageData(image, 0, 0);
}