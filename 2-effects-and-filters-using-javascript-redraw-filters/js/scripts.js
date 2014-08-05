var canvas = document.getElementById('our-canvas'), // Our canvas element
    context = canvas.getContext('2d'),
    image = null; // We will store our currently loaded image here

window.addEventListener('DOMContentLoaded', initImageLoader);

function initImageLoader() {
  var location = window.location.href.replace(/\/+$/, "");
  loadFile(location+'/cameracat.jpg');
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

function imageFromCanvas(filter, options) {
  clearCanvas(canvas);
  
  for (y = 0; y < canvas.height; y++) {
    for (x = 0; x < canvas.width; x++) {
      var red = image.data[((y * (image.width * 4)) + (x * 4))],
          green = image.data[((y * (image.width * 4)) + (x * 4)) + 1],
          blue = image.data[((y * (image.width * 4)) + (x * 4)) + 2],
          alpha = image.data[((y * (image.width * 4)) + (x * 4)) + 3];
      
      switch (filter) {
        case 'greyscale':
          green = red;
          blue = red;
          break;
        case 'blackandwhite':
          var average = (red + green + blue) / 3;
          if (average < 128) red = green = blue = 0;
          else red = green = blue = 255;
          break;
        case 'turnred':
          green = 0;
          blue = 0;
          break;
        case 'turngreen':
          red = 0;
          blue = 0;
          break;
        case 'turnblue':
          red = 0;
          green = 0;
          break;
        case 'turncyan':
          red = 0;
          break;
        case 'turnpink':
          green = 0;
          break;
        case 'turnyellow':
          blue = 0;
          break;
        case 'threshold':
          if (options.min) {
            if (red < options.min) red = 0;
            if (green < options.min) green = 0;
            if (blue < options.min) blue = 0;
          } if (options.max) {
            if (red > options.max) red = 255;
            if (green > options.max) green = 255;
            if (blue > options.max) blue = 255;
          }
          break;
        case 'luminance':
          // http://www.w3.org/TR/AERT#color-contrast
          var luminance = ((red * 299) + (green * 587) + (blue * 114)) / 1000; // Gives a value from 0 - 255
          if (options) {
            if (options.max && (luminance > options.max)) {
              red = options.max;
              green = options.max;
              blue = options.max;
            }
            if (options.min && (luminance < options.min)) {
              red = options.min;
              green = options.min;
              blue = options.min;
            }
          }
          break;
        case 'thresholdluminance':
          var luminance = ((red * 299) + (green * 587) + (blue * 114)) / 1000; // Gives a value from 0 - 255
          if (options) {
            if (options.max && (luminance > options.max)) {
              red = 255;
              green = 255;
              blue = 255;
            }
            if (options.min && (luminance < options.min)) {
              red = 0;
              green = 0;
              blue = 0;
            }
          }
          break;
        case 'blackandwhiteluminance':
          var luminance = ((red * 299) + (green * 587) + (blue * 114)) / 1000; // Gives a value from 0 - 255
          red = luminance
          green = luminance
          blue = luminance;
          alpha = 255;

          break;
        case 'darkness':
          if (options.min) {
            if (red > options.min) red = options.min;
            if (green > options.min) green = options.min;
            if (blue > options.min) blue = options.min;
          }
          break;
      }

      drawPixel(red, green, blue, alpha, x, y, 1);
    }
  }
}

function clearCanvas(canvas) {
  canvas.height = canvas.height;
  canvas.width = canvas.width;
}

function drawPixel(r,g,b,a,x,y,w) {
  context.save(); // Save state before we move anything
  context.fillStyle = 'rgba('+r+','+g+','+b+','+a+')';
  context.fillRect(x, y, w, w);
  context.restore(); // Restore the state (more useful when we're changing more stuff)
}