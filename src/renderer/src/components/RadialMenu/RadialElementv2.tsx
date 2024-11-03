import { ViewModel, view } from '@yoskutik/react-vvm'
import { action, computed, makeObservable, observable } from 'mobx'
import { RadialMenuViewModel } from './RadialMenu'
import { Pos } from '@models/common/Pos'
import cl from './RadialMenu.module.scss'
import { windowScalingMethods, fixAngle } from '@renderer/common/PointsLineRounding'
import { createRef } from 'react'

interface Props {
  elementIndex: number
  element: any
  title: (v: any) => string
  onClick?: (element: string) => void
}

export class RadialElementv2ViewModel extends ViewModel<RadialMenuViewModel, Props> {
  constructor() {
    super()
    makeObservable(this)
  }

  @observable
  deltaAngle = 0

  @computed
  get centerElementAngle() {
    return this.parent.halfElement * 2 * this.viewProps.elementIndex
  }
  @computed
  get centerElementAngleFloating() {
    return this.centerElementAngle + this.deltaAngle
  }

  @computed
  get getPointsForElement() {
    const v1 = new Pos(this.radius, 0)
      .rotateMe(this.centerElementAngleFloating - this.parent.halfElement)
      .addMe(new Pos(50, 50))
    const v2 = new Pos(this.radius, 0)
      .rotateMe(this.centerElementAngleFloating + this.parent.halfElement)
      .addMe(new Pos(50, 50))
    if (this.parent.viewProps.elements.length === 1)
      return `M50 50 L${v1.x} ${v1.y + 0.0001} A ${this.radius} ${this.radius} 0 1 0 ${v2.x} ${v2.y} L50 50`
    return `M50 50 L${v1.x} ${v1.y} A ${this.radius} ${this.radius} 0 0 1 ${v2.x} ${v2.y} L50 50`
  }
  @computed
  get textPath() {
    const vText = new Pos(this.radius, 0)
      .rotateMe(this.centerElementAngleFloating)
      .addMe(new Pos(50, 50))
    if (Math.cos(this.centerElementAngleFloating) > 0)
      return `M` + [`50 50`, `${vText.x} ${vText.y}`].join(' L')
    else return `M` + [`${vText.x} ${vText.y}`, `50 50`].join(' L')
  }

  @observable
  isMoving = false
  @observable
  radius = 40
  startDeltaAngle = 0

  @action
  calcDeltaAngle = () => {
    const vectCursor = windowScalingMethods.cursorPos.sub(this.parent.centerRadial).normalized
    this.deltaAngle = vectCursor.angle - this.startDeltaAngle
    const imageIndex = Math.round(
      (this.centerElementAngle + this.deltaAngle) / (this.parent.halfElement * 2)
    )
    this.startDeltaAngle +=
      this.parent.halfElement * this.parent.swapElement(this.viewProps.elementIndex, imageIndex)
  }
  @action
  onMouseDown = () => {
    if (this.parent.viewProps.elements.length === 1) return
    this.startDeltaAngle = windowScalingMethods.cursorPos.sub(
      this.parent.centerRadial
    ).normalized.angle
    window.addEventListener('mousemove', this.calcDeltaAngle)
    window.addEventListener('mouseup', this.onMouseUp)
    this.isMoving = true
    this.downTime = Date.now()
  }
  downTime: number = 0
  @action
  onMouseUp = () => {
    this.isMoving = false
    this.startDeltaAngle = 0
    this.deltaAngle = 0
    window.removeEventListener('mousemove', this.calcDeltaAngle)
    window.removeEventListener('mouseup', this.onMouseUp)
    if (Date.now() - this.downTime < 150)
      this.viewProps.onClick && this.viewProps.onClick(this.viewProps.element)
  }
  textRef = createRef<SVGTextPathElement>()
}
const RadialElementv2 = view(RadialElementv2ViewModel)<Props>(({ viewModel }) => {
  return (
    <g>
      <path
        d={viewModel.getPointsForElement}
        className={viewModel.isMoving ? cl.ElementMoving : cl.Element}
        onClick={(e) => e.stopPropagation()}
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
        id={'selector_' + viewModel.viewProps.element}
        className={cl.ElementTextPath}
      />
      <text textAnchor="middle" className={cl.ElementText}>
        <textPath
          href={'#selector_' + viewModel.viewProps.element}
          startOffset={viewModel.radius + '%'}
        >
          {viewModel.viewProps.title(viewModel.viewProps.element)}
        </textPath>
      </text>
    </g>
  )
})

export default RadialElementv2
