import { ViewModel, view } from '@yoskutik/react-vvm'
import { action, computed, makeObservable, observable } from 'mobx'
import cl from './RadialMenu.module.scss'
import { Pos } from '@models/common/Pos'
import { RadialMenuViewModel } from './RadialMenu'
import { fixAngle, windowScalingMethods } from '@renderer/common/PointsLineRounding'

interface Props {
  elementIndex: number
  element: any
  title: (v: any) => string
  onClick: (element: string) => void
}

export class RadialElementViewModel extends ViewModel<RadialMenuViewModel, Props> {
  @computed
  get centerPI() {
    return this.parent.halfElement * (2 * this.viewProps.elementIndex)
  }
  halfY: number
  constructor() {
    super()
    makeObservable(this)
    this.halfY = Math.sin(this.parent.halfElement)
  }
  @computed
  get textPath() {
    return `M50 50 L${50 + Math.cos(this.deltaAngle !== 0 ? this.deltaAngle : this.centerPI) * 50} ${50 + Math.sin(this.deltaAngle !== 0 ? this.deltaAngle : this.centerPI) * 50}`
  }

  @computed
  get getPointsForElement() {
    const points: Pos[] = [
      new Pos(
        50 +
          Math.cos(
            (this.deltaAngle !== 0 ? this.deltaAngle : this.centerPI) - this.parent.halfElement
          ) *
            this.radius,
        50 +
          Math.sin(
            (this.deltaAngle !== 0 ? this.deltaAngle : this.centerPI) - this.parent.halfElement
          ) *
            this.radius
      ),
      new Pos(
        50 +
          Math.cos(
            (this.deltaAngle !== 0 ? this.deltaAngle : this.centerPI) + this.parent.halfElement
          ) *
            this.radius,
        50 +
          Math.sin(
            (this.deltaAngle !== 0 ? this.deltaAngle : this.centerPI) + this.parent.halfElement
          ) *
            this.radius
      )
    ]
    return `M50 50 L${points[0].x} ${points[0].y} A ${this.radius} ${this.radius} 0 0 1${points[1].x} ${points[1].y} L50 50`
  }
  @observable
  radius: number = 40
  @observable
  deltaAngle: number = 0
  @action
  calcDeltaAngle = () => {
    const vectCursor = windowScalingMethods.cursorPos.sub(this.parent.centerRadial)
    vectCursor.multyMe(1 / vectCursor.lenght)
    if (vectCursor.y > 0) this.deltaAngle = Math.acos(vectCursor.x)
    else this.deltaAngle = Math.PI + Math.acos(-vectCursor.x)
    const imageIndex =
      Math.floor(
        fixAngle(this.deltaAngle - this.parent.halfElement) / (this.parent.halfElement * 2)
      ) + 1
    if (this.viewProps.elementIndex !== imageIndex)
      this.parent.swapElement(this.viewProps.elementIndex - 1, imageIndex - 1)
  }
  @action
  onMouseDown = () => {
    window.addEventListener('mousemove', this.calcDeltaAngle)
    window.addEventListener('mouseup', this.onMouseUp)
    this.isMoving = true
    this.downTime = Date.now()
  }
  downTime: number = 0
  @observable
  isMoving = false
  @action
  onMouseUp = () => {
    this.deltaAngle = 0
    this.isMoving = false
    window.removeEventListener('mousemove', this.calcDeltaAngle)
    window.removeEventListener('mouseup', this.onMouseUp)
    if (Date.now() - this.downTime < 150) this.viewProps.onClick(this.viewProps.element)
  }
}
const RadialElement = view(RadialElementViewModel)<Props>(({ viewModel }) => {
  return (
    <g>
      <path
        d={viewModel.getPointsForElement}
        className={viewModel.isMoving ? cl.ElementMoving : cl.Element}
        onMouseEnter={action(() => {
          if (!viewModel.isMoving) viewModel.radius = 45
        })}
        onMouseLeave={action(() => {
          viewModel.radius = 40
        })}
        onMouseDown={viewModel.parent.viewProps.editable ? viewModel.onMouseDown : undefined}
      />
      <path
        d={viewModel.textPath}
        id={'selector_' + viewModel.viewProps.element + viewModel.viewProps.elementIndex}
        className={cl.ElementTextPath}
      />
      <text textAnchor="middle" className={cl.ElementText}>
        <textPath
          href={'#selector_' + viewModel.viewProps.element + viewModel.viewProps.elementIndex}
          startOffset={viewModel.radius + '%'}
        >
          {viewModel.viewProps.title(viewModel.viewProps.element)}
        </textPath>
      </text>
    </g>
  )
})

export default RadialElement
