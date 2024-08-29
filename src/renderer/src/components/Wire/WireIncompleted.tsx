import { ViewModel, view } from '@yoskutik/react-vvm'
import { action, computed, makeObservable, observable, reaction } from 'mobx'
import cl from './ViewWire.module.scss'
import { Pin } from '@models/Pin'
import { windowScalingMethods } from '@renderer/common/PointsLineRounding'
import { Pos } from '@models/common/Pos'
import { wireConnector } from '@renderer/common/GlobalVariables'
import { EditViewModel } from '@renderer/pages/edit/Edit'
import { Wire } from '@models/Wire'
import { SimulatingError } from '@models/common/SimulatingError'
import { STATE } from '@models/STATE'

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
          window.addEventListener('keydown', this.stopCheck)
          this.parent.svgRef.current?.addEventListener('click', this.svgClick)
        } else {
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
      window.removeEventListener('keydown', this.stopCheck)
      this.parent.svgRef.current?.removeEventListener('click', this.svgClick)
    }
    if (e.key.toLocaleLowerCase() === 'z' || e.key.toLocaleLowerCase() === 'я') {
      this.points.pop()
    }
  }
  @action
  svgClick = () => {
    this.points.push(windowScalingMethods.cursorPos.copy)
  }

  @action
  selectPin = (pin?: Pin, ctrl: boolean = false) => {
    if (this.from && pin) {
      const newWire = new Wire(
        this.points.map((pos) => pos.copy),
        this.from,
        pin
      )
      try {
        newWire.completeLink()
        this.parent.currentChip.wires.push(newWire)
      } catch (err) {
        if (err instanceof SimulatingError) {
          alert(err.message)
        }
      }
      if (!ctrl) {
        this.from = undefined
        this.points = []
      }
      return
    }
    this.from = pin
  }

  @observable
  from?: Pin
  @observable
  points: Pos[] = []

  @computed
  get data() {
    if (!this.from) return undefined
    return windowScalingMethods.roundLinePoints([
      this.from.chip !== this.parent.currentChip ? this.from.globalPos : this.from.pos,
      ...this.points,
      windowScalingMethods.cursorPos
    ])
  }
}
const WireIncompleted = view(WireIncompletedViewModel)<Props>(({ viewModel }) => {
  return (
    <path
      className={[
        cl.Wire,
        viewModel.from?.totalStates[0] === STATE.ERROR ? 'errorStroke' : ''
      ].join(' ')}
      style={{ pointerEvents: 'none', stroke: viewModel.from?.stateColor }}
      d={viewModel.data}
    />
  )
})

export default WireIncompleted
