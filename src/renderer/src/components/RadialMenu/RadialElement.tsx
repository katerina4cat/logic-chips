import { ViewModel, view } from '@yoskutik/react-vvm'
import { action, computed, makeObservable, observable } from 'mobx'
import cl from './RadialMenu.module.scss'
import { Pos } from '@models/common/Pos'

interface Props {
  halfElement: number
  elementIndex: number
  element: RadialElementObject
}

export interface RadialElementObject {
  key: React.Key
  title: string
  onClick: (key: React.Key) => void
}

export class RadialElementViewModel extends ViewModel<unknown, Props> {
  centerPI: number
  constructor() {
    super()
    makeObservable(this)
    this.centerPI = this.viewProps.halfElement * (2 * this.viewProps.elementIndex)
  }

  @computed
  get textPath() {
    return `M50 50 L${50 + Math.cos(this.centerPI) * 50} ${50 + Math.sin(this.centerPI) * 50}`
  }

  @computed
  get getPointsForElement() {
    const points: Pos[] = []
    points.push(
      new Pos(
        50 + Math.cos(this.centerPI - this.viewProps.halfElement) * this.radius,
        50 + Math.sin(this.centerPI - this.viewProps.halfElement) * this.radius
      )
    )
    points.push(
      new Pos(
        50 + Math.cos(this.centerPI + this.viewProps.halfElement) * this.radius,
        50 + Math.sin(this.centerPI + this.viewProps.halfElement) * this.radius
      )
    )
    return `M50 50 L${points[0].x} ${points[0].y} A ${this.radius} ${this.radius} 0 0 1${points[1].x} ${points[1].y} L50 50}`
  }
  @observable
  radius: number = 40
}
const RadialElement = view(RadialElementViewModel)<Props>(({ viewModel }) => {
  return (
    <g>
      <path
        d={viewModel.getPointsForElement}
        className={cl.Element}
        onMouseEnter={action(() => {
          viewModel.radius = 45
        })}
        onMouseLeave={action(() => {
          viewModel.radius = 40
        })}
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
