$(document).ready(function(){
  var currentPosition = 0;
  var slideWidth = 900;
  var slides = $('.slide1');
  var numberOfSlides = slides.length;

  // Remove scrollbar in JS
  $('#slidesContainer1').css('overflow', 'hidden');

  // Wrap all .slides with #slideInner div
  slides
    .wrapAll('<div id="slideInner1"></div>')
    // Float left to display horizontally, readjust .slides width
	.css({
      'float' : 'left',
      'width' : slideWidth
    });

  // Set #slideInner width equal to total width of all slides
  $('#slideInner1').css('width', slideWidth * numberOfSlides);

  // Insert controls in the DOM
  $('#slideshow1')
    .prepend('<span class="control1" id="leftControl1">Clicking moves left</span>')
    .append('<span class="control1" id="rightControl1">Clicking moves right</span>');

  // Hide left arrow control on first load
  manageControls(currentPosition);

  // Create event listeners for .controls clicks
  $('.control1')
    .bind('click', function(){
    // Determine new position
	
    
	// Hide / show controls
    manageControls(currentPosition,this);
    // Move slideInner using margin-left
    
  });

  // manageControls: Hides and Shows controls depending on currentPosition
  function manageControls(position,element){
    // Hide left arrow if position is first slide
		alert("test");
		if(position!=numberOfSlides-1 && $(element).attr('id')=='rightControl1')
		{
			currentPosition = currentPosition+1;
			$('#slideInner1').animate({
      'marginLeft' : slideWidth*(-currentPosition)
    });
		}else if(position!=0  && $(element).attr('id')=='leftControl1'){
			currentPosition = currentPosition-1;
			$('#slideInner1').animate({
      'marginLeft' : slideWidth*(-currentPosition)
    });
		}
		
	if(position==0){ $('#leftControl1').hide() } else{ $('#leftControl1').show() }
	// Hide right arrow if position is last slide
    if(position==numberOfSlides-1){ $('#rightControl1').hide() } else{ $('#rightControl1').show() }
  }	
});