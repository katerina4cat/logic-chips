export class Pos {
  x: number
  y: number
  constructor(x: number = 0, y: number = 0) {
    this.x = x
    this.y = y
  }
  add = (pos: Pos) => {
    this.x += pos.x
    this.y += pos.y
    return this
  }
  sum = (pos: Pos) => new Pos(this.x + pos.x, this.y + pos.y)
  sub = (pos: Pos) => {
    this.x -= pos.x
    this.y -= pos.y
    return this
  }
  dif = (pos: Pos) => new Pos(this.x - pos.x, this.y - pos.y)
  reverseMe = (x: boolean = true, y: boolean = true) => {
    if (x) this.x = -this.x
    if (y) this.y = -this.y
    return this
  }
  reversed = (x: boolean = true, y: boolean = true) =>
    new Pos(x ? -this.x : this.x, y ? -this.y : this.y)
  multy = (pos: Pos) => {
    this.x *= pos.x
    this.y *= pos.y
    return this
  }

  multyd = (pos: Pos) => new Pos(this.x * pos.x, this.y * pos.y)
}
