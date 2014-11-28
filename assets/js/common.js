var imageLoader = $('#imageLoader');
    maxWidth = 500,
    maxHeight = 500,
    photo = $('#photo'),
    originalCanvas = null,
    filters = $('#filters li a'),
    filterContainer = $('#filterContainer');
$(document).ready(function() {
     imageLoader.on('change', function(){
         handleImage(event);
     });
        $('#filters li:first').before($('#filters li:last'));
        $('#right_scroll span').click(function(){
            var item_width = $('#filters li').outerWidth() + 10;
            var left_indent = parseInt($('#filters').css('left')) - item_width;
            $('#filters').animate({'left' : left_indent},{queue:false, duration:500},function(){
                $('#filters li:last').after($('#filters li:first'));
                $('#filters').css({'left' : '-210px'});
            });
        });
        $('#left_scroll span').click(function(){
            var item_width = $('#filters li').outerWidth() + 10;
            var left_indent = parseInt($('#filters').css('left')) + item_width;
            $('#filters').animate({'left' : left_indent},{queue:false, duration:500},function(){
            $('#filters li:first').before($('#filters li:last'));
            $('#filters').css({'left' : '-210px'});
            });

        });
});
function handleImage(e){
    var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){
            imgWidth  = this.width;
            imgHeight = this.height;

					if (imgWidth >= maxWidth || imgHeight >= maxHeight) {

						if (imgWidth > imgHeight) {
							ratio = imgWidth / maxWidth;
							newWidth = maxWidth;
							newHeight = imgHeight / ratio;
						} else {
							ratio = imgHeight / maxHeight;
							newHeight = maxHeight;
							newWidth = imgWidth / ratio;
						}

					} else {
						newHeight = imgHeight;
						newWidth = imgWidth;
					}
					originalCanvas = $('#imageCanvas');
					var originalContext = originalCanvas[0].getContext('2d');

					originalCanvas.attr({
						width: newWidth,
						height: newHeight
					});
                    $(".ajax-loader").css("top", newHeight/2);
					originalContext.drawImage(this, 0, 0, newWidth, newHeight);
            
					img.remove();

					$("#oCarol").css("display","table");
					filters.first().click();
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);     
}


	filters.click(function(e){
		e.preventDefault();
		var f = $(this);

		if(f.is('.active')){
			return false;
		}

		filters.removeClass('active');
		f.addClass('active');

		var clone = originalCanvas.clone();
        clone[0].getContext('2d').drawImage(originalCanvas[0],0,0);

		photo.find('canvas').remove().end().append(clone);
        
		var effect = $.trim(f[0].id);

		Caman(clone[0], function () {

			if( effect in this){
				this[effect]();
				this.render();
                
                $(".ajax-loader").hide();
				showDownload(clone[0]);
                
			}
			else{
				hideDownload();
			}
		});

	});

var downloadImage = $('a.downloadImage');

	function showDownload(canvas){
       
		downloadImage.off('click').click(function(){
						
			var url = canvas.toDataURL("image/png;base64;");
			downloadImage.attr('href', url);
			
		}).fadeIn();

	}

	function hideDownload(){
		downloadImage.fadeOut();
	}


      