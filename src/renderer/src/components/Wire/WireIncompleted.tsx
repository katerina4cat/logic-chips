import { ViewModel, view } from '@yoskutik/react-vvm'
import { action, computed, makeObservable, observable, reaction } from 'mobx'
import cl from './ViewWire.module.scss'
import { Pin } from '@models/Pin'
import { windowScalingMethods } from '@renderer/common/PointsLineRounding'
import { Pos } from '@models/common/Pos'
import { wireConnector } from '@renderer/common/GlobalVariables'
import { EditViewModel } from '@renderer/pages/edit/Edit'

interface Props {}

export class WireIncompletedViewModel extends ViewModel<EditViewModel, Props> {
  constructor() {
    super()
    makeObservable(this)
    wireConnector.current = this.selectPin
    reaction(
      () => this.from,
      () => {
        if (this.from) {
          this.cursorPos = this.from.pos.copy
          window.addEventListener('mousemove', this.mouseMove)
          window.addEventListener('keydown', this.stopCheck)
          this.parent.svgRef.current?.addEventListener('click', this.svgClick)
        } else {
          window.removeEventListener('mousemove', this.mouseMove)
          this.parent.svgRef.current?.removeEventListener('click', this.svgClick)
        }
      }
    )
  }
  @action
  stopCheck = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      this.points = []
      this.from = undefined
      window.removeEventListener('mousemove', this.mouseMove)
      window.removeEventListener('keydown', this.stopCheck)
      this.parent.svgRef.current?.removeEventListener('click', this.svgClick)
    }
  }

  @action
  mouseMove = (e: MouseEvent) => {
    this.cursorPos = new Pos(
      e.pageX / windowScalingMethods.scale.x,
      e.pageY / windowScalingMethods.scale.y
    )
  }
  @action
  svgClick = () => {
    this.points.push(this.cursorPos.copy)
  }

  @action
  selectPin = (pin?: Pin) => {
    this.from = pin
  }

  @observable
  from?: Pin
  @observable
  points: Pos[] = []
  @observable
  cursorPos: Pos = new Pos()

  @computed
  get data() {
    if (!this.from) return undefined
    return windowScalingMethods.roundLinePoints([this.from.pos, ...this.points, this.cursorPos])
  }
}
const WireIncompleted = view(WireIncompletedViewModel)<Props>(({ viewModel }) => {
  return (
    <path
      className={cl.Wire}
      style={{ pointerEvents: 'none', stroke: viewModel.from?.stateColor }}
      d={viewModel.data}
    />
  )
})

export default WireIncompleted
