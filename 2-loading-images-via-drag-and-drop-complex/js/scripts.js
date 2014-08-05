var canvas = document.getElementById('our-canvas'), // Our canvas element
    ourData = document.getElementById('our-data'), // Our <div> which starts empty
    context = canvas.getContext('2d'),
    uploadedFile = document.getElementById('uploaded-file'); // Our file uploader option

window.addEventListener('DOMContentLoaded', initImageLoader);

function initImageLoader() {
  document.getElementById('drop-area').addEventListener('dragover', function(e) {
    $(this).addClass('over');
  }, true);
  document.getElementById('drop-area').addEventListener('dragleave', function(e) {
    $(this).removeClass('over');
  }, true);
  document.getElementById('drop-area').addEventListener('drop', function(e) {
    $(this).removeClass('over');
  }, true);

  window.addEventListener('dragover', function(e) {
    e.preventDefault();
  }, true);

  window.addEventListener('drop', function(e) {
    var data = e.dataTransfer,
        files = data.files;

    e.preventDefault();

    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      handleFile(file);
    }
  });
}

function handleFile(file) {
    var imageType = /image.*/;

    if (file.type.match(imageType)) {
        var img = document.createElement('img'),
            reader = new FileReader();

        reader.onloadend = function(event) {
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
              
              var generatedImageArray = new Array(), // We'll separate out each RGBA pixel of data into a more understandable array
                  textArray = ''; // This is to make it easy for us to read our array data in this demo
              
              for (y = 0; y < canvas.height; y++) {
                generatedImageArray[y] = new Array();
                textArray += '[';

                for (x = 0; x < canvas.width; x++) {
                  // https://developer.mozilla.org/En/HTML/Canvas/Pixelmanipulationwithcanvas
                  var red = image.data[((y * (image.width * 4)) + (x * 4))],
                      green = image.data[((y * (image.width * 4)) + (x * 4)) + 1],
                      blue = image.data[((y * (image.width * 4)) + (x * 4)) + 2],
                      alpha = image.data[((y * (image.width * 4)) + (x * 4)) + 3];
                  
                  generatedImageArray[y][x] = [red,green,blue,alpha];
                  textArray += '['+red+','+green+','+blue+','+alpha+']';

                  if (x != canvas.width - 1) textArray += ',';
                }

                textArray += ']';

                if (y != canvas.height - 1) textArray += ',';
              }
              
              ourData.innerHTML = textArray;
            }
          
          tempImageStore.src = event.target.result; // Put the loaded image into our new image object, triggering the above onload function.
        }

        reader.readAsDataURL(file); // Read our image data and then it'll run our onloadend function above
    }

    if (!file.type.match(imageType)) {
        return false;
    }

    return true;
}