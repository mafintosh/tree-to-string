# tree-to-string


```
npm install tree-to-string
```

## Usage

```js
const treeToString = require('tree-to-string')

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
```

Running the above prints something similar to

```
[ 2 ]─┐
      │
[ 4 ]─┼─[ 3, 5 ]─┐
      │          │
[ 6 ]─┘          ├─[ 7 ]
                 │
           [ 8 ]─┘
```

## API

#### `const str = treeToString(tree, [format])`

Converts a tree to a human friendly string.
The tree should have a layout similar to this

```js
{
  value: someJsObject,
  children: [tree, ...]
}
```

Format defaults to `util.inspect`. Change this to your
own method that pretty prints your object if your prefer.

## License

MIT
