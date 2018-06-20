const treeToString = require('../')

const tree = {
  value: [7],
  children: [{
    value: [3, 5],
    children: [{
      value: [2]
    }, {
      value: [4]
    }, {
      value: [6]
    }]
  }, {
    value: [8]
  }]
}

console.log(treeToString(tree))
