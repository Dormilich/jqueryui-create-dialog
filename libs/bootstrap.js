// polyfills

// PhantomJS 
if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
        if (typeof this !== 'function') {
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }

        var aArgs   = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP    = function() {},
            fBound  = function() {
                return fToBind.apply(this instanceof fNOP
                       ? this
                       : oThis,
                       aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}

// load jQuery
(function() {
    var path = '../libs/jquery/jquery.js';
    var jqversion = location.search.match(/[?&]jquery=(.*?)(?=&|$)/);

    if (jqversion) {
        path = 'http://code.jquery.com/jquery-' + jqversion[1] + '.min.js';
    }
    document.write('<script src="' + path + '"></script>');
}());

// load jQueryUI
(function() {
    var path = '../libs/jquery-ui/jquery-ui.js';
    var version = location.search.match(/[?&]jquery-ui=(.*?)(?=&|$)/);

    if (version) {
        path = 'http://code.jquery.com/ui/' + version[1] + '.min.js';
    }
    document.write('<script src="' + path + '"></script>');
}());
