var PhotoWall = PhotoWall || {};

var COL_MAX = 10;
var MIN_IMAGES = 8;
var SPEED = 4000;

PhotoWall.Wall = function() {
  var mediumPosition = 2;
  var largePosition = 3;
  var useMedium = false;
  var useLarge = false;
  var wallEnd = false;
  var columnCount = 0;

  function addColumn(columnSize) {
    var s = x$('.not-enough');

    if (s && s[0]) {
      s[0].parentNode.removeChild(s[0]);
    }

    if (PhotoWall.getImages().length < MIN_IMAGES) {
      x$('.scroll').html('<div class=\'not-enough\'>Welcome!</div>');
      setTimeout(function() {
        addColumn(columnSize);
        scroll();
      }, SPEED);
    } else {
      var images = PhotoWall.getImages(columnSize ? 8 : 6);
      var markup = '<div class=\'column ' + columnSize + '\'>';

      for(var i = 0; i < images.length; i++) {
        var className = 'wall-image';

        if (columnSize === 'large' && i === largePosition) {
          className += ' image-large';
        } else if (columnSize === 'medium' && i === mediumPosition) {
          className += ' image-medium';
        }

        markup += '<p class=\'' + className + '\' style=\'background-image: url(' + images[i].images[0].source + ');\' /></p>';
      }

      markup += '</div>';
      x$('.scroll').html('bottom', markup);
      columnCount++;

      if (columnSize === 'medium') {
        mediumPosition = (mediumPosition == 2 ? 4 : 2);
      } else if (columnSize === 'large') {
        largePosition = (largePosition === 3 ? 6 : 3);
      }
    }
  }

  function scroll() {
    var column = x$('.column')[0];

    if (column) {
      var w = column.offsetWidth;
      x$(column).tween(
        {
          'margin-left' : -w + 'px',
          'duration' : SPEED * (w / 160),
          'easing' : function(pos) {
            return pos;
          }
        }, function() {
          if (column.parentNode) {
            column.parentNode.removeChild(column);
            if (columnCount < COL_MAX) {
              if (useMedium) {
                addColumn('medium');
                useMedium = !useMedium;
              }
              else if (useLarge) {
                addColumn('large');
                useLarge = !useLarge;
              }
              else {
                addColumn();
                useLarge = !useLarge;
                useMedium = !useMedium;
              }
            }
            scroll();
          }
        }
      );
    } else if (columnCount > 0) {
      x$('.scroll').html('');
      PhotoWall.nextEffect();
    }
  }

  function startup() {
    addColumn();
    addColumn('medium');
    addColumn();
    addColumn('large');
    addColumn();
    addColumn('medium');
    addColumn();
    addColumn('large');
    x$('.column')
      .css({'opacity' : 0})
      .tween({
        'opacity' : '1',
        'duration' : SPEED,
        'easing' : function(pos) {
          return pos;
        }
      }, function() {
        scroll();
      });
  }

  function init() {
    oc = 0;
    wallEnding(false);
    startup();
  }

  function wallEnding(end) {
    wallEnd = end;
  }

  return {
    'addColumn' : addColumn,
    'wallEnd' : wallEnding,
    'init' : init
  };
}();

PhotoWall.Effects.push(PhotoWall.Wall);
