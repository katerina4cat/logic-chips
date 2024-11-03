import { makeObservable, observable } from 'mobx'

export class Pos {
  @observable
  x: number
  @observable
  y: number
  get copy() {
    return new Pos(this.x, this.y)
  }
  constructor(x: number = 0, y: number = 0) {
    this.x = x
    this.y = y
    makeObservable(this)
  }
  get lenght() {
    return Math.sqrt(this.x ** 2 + this.y ** 2)
  }

  get normalized() {
    return this.copy.multyMe(1 / this.lenght)
  }

  get angle() {
    return Math.acos(this.x) * Math.sign(this.y)
  }

  rotate = (angle: number) => {
    return new Pos(
      this.x * Math.cos(angle) - this.y * Math.sin(angle),
      this.x * Math.sin(angle) + this.y * Math.cos(angle)
    )
  }

  rotateMe = (angle: number) => {
    const x = this.x * Math.cos(angle) - this.y * Math.sin(angle)
    this.y = this.x * Math.sin(angle) + this.y * Math.cos(angle)
    this.x = x
    return this
  }

  addMe = (pos: Pos) => {
    this.x += pos.x
    this.y += pos.y
    return this
  }
  add = (pos: Pos) => new Pos(this.x + pos.x, this.y + pos.y)
  subMe = (pos: Pos) => {
    this.x -= pos.x
    this.y -= pos.y
    return this
  }
  sub = (pos: Pos) => new Pos(this.x - pos.x, this.y - pos.y)
  reverseMe = (x: boolean = true, y: boolean = true) => {
    if (x) this.x = -this.x
    if (y) this.y = -this.y
    return this
  }
  reversed = (x: boolean = true, y: boolean = true) =>
    new Pos(x ? -this.x : this.x, y ? -this.y : this.y)
  multyMe = (pos: Pos | number) => {
    if (pos instanceof Pos) {
      this.x *= pos.x
      this.y *= pos.y
    } else {
      this.x *= pos
      this.y *= pos
    }
    return this
  }

  multy = (pos: Pos | number) =>
    pos instanceof Pos
      ? new Pos(this.x * pos.x, this.y * pos.y)
      : new Pos(this.x * pos, this.y * pos)

  divMe = (pos: Pos | number) => {
    if (pos instanceof Pos) {
      this.x /= pos.x
      this.y /= pos.y
    } else {
      this.x /= pos
      this.y /= pos
    }
    return this
  }

  div = (pos: Pos | number) =>
    pos instanceof Pos
      ? new Pos(this.x / pos.x, this.y / pos.y)
      : new Pos(this.x / pos, this.y / pos)
}
