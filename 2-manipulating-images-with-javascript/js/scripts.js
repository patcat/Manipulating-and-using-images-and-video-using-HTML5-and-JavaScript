var canvas = document.getElementById('our-canvas'), // Our canvas element
    context = canvas.getContext('2d'),
    uploadedFile = document.getElementById('uploaded-file'); // Our file uploader option

window.addEventListener('DOMContentLoaded', initImageLoader);

function initImageLoader() {
  var location = window.location.href.replace(/\/+$/, "");
  loadFile(location+'treecat.jpg');
}

function loadFile(file) {
  var tempImageStore = new Image(),
      image = null;
  
  // Set up our onload function - it won't run this code till we've loaded an image into our tempImageStore.
  tempImageStore.onload = function(ev) {
    // Gets the image width and height, sets the canvas size to match it.
    canvas.height = ev.target.height;
    canvas.width = ev.target.width;

    // Draw that image into our canvas element
    context.drawImage(ev.target, 0, 0);
    
    // We read in the data in our canvas element now, storing it as an array of data in the form of a one dimensional array of RGBARGBA... etc.
    image = context.getImageData(0, 0, ev.target.width, ev.target.height);
    
    for (y = 0; y < canvas.height; y++) {
      for (x = 0; x < canvas.width; x++) {
        var red = image.data[((y * (image.width * 4)) + (x * 4))],
            green = image.data[((y * (image.width * 4)) + (x * 4)) + 1],
            blue = image.data[((y * (image.width * 4)) + (x * 4)) + 2],
            alpha = image.data[((y * (image.width * 4)) + (x * 4)) + 3];
        
        drawPixel(red, green, blue, alpha, x, y, 1);
      }
    }
  }

  tempImageStore.src = file;
  return true;
}

function drawPixel(r,g,b,a,x,y,w) {
  context.save();
  context.fillStyle = 'rgba('+r+','+g+','+b+','+a+')';
  context.fillRect(x, y, w, w);
  context.restore();
}