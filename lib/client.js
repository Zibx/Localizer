;(function(  ){
    var globalScope = typeof global !== 'undefined' ? global : this,
        hasModule = (typeof module !== 'undefined' && module && module.exports);
    var Localizer = require('./localizer');

    /************************************
        Exposing Moment
    ************************************/

    function makeGlobal() {
        if (typeof ender !== 'undefined') {
            return;
        }
        globalScope.Localizer = Localizer;
    }

    // CommonJS module is defined
    if (hasModule) {
        module.exports = Localizer;
    }
    makeGlobal();
}).call(this);