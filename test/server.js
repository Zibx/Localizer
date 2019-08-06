var vows = require('vows'),
    assert = require('assert');

require('..').build(__dirname,'localizer');

global.Localizer = require('..').load(__dirname, 'localizer');
console.log(Localizer);
var en = Localizer.get('en' ),
    ru = Localizer.get('ru');

vows.describe('Localization').addBatch({
    'simple': {
        topic: en('just'),
        test: function (topic) {
            assert.equal (topic, 'template');
        }
    },
    'variable': {
        topic: en('variable',{name: 'Tom'}),
        test: function (topic) {
            assert.equal (topic, 'Hello, Tom!');
        }
    },
    'empty data': {
        topic: en('variable'),
        test: function (topic) {
            assert.equal (topic, 'Hello, !');
        }
    },
    'modifiers': {
        lower: {
            topic: en( 'modify.client.lower', {text: 'oLoLo'} ),
            test: function( topic ){
                assert.equal( topic, 'ololo' );
            }
        },
        upper: {
            topic: en( 'modify.client.upper', {text: 'oLoLo'} ),
            test: function( topic ){
                assert.equal( topic, 'OLOLO' );
            }
        },
        emptyDataLower: {
            topic: en( 'modify.client.lower' ),
            test: function( topic ){
                assert.equal( topic, '' );
            }
        },
        capitalize: {
            topic: en( 'modify.client.capitalize', {text: 'oLoLo'} ),
            test: function( topic ){
                assert.equal( topic, 'Ololo' );
            }
        }
    },
    plural: {
        one: {
            topic: en('plural',{count:1}),
            test: function( topic ){
                assert.equal (topic, '1 fish');
            }
        },
        two: {
            topic: en('plural',{count:2}),
            test: function( topic ){
                assert.equal (topic, '2 fishes');
            }
        }
    },
    plural2: {
        crazy_full_test1: {
            topic: en( 'plural2', {count: 1} ),
            test: function( topic ){
                assert.equal (topic, '1 PARROT');
            }
        },
        crazy_full_test2: {
            topic: en( 'plural2', {count: 2} ),
            test: function( topic ){
                assert.equal (topic, '2 PARROTS');
            }
        }
    },
    plural3: {
        crazy_full_test1: {
            topic: en( 'plural3', {count: 1, animal: {single: 'dOlPhIn', multiple: 'dolPhins'}} ),
            test: function( topic ){
                assert.equal (topic, '1 dolphin');
            }
        },
        crazy_full_test2: {
            topic: en( 'plural3', {count: 2, animal: {single: 'dOlPhIn', multiple: 'dolPhins'}} ),
            test: function( topic ){
                assert.equal (topic, '2 dolphins');
            }
        }
    },
    lower_unexisted: {
        topic: en('plural3', {}),
        test: function( topic ){
            assert.equal (topic, ' lower:$animal.multiple');
        }
    },
    conditions: {
        simpleTrue: {
            topic: en('condition1', {condition: true}),
            test: function( topic ){
                assert.equal (topic, 'yep');
            }
        },
        simpleFalse: {
            topic: en('condition1', {condition: false}),
            test: function( topic ){
                assert.equal (topic, 'nope');
            }
        },
        simpleTrue2: {
            topic: en('condition1', {condition: 1}),
            test: function( topic ){
                assert.equal (topic, 'yep');
            }
        },
        simpleFalse2: {
            topic: en('condition1', {condition: 0}),
            test: function( topic ){
                assert.equal (topic, 'nope');
            }
        }

    },
    cycle: {
        cycle: {
            topic: en('cycle',{cycle: 'recursion'}),
            test: function( topic ){
                assert.equal (topic, 'recursion');
            }
        }
    },
    cyrilic_plural: {
        1: {
            topic: ru('plural', {count: 1}),
            test: function( topic ){
                assert.equal (topic, '1 рыба');
            }
        },
        2: {
            topic: ru('plural', {count: 2}),
            test: function( topic ){
                assert.equal (topic, '2 рыбы');
            }
        },
        3: {
            topic: ru('plural', {count: 3}),
            test: function( topic ){
                assert.equal (topic, '3 рыбы');
            }
        },
        4: {
            topic: ru('plural', {count: 4}),
            test: function( topic ){
                assert.equal (topic, '4 рыбы');
            }
        },
        5: {
            topic: ru('plural', {count: 5}),
            test: function( topic ){
                assert.equal (topic, '5 рыб');
            }
        },
        6: {
            topic: ru('plural', {count: 6}),
            test: function( topic ){
                assert.equal (topic, '6 рыб');
            }
        },
        0: {
            topic: ru('plural', {count: 0}),
            test: function( topic ){
                assert.equal (topic, '0 рыб');
            }
        }
    }

}).export(module);