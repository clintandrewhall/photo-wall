
var EVENT_ID = 'EVENT_OR_GROUP_ID';
var APP_ID = 'APP_ID';
var ACCESS_TOKEN = 'LONG_TERM_ACCESS_TOKEN';

var NEWEST_COUNT = 7;

var PhotoWall = PhotoWall || {};
PhotoWall.Effects = [];
PhotoWall.images = [];
PhotoWall.imageStore = [];
PhotoWall.currentEffect = 0;

PhotoWall.loadPhotos = function(callback) {
  FB.api(
    '/' + EVENT_ID + '/photos?fields=images',
    'get',
    { access_token: ACCESS_TOKEN },
    function (response) {
      if (response && !response.error) {
        PhotoWall.images = JSON.parse(JSON.stringify(response.data));
        PhotoWall.imageStore = JSON.parse(JSON.stringify(response.data));

        var newest = response.data.slice(0, NEWEST_COUNT);
        var n = '';
        newest.forEach(function(newPhoto) {
          n += "<p class=\"fader\" style=\"background-image: url(" + newPhoto.images[0].source + ")\"></p>";
        });
        x$(".latest-pics").html(n);
        callback();
      } else {
        console.log(response.error);
      }
    }
  );
}

PhotoWall.getImages = function (count) {
  if (PhotoWall.images.length < count) {
    PhotoWall.images = JSON.parse(JSON.stringify(PhotoWall.imageStore));
    PhotoWall.images.sort( function() { return 0.5 - Math.random() } );
  }
  return PhotoWall.images.splice(0, count);
}

PhotoWall.nextEffect = function() {
  PhotoWall.loadPhotos(function() {
    var effect = PhotoWall.Effects[PhotoWall.currentEffect];
    if (effect) {
      effect.init();
      PhotoWall.currentEffect++;
    } else {
      PhotoWall.currentEffect = 0;
      PhotoWall.Effects[PhotoWall.currentEffect].init();
    }
  });
}

window.fbAsyncInit = function() {
  FB.init({
    appId      : APP_ID,
    xfbml      : true,
    version    : 'v2.4',
  });
  PhotoWall.nextEffect();
};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));
