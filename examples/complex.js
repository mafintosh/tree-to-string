const toString = require('../')

const tree = {
  value: {foo: 'bar'},
  children: [{
    value: 10,
    children: [{
      value: 3
    }, {
      value: [4],
      children: [{
        value: [2, 3, 4]
      }, {
        value: 6,
        children: [{value: [5]}]
      }, {
        value: 'foo'
      }]
    }]
  }]
}

console.log(toString(tree))
