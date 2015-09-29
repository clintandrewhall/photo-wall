
var EVENT_ID = 'event_or_group_id';
var APP_ID = 'app_id';
var ACCESS_TOKEN = 'token';

var NEWEST_COUNT = 7;

var PhotoWall = (function() {
  var images = [];
  var imageStore = [];
  var currentEffect = 0;

  function loadPhotos(callback) {
    FB.api(
      '/' + EVENT_ID + '/photos?fields=images',
      'get',
      { access_token: ACCESS_TOKEN },
      function (response) {
        if (response && !response.error) {
          if (response.data.length !== imageStore.length) {
            console.log('Found ' + (response.data.length - imageStore.length) + ' new images');
            images = JSON.parse(JSON.stringify(response.data));
            imageStore = JSON.parse(JSON.stringify(response.data));

            var newest = response.data.slice(0, NEWEST_COUNT);
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
      images.sort( function() { return 0.5 - Math.random(); } );
    }

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
    loadPhotos(function() {
      nextEffect();
      setInterval(function() {
        loadPhotos();
      }, 3000);
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
    version    : 'v2.4',
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
