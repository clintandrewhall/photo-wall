
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
        var t = -(400 + Math.floor(Math.random() * (window.innerHeight - 300))),
          l = left ? (Math.floor(Math.random() * (window.innerWidth - 200))) : -(Math.floor(Math.random() * (window.innerWidth - 400))),
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
