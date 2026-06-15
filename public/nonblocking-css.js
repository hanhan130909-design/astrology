// Script to make CSS non-render-blocking
(function(){
  var links = document.querySelectorAll('link[rel="stylesheet"]');
  for(var i=0;i<links.length;i++){
    var link = links[i];
    // Convert blocking stylesheet to non-blocking
    link.media = 'print';
    link.onload = function(){ this.media = 'all'; this.onload = null; };
    // Also add a noscript fallback
    var noscript = document.createElement('noscript');
    var fallback = document.createElement('link');
    fallback.rel = 'stylesheet';
    fallback.href = link.href;
    noscript.appendChild(fallback);
    link.parentNode.insertBefore(noscript, link.nextSibling);
  }
})();
