var temp = document.getElementById("temp"),
	canvas = document.getElementById('ourCanvas'),
	ourData = document.getElementById('ourData'),
	context = canvas.getContext('2d');
	

window.addEventListener("load", initImageLoader, true);

function initImageLoader() {
	window.addEventListener("dragover", function(e) {
	  e.preventDefault();
	}, true);
	window.addEventListener("drop", function(e) {
		var data = e.dataTransfer;
		var files = data.files;

		e.preventDefault();

		for (var i = 0; i < files.length; i++) {
			var file = files[i];
			handleFile(file);
		}
	});
}

function handleFile(file) {
    var imageType = /image.*/;

    if (!file.type.match(imageType)) {
        return false;
    }

    if(file.type.match(imageType)) {
        var img = document.createElement("img"),
        	reader = new FileReader();

        reader.onloadend = function(event) {
            var _tempImageStore = new Image(),
            	_image = null;
			
			_tempImageStore.onload = function(ev) {
				canvas.height = ev.target.height;
				canvas.width = ev.target.width; // Gets the image width and height of tempImageStore
				context.drawImage(ev.target,0,0);
				
				_image = context.getImageData(0,0,ev.target.width,ev.target.height);
				
				var _generatedImageArray = new Array();
				var _textArray = '';
				
				for(y=0;y<16;y++) {
					_generatedImageArray[y] = new Array();
					_textArray += '[';
					for(x=0;x<16;x++) {
						// https://developer.mozilla.org/En/HTML/Canvas/Pixel_manipulation_with_canvas
						var _red = _image.data[((y * (_image.width * 4)) + (x * 4))];
						var _green = _image.data[((y * (_image.width * 4)) + (x * 4)) + 1];
						var _blue = _image.data[((y * (_image.width * 4)) + (x * 4)) + 2];
						var _alpha = _image.data[((y * (_image.width * 4)) + (x * 4)) + 3];
						
						_generatedImageArray[y][x] = [_red,_green,_blue,_alpha];
						_textArray += '['+_red+','+_green+','+_blue+','+_alpha+']';
						if(x!=15) _textArray += ',';
					}
					_textArray += ']';
					if(y!=15) _textArray += ',';
				}
				
				//draw3dTransformer(_generatedImageArray);
				console.log(''+_textArray);
				ourData.innerHTML(_textArray);
			}
			
			_tempImageStore.src = event.target.result; // Put the loaded image in here (then runs the above)
        }
        reader.readAsDataURL(file); // Read actual data (then runs the above)
    }

    return true;
}