var hasModule = (typeof module !== 'undefined' && module && module.exports);
var cache = {}, lang = {}, path;
var Localizer = function( p, locale ){

        if( !this.instance )
            return new Localizer(p, locale);

        path = path || p;
        if(!locale)
            return;
        this.locale = locale;
        if(cache[locale])
            return cache[locale];
        else
            cache[locale] = this;
        lang[locale] && (this.voc = lang[locale]);


    },
    pluralCache = {},
    modifiers = {
        plural: function( data, income ){

            var _self = this;
            var token = data.split(',').map(function(el){
                    var result = _self.templater(el, income);
                    return result || el;
                } ),
                fn = pluralCache[this.locale] = pluralCache[this.locale] ||
                    new Function('n','return ('+this.voc._plural+')|0;');
            return token[fn(parseInt(token[0],10))+1];
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
    return function(data, income){//} varName, path, locale){
        var result = this.vars(data,income);

        return singleVar[name](result+'');
    }
};

for( i in singleVar )
    if( singleVar.hasOwnProperty(i) ){
        modifiers[ i ] = singleFactory(i);
    }
Localizer.load = function( locale, data ){
    lang[locale] = data;
    cache[locale] && (cache[locale].voc = data);

};
var matcher = /(\{\{([^\}\{]*?)\}\})/g;
var upCache = {};
Localizer.prototype = {
    plugin: function( name, fn ){
        modifiers[name] = fn;
        return this;
    },
    load: Localizer.load,
    instance: true,
    get: function( locale ){
        if(!locale)
            return;
        var l = this;
        if(this.locale !== locale){
            return (new Localizer( path, locale )).get(locale);
        }else{
            this.initLocale( this.locale );
            cache[locale] = this;
        }
        return l.text.bind(l);
    },
    initLocale: function( locale, cb ){
        if( !lang[locale] )
            if( hasModule ){
                require(path+'locale.'+locale+'.js');
            }else{

            }
        else
            this.voc = lang[locale];


    },
    modifier: function( name, data, income, tplName ){
        var modifier = modifiers[name];
        if( !modifier )
            throw new Error('No modifier: `'+ name +'`! In '+ tplName);
        return modifier.call(this,data,income,tplName);
    },
    vars: function( varName, income ){

        if(varName.charAt(0) !== '$')
            return false;
        varName = varName.substr(1);
        var data;

        if(data = income[varName])
            return data;
        if( varName.indexOf('.'))
            return varName.split('.').reduce( function( a, b ){
                return a[b] === void 0 ? '' : a[b];
            }, income);
        return '';
    },
    logic: function(condition, results, data) {
        var cond = this.templater(condition, data)?0:1;
        var result = results[cond];
        return this.vars(result, data) || result;
    },
    templater: function( part, data ){
        var modifier, start = part.indexOf(':'), result;
        if( start > -1 ){
            var ternar = part.indexOf('?');
            if(ternar>-1){
                result = this.logic( part.substr(0,ternar), part.substr(ternar + 1).split(':'), data );
            }else{
                modifier = part.substr(0,start);
                result = this.modifier( modifier, part.substr( start + 1 ), data );
            }

        }else{
            result = this.vars(part, data);
        }
        return result === void 0 ? '' : result;
    },
    resolve: function( tpl, data ){

        var _this = this;
        return tpl.replace(matcher, function( all, full, part ){
            return _this.templater(part,data);
        });
    },
    text: function( tplName, data ){
        var tpl = this.voc[tplName];
        if(!tpl) throw new Error('No template for `'+tplName+'`');
        if( tpl.indexOf('{{') > -1 ){
            return this.resolve(tpl, data || {}, tplName);
        }
        return tpl;
    }
};
module.exports = Localizer;