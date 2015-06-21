(function() {
  // Default to the local version.
  var path = '../libs/jquery-ui/jquery-ui.js';
  // Get any jquery-ui=___ param from the query string.
  var version = location.search.match(/[?&]jquery-ui=(.*?)(?=&|$)/);
  // If a version was specified, use that version from code.jquery.com.
  if (version) {
    path = 'http://code.jquery.com/ui/' + version[1] + '.min.js';
  }
  // This is the only time I'll ever use document.write, I promise!
  document.write('<script src="' + path + '"></script>');
}());
