var canvas = document.getElementById('our-canvas'), // Our canvas element
    ourData = document.getElementById('our-data'), // Our <div> which starts empty
    context = canvas.getContext('2d'),
    uploadedFile = document.getElementById('uploaded-file'); // Our file uploader option

window.addEventListener("load", initImageLoader, true);

function initImageLoader() {
  loadFile('http://localhost/Courses/Manipulating-and-using-images-and-video-using-HTML5-and-JavaScript/2-manipulating-images-with-javascript/astronautcat-tiny.jpg');
}

function loadFile(file) {
  var img = document.createElement('img'),
      _tempImageStore = new Image(),
      _image = null;
  
  // Set up our onload function - it won't run this code till we've loaded an image into our _tempImageStore.
  _tempImageStore.onload = function(ev) {
    // Gets the image width and height, sets the canvas size to match it.
    canvas.height = ev.target.height;
    canvas.width = ev.target.width;

    // Draw that image into our canvas element
    context.drawImage(ev.target, 0, 0);
    
    // We read in the data in our canvas element now, storing it as an array of data in the form of a one dimensional array of RGBARGBA... etc.
    _image = context.getImageData(0, 0, ev.target.width, ev.target.height);
    
    var _generatedImageArray = new Array(), // We'll separate out each RGBA pixel of data into a more understandable array
        _textArray = ''; // This is to make it easy for us to read our array data in this demo
    
    for (y = 0; y < canvas.height; y++) {
      _generatedImageArray[y] = new Array();
      _textArray += '[';

      for (x = 0; x < canvas.width; x++) {
        // https://developer.mozilla.org/En/HTML/Canvas/Pixel_manipulation_with_canvas
        var _red = _image.data[((y * (_image.width * 4)) + (x * 4))],
            _green = _image.data[((y * (_image.width * 4)) + (x * 4)) + 1],
            _blue = _image.data[((y * (_image.width * 4)) + (x * 4)) + 2],
            _alpha = _image.data[((y * (_image.width * 4)) + (x * 4)) + 3];
        
        _generatedImageArray[y][x] = [_red,_green,_blue,_alpha];
        _textArray += '['+_red+','+_green+','+_blue+','+_alpha+']';

        if (x != canvas.width - 1) _textArray += ',';
      }

      _textArray += ']';

      if (y != canvas.height - 1) _textArray += ',';
    }
    
    ourData.innerHTML = _textArray;
  }

  _tempImageStore.src = file;
  return true;
}