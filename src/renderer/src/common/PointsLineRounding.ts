import { Pos } from '@models/common/Pos'
import { makeObservable, observable, runInAction } from 'mobx'
export const fixAngle = (angle: number) => ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
export const roundLen = 25
class WindowScalingMethods {
  constructor() {
    makeObservable(this)
    window.addEventListener('resize', () =>
      runInAction(() => {
        this.scale = new Pos(window.innerWidth / 100, window.innerHeight / 100)
      })
    )
    window.addEventListener('mousemove', (e) => {
      runInAction(() => {
        this.cursorPos = new Pos(e.pageX / this.scale.x, e.pageY / this.scale.y)
      })
    })
  }
  @observable
  scale = new Pos(window.innerWidth / 100, window.innerHeight / 100)
  @observable
  cursorPos = new Pos(0, 0)

  roundLinePoints = (points: Pos[]) => {
    let data = ``
    points
      .map((pos) => pos.multy(this.scale))
      .forEach((pos, ind, points) => {
        if (ind === 0) {
          data += `M${pos.x} ${pos.y} `
          return
        }
        if (ind === points.length - 1) {
          data += `L${pos.x} ${pos.y}`
          return
        }
        let vect2 = pos.sub(points[ind + 1])
        if (vect2.lenght !== 0) {
          let vect1 = pos.sub(points[ind - 1])
          vect1 = pos.sub(vect1.multy(vect1.lenght > roundLen ? roundLen / vect1.lenght : 1))
          vect2 = pos.sub(vect2.multy(vect2.lenght > roundLen ? roundLen / vect2.lenght : 1))
          data += `L${vect1.x} ${vect1.y} Q ${pos.x} ${pos.y} ${vect2.x} ${vect2.y} `
        }
      })
    return data
  }
}
export const windowScalingMethods = new WindowScalingMethods()
