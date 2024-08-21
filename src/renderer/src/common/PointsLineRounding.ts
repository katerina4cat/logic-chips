import { Pos } from '@models/common/Pos'
import { makeObservable, observable, runInAction } from 'mobx'

export const roundLen = 25
class WindowScalingMethods {
  constructor() {
    makeObservable(this)
    window.addEventListener('resize', () =>
      runInAction(() => {
        this.scale = new Pos(window.innerWidth / 100, window.innerHeight / 100)
      })
    )
  }
  @observable
  scale = new Pos(window.innerWidth / 100, window.innerHeight / 100)

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
        let vect1 = pos.sub(points[ind - 1])
        let vect2 = pos.sub(points[ind + 1])
        vect1 = pos.sub(vect1.multy(roundLen / vect1.lenght))
        vect2 = pos.sub(vect2.multy(roundLen / vect2.lenght))
        data += `L${vect1.x} ${vect1.y} Q ${pos.x} ${pos.y} ${vect2.x} ${vect2.y} `
      })
    return data
  }
}
export const windowScalingMethods = new WindowScalingMethods()
