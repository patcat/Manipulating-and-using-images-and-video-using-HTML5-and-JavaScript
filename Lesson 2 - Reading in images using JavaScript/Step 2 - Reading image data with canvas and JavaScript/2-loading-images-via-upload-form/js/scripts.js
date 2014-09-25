var canvas = document.getElementById('our-canvas'), // Our canvas element
    context = canvas.getContext('2d'),
    uploadedFile = document.getElementById('uploaded-file'); // Our file uploader option

window.addEventListener('DOMContentLoaded', initImageLoader);

function initImageLoader() {
  uploadedFile.addEventListener('change', handleManualUploadedFiles);
  
  function handleManualUploadedFiles(ev) {
    var file = ev.target.files[0];
    handleFile(file);
  }
}

function handleFile(file) {
  var imageType = /image.*/;

  if (file.type.match(imageType)) {
    var reader = new FileReader();

    reader.onloadend = function(event) {
        var tempImageStore = new Image();
  
        // Set up our onload function - it won't run this code till we've loaded an image into our tempImageStore.
        tempImageStore.onload = function(ev) {
          // Gets the image width and height, sets the canvas size to match it.
          canvas.height = ev.target.height;
          canvas.width = ev.target.width;

          // Draw that image into our canvas element
          context.drawImage(ev.target, 0, 0);
        }
      
      tempImageStore.src = event.target.result; // Put the loaded image into our new image object, triggering the above onload function.
    }

    reader.readAsDataURL(file); // Read our image data and then it'll run our onloadend function above
  }

  return true;
}