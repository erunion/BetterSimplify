//AUTOGENERATED, DO NOT EDIT MANUALLY

(function () {
  // All supported sites are listed here
  var scripts = {
  "play.google.com" : "data/google-music.js", 
"pandora.com" : "data/pandora.js", 
"app.plex.tv" : "data/plex.js", 
"localhost" : "data/plex.js", 
"127.0.0.1" : "data/plex.js", 
"play.pocketcasts.com" : "data/pocketcasts.js"
  };

  // Checking if current site is listed
  if (scripts[location.hostname.replace('www.', '')] != null) {
    // Core API injection
    var core = document.createElement('script');
    core.src = chrome.extension.getURL('data/simplify.js');
    (document.head || document.documentElement).appendChild(core);

    // Particular script injection
    var script = document.createElement('script');
    script.src = chrome.extension.getURL(scripts[location.host.replace('www.', '')]);
    (document.head || document.documentElement).appendChild(script);
  }
}());
