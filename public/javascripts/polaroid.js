
var PhotoWall = PhotoWall || {};

PhotoWall.Polaroid = function() {
  var left = false;
  var lm = 30
  var ct = 0;

  function fadeOut() {
    var p = x$('.polaroid'), c = 0;
    x$('.polaroid').tween({'opacity' : 0, 'duration' : 3000 }, function() {
      c++;
      if(c == p.length) {
        x$('.scroll').html('');
        PhotoWall.nextEffect();
      }
    });
  }

  function addPhoto() {
    left = !left;

    var images = PhotoWall.getImages(1);

    if(!images || images.length <= 0) {
      x$('.scroll').html('<div class=\'not-enough\'>Welcome!</div>');
    } else {
      var i = images[0];
      x$('.scroll').html('bottom', '<div class=\'polaroid' + (left ? '' : ' right') + '\'><p class=\'polaroid-image\' style=\'background-image: url(' + i.images[0].source + ');\' /></div>');
      setTimeout(function() {
        /* TOP: -500 to -850 */
        /* LEFT: 300 to 800 */
        /* RIGHT: -100 to -900 */
        var t = -(500 + Math.floor(Math.random() * 350)),
          l = left ? (300 + Math.floor(Math.random() * 500)) : -(100 + Math.floor(Math.random() * 800)),
          r = (Math.floor(Math.random() * 45));

        r = left ? r : -r;

        var cs = x$('.polaroid'), c = cs[cs.length - 1];

        x$(c).css( {
          'webkitTransform' : 'translate(' + l + 'px, ' + t + 'px) rotate(' + r + 'deg)'
        });
        ct++;
        if(ct < lm) {
          addPhoto();
        }
        else {
          setTimeout(fadeOut, 3000);
        }
      }, 2000);
    }
  }

  function init() {
    ct = 0;
    addPhoto();
  }

  return {
    'init' : init
  }
}();

PhotoWall.Effects.push(PhotoWall.Polaroid);
