(function(  ){
    var plural = require('./plural' ),
        cfg = 'localizer',
        fs = require('fs');

    var upCache = {};
    var resolveVar = function( varName, path, locale ){
        if(varName.charAt(0) !== '$')
            return false;
        path = '.'+path;
        varName = varName.substr(1);
        var up = 0,
            data, regexp;

        while(varName.substr(0,3)==='../'){
            varName = varName.substr(3);
            up++;
        }

        // search in child
        regexp = upCache[up] || (upCache[up] = new RegExp('(\\.[^\\.]*){'+up+'}$'));
        data = locale[path.replace( regexp, varName ? '.'+varName: '' ).substr(1)];

        if( data === void 0 ){ // in parent node
            up++;
            regexp = upCache[up] || (upCache[up] = new RegExp('(\\.[^\\.]*){'+up+'}$'));
            data = locale[path.replace( regexp, varName ? '.'+varName: '').substr(1)];
        }
        if( data === void 0 ){
            data = locale[varName];
        }
        return data === void 0 ? false : data;
    };
    var modifiers = {
        plural: function(varName, path, locale){
            var fullResolve = false;
            var token = varName.split(',').map(function(el){
                var result = resolve(el, path, locale);
                fullResolve = fullResolve && result !== false;
                return result || el;
            });
            return wrap('plural:'+token.join(','));
        }
    };
    var singleVar = {
        lower: function(text){
            return text.toLowerCase();
        },
        upper: function(text){
            return text.toUpperCase();
        },
        capitalize: function(text){
            return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
        }
    }, i, singleFactory = function(name){
        return function(varName, path, locale){
            var result = resolveVar(varName, path, locale);
            return result === false ? false : singleVar[name](result+'');
        }
    };

    for( i in singleVar )
        if( singleVar.hasOwnProperty(i) ){
            modifiers[ i ] = singleFactory(i);
        }

    var system = {_comment: 1, _translated: 1, _empty: 1},
        symbol = /[^$a-z_0-9\.\\]/,
        wrap = function(text){
            return '{{'+text+'}}'
        },
        resolve = function(part, path, locale){
            var token = part.split(':'),
                modifier = token.length > 1 && modifiers[token[0]],
                result;
            if( modifier ){
                result = modifier(token.slice(1).join(':'), path, locale);
            }else{
                result = resolveVar( part, path, locale );
            }

            return result;
        };
    var matcher = /(\{\{([^\}\{]*?)\}\})/g;
    var resolveDependances = function(locale){
        var i, out = {};
        for( i in locale )
            if( locale.hasOwnProperty(i) ){
                var last = locale[i], newOne, replaces,
                    changed;
                do{

                    replaces = false;
                    newOne = out[i] = last.replace(matcher, function( all, full, part ){
                        replaces = true;
                        return resolve(part, i, locale) || full;
                    });
                    changed = last !== newOne;

                    last = newOne;

                    if( !replaces ) changed = false;

                }while(changed);

            }
        return out;
    };
    var generate = function( locale, lang, prefix, out ){
        prefix = prefix || '';
        var i, val, key, res, j;
        out = out || {};
        for( i in locale )
            if( locale.hasOwnProperty(i) ){
                val = locale[i];

                if(typeof val === 'string'){
                    if( !(i in system) && i === lang )
                        out[prefix] = val;
                }else{
                    key = prefix ? prefix + '.'+ i : i;
                    res = generate(val, lang, key, out);
                }
            }
        if( !prefix ){
            out = resolveDependances(out);
            out._plural = plural[lang];
        }
        return out;
    };

    var collectLanguages = function( locale, langs ){
        langs = langs || {};
        for( i in locale ){
            if( i in plural && !system[i] )
                langs[i] = true;
            else if( typeof locale[i] === 'object' )
                collectLanguages(locale[i], langs)
        }
        return langs;
    };
    var facade = function(lang, dict) {
        var L = require('./localizer')(lang, lang);
        L.load(lang, dict);
        var locale = L.get(lang);
        return locale;
    };
    facade.build = function( path,cfg ){
        var p = require('path' ),
            fs = require('fs');
        var conf = require(p.join(path,cfg+'/cfg') ),
            locale = require(p.join(path,cfg+'/'+conf.from) ), i,
            langs = collectLanguages(locale);
        for( i in langs )
            if( langs.hasOwnProperty(i) ){
                var data = ';Localizer.load("' + i + '", ' + JSON.stringify( generate( locale, i ), true, 1 ) + ');';
                fs.writeFileSync(
                    p.join( path, conf.build + '/locale.' + i + '.js' ),
                    data);
            }

    };
    facade.load = function( path, cfg ){
        var p = require('path');
        var conf = require(p.join(path,cfg+'/cfg') );
        var loc = require('./client');
        return loc(p.join(path,conf.build+'/'));
    }
    module.exports = facade;

})();