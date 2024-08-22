import { ViewModel, view } from '@yoskutik/react-vvm'
import { action, computed, makeObservable, observable } from 'mobx'
import cl from './RadialMenu.module.scss'
import { Pos } from '@models/common/Pos'
import { RadialMenuViewModel } from './RadialMenu'
import { fixAngle, windowScalingMethods } from '@renderer/common/PointsLineRounding'

interface Props {
  halfElement: number
  elementIndex: number
  element: RadialElementObject
  editable?: boolean
}

export interface RadialElementObject {
  key: React.Key
  title: string
  onClick: (key: React.Key) => void
}

export class RadialElementViewModel extends ViewModel<RadialMenuViewModel, Props> {
  @computed
  get centerPI() {
    return this.viewProps.halfElement * (2 * this.viewProps.elementIndex)
  }
  halfY: number
  constructor() {
    super()
    makeObservable(this)
    this.halfY = Math.sin(this.viewProps.halfElement)
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
            (this.deltaAngle !== 0 ? this.deltaAngle : this.centerPI) - this.viewProps.halfElement
          ) *
            this.radius,
        50 +
          Math.sin(
            (this.deltaAngle !== 0 ? this.deltaAngle : this.centerPI) - this.viewProps.halfElement
          ) *
            this.radius
      ),
      new Pos(
        50 +
          Math.cos(
            (this.deltaAngle !== 0 ? this.deltaAngle : this.centerPI) + this.viewProps.halfElement
          ) *
            this.radius,
        50 +
          Math.sin(
            (this.deltaAngle !== 0 ? this.deltaAngle : this.centerPI) + this.viewProps.halfElement
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
    const vectCursor = windowScalingMethods.cursorPos.sub(new Pos(50, 50))
    vectCursor.multyMe(1 / vectCursor.lenght)
    if (vectCursor.y > 0) this.deltaAngle = Math.acos(vectCursor.x)
    else this.deltaAngle = Math.PI + Math.acos(-vectCursor.x)
    const imageIndex =
      Math.floor(
        fixAngle(this.deltaAngle - this.viewProps.halfElement) / (this.viewProps.halfElement * 2)
      ) + 1
    if (this.viewProps.elementIndex !== imageIndex)
      this.parent.swapElement(this.viewProps.elementIndex - 1, imageIndex - 1)
  }
  @action
  onMouseDown = () => {
    window.addEventListener('mousemove', this.calcDeltaAngle)
    window.addEventListener('mouseup', this.onMouseUp)
    this.isMoving = true
  }
  @observable
  isMoving = false
  @action
  onMouseUp = () => {
    this.deltaAngle = 0
    this.isMoving = false
    window.removeEventListener('mousemove', this.calcDeltaAngle)
    window.removeEventListener('mouseup', this.onMouseUp)
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
        onMouseDown={viewModel.viewProps.editable ? viewModel.onMouseDown : undefined}
      />
      <path
        d={viewModel.textPath}
        id={'selector_' + viewModel.viewProps.element.key}
        className={cl.ElementTextPath}
      />
      <text textAnchor="middle" className={cl.ElementText}>
        <textPath
          href={'#selector_' + viewModel.viewProps.element.key}
          startOffset={viewModel.radius + '%'}
        >
          {viewModel.viewProps.element.title}
        </textPath>
      </text>
    </g>
  )
})

export default RadialElement
