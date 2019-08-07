const L = require('..')('en', {
    greeting: 'Hello, {{$userName}}!',
    big: 'Hello, {{upper:$userName}}!',
    fish: 'You ve just catch {{$count}} {{plural:$count,fish,fishes}}',
    // You have to use correct plural function
    _plural: "plural=(n != 1)"
});

console.log(L('greeting', {userName: 'Hulio'}));
// > Hello, Hulio

console.log(L('big', {userName: 'Pedro'}));
// > Hello, PEDRO!

console.log(L('fish', {count: 1}));
// > You ve just catch 1 fish!

console.log(L('fish', {count: 3}));
// > You ve just catch 3 fishes!