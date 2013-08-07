/*
// <Coman Javascript file>
//
// version: <1.0>

*/
$(document).ready( function (){

function equalHeight(group) {
   tallest = 0;
   group.each(function() {
      thisHeight = $(this).height();
      if(thisHeight > tallest) {
         tallest = thisHeight;
      }
   });
   group.height(tallest);
}
$(document).ready(function() {
	equalHeight($(".equal-column"));
});

$("ul#menu-main-nav li a").addClass("prline")
$(".article:last-child").addClass("no_border");
$(".article:first-child").addClass("first");

function initMenu() {
  $('ul#menu-main-nav li ul.sub-menu').hide();
  $('ul#menu-main-nav li.current-menu-item ul.sub-menu:first').show();
  $('ul#menu-main-nav li.current-menu-item a:first').addClass("active");
  $('ul#menu-main-nav li.current-menu-parent ul.sub-menu:first').show();
  $('ul#menu-main-nav li a.prline').hover(
    function() {
      var checkElement = $(this).next();
      if((checkElement.is('ul.sub-menu')) && (checkElement.is(':visible'))) {
       return false;
		}
      if((checkElement.is('ul.sub-menu')) && (!checkElement.is(':visible'))) {
        $('ul#menu-main-nav li ul.sub-menu:visible').slideUp(1500);
        checkElement.slideDown(1500);
		$("ul#menu-main-nav li a").removeClass("active");
		$(this).addClass("active");
        return false;
        }
      }
    );
};
 
$(document).ready(function() {initMenu();});

});