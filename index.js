const util = require('util')

module.exports = treeToString

function treeToString (tree, format) {
  if (!format) format = util.inspect
  return draw(tree).toString()

  function draw (tree) {
    const value = new Box(format(tree.values || tree.value))

    if (!tree.children || !tree.children.length) {
      value.hook = Math.floor(value.height / 2)
      return value
    }

    const box = new Box()
    const children = tree.children.map(draw)
    const widest = children.reduce(pickWidest)
    const connects = []
    var y = 0

    for (const child of children) {
      box.insert(widest.width - child.width, y, child)
      box.lineX(widest.width, widest.width + 1, child.hook + y)
      connects.push(child.hook + y)
      y += child.height + 1
    }

    const btm = connects[0]
    const top = connects[connects.length - 1]
    const hook = Math.floor((top + btm) / 2)

    if (connects.length > 1) box.lineY(btm, top, widest.width + 1)
    box.lineX(widest.width + 1, widest.width + 2, hook)
    y = hook - Math.floor(value.height / 2)
    if (y < 0) {
      box.indentY(-y)
      y = 0
    }
    box.insert(widest.width + 3, y, value)
    box.hook = hook
    return box
  }
}

function pickWidest (a, b) {
  return a.width > b.width ? a : b
}

function Box (str) {
  this.lines = []
  this.width = 0
  this.height = 0
  this.hook = 0

  if (str) {
    const lines = str.split('\n')
    for (var i = 0; i < lines.length; i++) this.set(0, i, lines[i])
  }
}

Box.prototype.indentY = function (n) {
  while (n-- > 0) this.lines.unshift('')
}

Box.prototype.lineX = function (x0, x1, y) {
  if (x1 < x0) return this.lineX(x1, x0, y)
  this._line(x0++, y, 0b000011000)
  while (x0 < x1) this._line(x0++, y, 0b000111000)
  if (x0 === x1) this._line(x0, y, 0b000110000)
}

Box.prototype.lineY = function (y0, y1, x) {
  if (y1 < y0) return this.lineY(y1, y0, x)
  this._line(x, y0++, 0b000010010)
  while (y0 < y1) this._line(x, y0++, 0b010010010)
  if (y0 === y1) this._line(x, y0, 0b010010000)
}

Box.prototype._line = function (x, y, n) {
  this.set(x, y,
    toChar(n |
      ((toInt(this.get(x, y - 1)) & 0b000000111) ? 0b010000000 : 0) |
      ((toInt(this.get(x, y + 1)) & 0b111000000) ? 0b000000010 : 0) |
      ((toInt(this.get(x - 1, y)) & 0b001001001) ? 0b000100000 : 0) |
      ((toInt(this.get(x + 1, y)) & 0b100100100) ? 0b000001000 : 0)
    )
  )
}

Box.prototype.get = function (x, y) {
  if (x < 0 || y < 0 || y >= this.lines.length) return ''
  const line = this.lines[y]
  return x < line.length ? line[x] : ''
}

Box.prototype.set = function (x, y, val) {
  while (this.lines.length <= y) {
    this.height++
    this.lines.push('')
  }

  var line = this.lines[y]
  while (line.length <= x) line += ' '

  if (line.length === x) {
    this.lines[y] = line + val
  } else {
    this.lines[y] = line.slice(0, x) + val + line.slice(x + val.length)
  }

  if (x + val.length > this.width) this.width = x + val.length
}

Box.prototype.toString = function () {
  return this.lines.join('\n')
}

Box.prototype.insert = function (x, y, box) {
  if (typeof box === 'string') box = new Box(box)
  for (var i = 0; i < box.lines.length; i++) {
    this.set(x, y + i, box.lines[i])
  }
}

function toChar (i) {
  switch (i) {
    case 0b010110000: return '┘'
    case 0b000110010: return '┐'
    case 0b000011010: return '┌'
    case 0b010011000: return '└'
    case 0b010110010: return '┤'
    case 0b010111000: return '┴'
    case 0b000111010: return '┬'
    case 0b010011010: return '├'
    case 0b000110000:
    case 0b000011000:
    case 0b000111000: return '─'
    case 0b010010000:
    case 0b000010010:
    case 0b010010010: return '│'
    case 0b010111010: return '┼'
  }

  return ''
}

function toInt (ch) {
  switch (ch) {
    case '┘': return 0b010110000
    case '┐': return 0b000110010
    case '┌': return 0b000011010
    case '└': return 0b010011000
    case '┤': return 0b010110010
    case '┴': return 0b010111000
    case '┬': return 0b000111010
    case '├': return 0b010011010
    case '─': return 0b000111000
    case '│': return 0b010010010
    case '┼': return 0b010111010
  }

  return 0
}
