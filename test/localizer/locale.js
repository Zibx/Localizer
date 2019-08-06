module.exports = {
    'just': {
        en: 'template',
        en2: 'some other'
    },
    variable: {
        en: 'Hello, {{$name}}!'
    },
    modify: {
        text: {
            en: 'oLoLo'
        },
        lower: {
            en: '{{lower:$text}}'
        },
        upper: {
            en: '{{upper:$text}}'
        },
        capitalize: {
            en: '{{capitalize:$text}}'
        },
        something: {
            en: '{{ololo:$text}}'
        },
        client: {
            lower: {
                en: '{{lower:$text}}'
            },
            upper: {
                en: '{{upper:$text}}'
            },
            capitalize: {
                en: '{{capitalize:$text}}'
            },
            something: {
                en: '{{ololo:$text}}'
            }
        }
    },
    plural: {
        en: '{{$count}} {{plural:$count,fish,fishes}}',
        ru: '{{$count}} {{plural:$count,рыба,рыбы,рыб}}'
    },
    plural2: {
        en: '{{$count}} {{plural:$count,upper:$animal.single,upper:$animal.multiple}}',
        animal: {
            single: {
                en: 'parrot'
            },
            multiple: {
                en: 'parrots'
            }
        }
    },
    plural3: {
        en: '{{$count}} {{plural:$count,lower:$animal.single,lower:$animal.multiple}}'
    },
    reuse: {
        what: {
            en: 'cat'
        },
        died: {
            en: '{{upper:$what}} died'
        },
        dog: {
            what: {en:'dog'},
            text: {en: 'And {{$../died}} too'}
        }
    },
    cycle: {
        en: '{{$cycle}}'
    },

    condition1: {en: '{{$condition?yep:nope}}'},
    condition2: {en: '{{$condition?$yep:$no}}'},
    condition3: {en: '{{$condition?{{$reuse.what}}:$no}}'},



};