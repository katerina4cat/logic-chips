import { ViewModel, view } from '@yoskutik/react-vvm'
import { action, computed, makeObservable } from 'mobx'
import cl from './ViewWire.module.scss'
import { Wire } from '@models/Wire'
import { windowScalingMethods } from '@renderer/common/PointsLineRounding'
import { EditViewModel } from '@renderer/pages/edit/Edit'
import { STATE } from '@models/STATE'

interface Props {
  wire: Wire
}

export class ViewWireViewModel extends ViewModel<EditViewModel, Props> {
  constructor() {
    super()
    makeObservable(this)
  }
  @computed
  get data() {
    return windowScalingMethods.roundLinePoints([
      this.viewProps.wire.from.pos,
      ...this.viewProps.wire.points,
      this.viewProps.wire.to.pos
    ])
  }
  deleteCheck = (e: KeyboardEvent) => {
    if (e.key.toLowerCase() === 'delete') {
      this.parent.currentChip.destroyWire(this.viewProps.wire)
    }
  }
}
const ViewWire = view(ViewWireViewModel)<Props>(({ viewModel }) => {
  return (
    <path
      className={[
        cl.Wire,
        viewModel.viewProps.wire.from.totalStates[0] === STATE.ERROR ? 'errorStroke' : ''
      ].join(' ')}
      style={{ stroke: viewModel.viewProps.wire.from.stateColor }}
      d={viewModel.data}
      onMouseEnter={() => window.addEventListener('keydown', viewModel.deleteCheck)}
      onMouseLeave={() => window.removeEventListener('keydown', viewModel.deleteCheck)}
    />
  )
})

export default ViewWire
