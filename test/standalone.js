var vows = require('vows'),
    assert = require('assert');

var en = require('..')('en', {
    "just": "template",
    "variable": "Hello, {{$name}}!",
    "modify.text": "oLoLo",
    "modify.lower": "ololo",
    "modify.upper": "OLOLO",
    "modify.capitalize": "Ololo",
    "modify.something": "{{ololo:$text}}",
    "modify.client.lower": "{{lower:$text}}",
    "modify.client.upper": "{{upper:$text}}",
    "modify.client.capitalize": "{{capitalize:$text}}",
    "modify.client.something": "{{ololo:$text}}",
    "plural": "{{$count}} {{plural:$count,fish,fishes}}",
    "plural2": "{{$count}} {{plural:$count,PARROT,PARROTS}}",
    "plural2.animal.single": "parrot",
    "plural2.animal.multiple": "parrots",
    "plural3": "{{$count}} {{plural:$count,lower:$animal.single,lower:$animal.multiple}}",
    "reuse.what": "cat",
    "reuse.died": "CAT died",
    "reuse.dog.what": "dog",
    "reuse.dog.text": "And DOG died too",
    "cycle": "{{$cycle}}",
    "condition1": "{{$condition?yep:nope}}",
    "condition2": "{{$condition?$yep:$no}}",
    "condition3": "{{$condition?cat:$no}}",
    "_plural": "plural=(n != 1)"
});
var ru = require('..')('ru', {
    "plural": "{{$count}} {{plural:$count,рыба,рыбы,рыб}}",
    "_plural": "plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2)"
});
var x = en('just');
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
        },

        subsimpleTrue: {
            topic: en('condition2', {condition: true, yep: 'Agrh'}),
            test: function( topic ){
                assert.equal (topic, 'Agrh');

            }
        },
        subsimpleFalse: {
            topic: en('condition2', {condition: false, no: 'nope'}),
            test: function( topic ){
                assert.equal (topic, 'nope');
            }
        },
        subsimpleTrue2: {
            topic: en('condition2', {condition: 1, yep: 'Agrh2'}),
            test: function( topic ){
                assert.equal (topic, 'Agrh2');
            }
        },
        subsimpleFalse2: {
            topic: en('condition2', {condition: 0, no: 'nope'}),
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