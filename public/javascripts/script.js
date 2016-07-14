
var APP_ID = 'app_id';
var ACCESS_TOKEN = 'access_token';
var EVENT_ID = 'event_id';
var EVENT_API_PATH = '/' + EVENT_ID + '/photos?fields=images&limit=100';

var NEWEST_COUNT = Math.round(window.innerWidth / 160);

var PhotoWall = (function() {
  var images = [];
  var imageStore = [];
  var currentEffect = 0;

  function populateImageStore(after, callback) {
    FB.api(
      EVENT_API_PATH + (after ? '&after=' + after : ''),
      'get',
      { access_token: ACCESS_TOKEN },
      function (response) {
        if (response && !response.error) {
          var foundImages = response.data;
          if (foundImages.length > 0) {
            imageStore = imageStore.concat(foundImages);
          }

          if (response.paging.next && response.paging.cursors.after && after !== response.paging.cursors.after) {
            populateImageStore(response.paging.cursors.after, callback);
          } else {
            console.log('Loaded ' + imageStore.length + ' existing images.');
            imageStore.shift();
            if (callback) {
              callback();
            }
          }
        } else {
          console.log(response.error);
        }
      }
    );
  }

  function loadPhotos(callback) {
    FB.api(
      EVENT_API_PATH,
      'get',
      { access_token: ACCESS_TOKEN },
      function (response) {
        if (response && !response.error) {
          var newIds = _.difference(
            _.pluck(response.data, 'id'),
            _.pluck(imageStore, 'id')
          );

          if (newIds.length > 0) {
            console.log('Found ' + newIds.length + ' new images');
            var newImages = _.first(response.data, newIds.length);
            imageStore = JSON.parse(JSON.stringify(newImages)).concat(imageStore);
            images = JSON.parse(JSON.stringify(newImages)).concat(images);

            var newest = imageStore.slice(0, NEWEST_COUNT);
            var n = '';

            newest.forEach(function(newPhoto) {
              n += "<p class=\"fader\" style=\"background-image: url(" + newPhoto.images[0].source + ")\"></p>";
            });
            x$(".latest-pics").html(n);
          }
          if (callback) {
            callback();
          }
        } else {
          console.log(response.error);
        }
      }
    );
  }

  function getImages(count) {
    if (!count) {
      return imageStore;
    }

    if (images && images.length < count) {
      images = JSON.parse(JSON.stringify(imageStore));
    }

    images = images.sort( function() { return 0.5 - Math.random(); } );

    return images.splice(0, count);
  }

  function nextEffect() {
    var effect = PhotoWall.Effects[currentEffect];
    if (effect) {
      effect.init();
      currentEffect++;
    } else {
      currentEffect = 0;
      PhotoWall.Effects[currentEffect].init();
    }
  }

  function startup() {
    populateImageStore(null, function() {
      images = JSON.parse(JSON.stringify(imageStore));
      var latest = imageStore.slice(0, NEWEST_COUNT);
      var n = '';

      latest.forEach(function(newPhoto) {
        n += "<p class=\"fader\" style=\"background-image: url(" + newPhoto.images[0].source + ")\"></p>";
      });

      x$(".latest-pics").html(n);

      loadPhotos(function() {
        nextEffect();
        setInterval(function() {
          loadPhotos();
        }, 3000);
      });
    });
  }

  return {
    Effects: [],
    loadPhotos: loadPhotos,
    getImages: getImages,
    nextEffect: nextEffect,
    startup: startup,
  };
})();

window.fbAsyncInit = function() {
  FB.init({
    appId      : APP_ID,
    xfbml      : true,
    version    : 'v2.7',
  });
  PhotoWall.startup();
};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));
