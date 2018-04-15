# Photo Wall

### 🤕 Not Currently Working (04/2018)

As it relies on the Facebook Graph API to function, this photo wall is not currently working: Facebook has temporarily
disabled apps' access to Events/Groups/etc. Read more [here](https://newsroom.fb.com/news/2018/03/cracking-down-on-platform-abuse/).

### Introduction

This is a photo wall with two effects: a scrolling wall and tossed Polaroids.

![photo wall](https://github.com/clintandrewhall/photo-wall/raw/master/wall.png)

![polaroids](https://github.com/clintandrewhall/photo-wall/raw/master/polaroid.png)

The code is from a pretty early time in my career, so it's a bit hacky, but it works really well, so have fun with it.

It uses the Facebook API to grab photos from either an event or a group on each effect load. So, for example, people can upload photos to an event and they'll automatically get included in the wall, (and the photos get shared with everyone there, how cool is that?)

### Setup

You'll need a couple of things:

* Long-term access token from Facebook with group and event permissions.
* An event, group, or other FBID with an 'images' endpoint.
* A wall title for index.ejs.

You provide the latter. The first you can get by pasting the following into the Facebook [Graph API Explorer](https://developers.facebook.com/tools/explorer/):

    oauth/access_token?grant_type=fb_exchange_token&client_id={client_id}&client_secret={client_secret}&fb_exchange_token={a_short_term_token}

### How to use

    npm install
    npm start

Honestly, you don't even need the node server for this guy, it's just here for convenience. You can serve this as plain-old HTML off of any domain really easily, just copy the public directory to a web server, (or even Dropbox) and the content of index.ejs as index.html.

### Questions? Compliments? Complaints?

Open an issue.
