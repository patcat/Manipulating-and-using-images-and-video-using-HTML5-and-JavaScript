var canvas = document.getElementById('our-canvas'), // Our canvas element
    context = canvas.getContext('2d'),
    image = null; // We will store our currently loaded image here

window.addEventListener('DOMContentLoaded', initImageLoader);

function initImageLoader() {
  var location = window.location.href.replace(/\/+$/, "");
  loadFile(location+'/cats.jpg');
}

function loadFile(file, filter, options) {
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

    imageFromCanvas(filter, options);
  }

  tempImageStore.src = file;
  return true;
}

function imageFromCanvas(filter, options) {
  data = image.data;
  for (var i = 0; i < data.length; i+=4) {
    var red = data[i],
        green = data[i+1],
        blue = data[i+2];

    switch (filter) {
      case undefined:
        break;
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
        if (options) {
          if (options.min) {
            if (red < options.min) red = 0;
            if (green < options.min) green = 0;
            if (blue < options.min) blue = 0;
          } if (options.max) {
            if (red > options.max) red = 255;
            if (green > options.max) green = 255;
            if (blue > options.max) blue = 255;
          }
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
        red = luminance;
        green = luminance;
        blue = luminance;

        break;
    }
    data[i] = red;
    data[i+1] = green;
    data[i+2] = blue;
  }
  image.data = data;
    
  context.putImageData(image, 0, 0);
}