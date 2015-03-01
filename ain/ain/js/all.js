
skrollr.init({
  forceHeight: false
});
$('header a').smoothScroll({
  speed: 2000
});

$(document).konami({
  code: ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a', 'enter'],
  callback: function() {
    $('.clothes').hide();
    $('#skrollr-body').addClass('bonus')
  }
});
