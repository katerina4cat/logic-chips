import { ViewModel, view } from '@yoskutik/react-vvm'
import { action, makeObservable } from 'mobx'
import cl from './ViewChip.module.scss'
import { Chip } from '@models/Chip'
import ViewPin from '../Pin/ViewPin'
import { windowScalingMethods } from '@renderer/common/PointsLineRounding'
import { Pos } from '@models/common/Pos'
import { createRef } from 'react'

interface Props {
  chip: Chip
}

export class ViewChipViewModel extends ViewModel<unknown, Props> {
  constructor() {
    super()
    makeObservable(this)
  }
  @action
  onMouseMove = () => {
    this.viewProps.chip.pos = windowScalingMethods.cursorPos.copy.sub(this.delta)
  }
  delta = new Pos()
  onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    this.delta = new Pos(e.pageX, e.pageY)
      .div(windowScalingMethods.scale)
      .sub(this.viewProps.chip.pos)
    window.addEventListener('mouseup', this.onMouseUp)
    window.addEventListener('mousemove', this.onMouseMove)
  }
  onMouseUp = () => {
    window.removeEventListener('mousemove', this.onMouseMove)
    window.removeEventListener('mouseup', this.onMouseUp)
    this.delta = new Pos()
  }
}
const ViewChip = view(ViewChipViewModel)<Props>(({ viewModel }) => {
  return (
    <div
      className={cl.ViewChip}
      style={{
        top: viewModel.viewProps.chip.pos.y * windowScalingMethods.scale.y,
        left: viewModel.viewProps.chip.pos.x * windowScalingMethods.scale.x,
        backgroundColor: viewModel.viewProps.chip.color
      }}
      onMouseDown={viewModel.onMouseDown}
    >
      <div className={cl.Pins} style={{ transform: 'translateX(-50%)' }}>
        {viewModel.viewProps.chip.inputs.map((pin) => (
          <ViewPin pin={pin} key={pin.id} />
        ))}
      </div>
      <div className={cl.Title}>{viewModel.viewProps.chip.title}</div>
      <div className={cl.Pins} style={{ transform: 'translateX(50%)' }}>
        {viewModel.viewProps.chip.outputs.map((pin) => (
          <ViewPin pin={pin} key={pin.id} />
        ))}
      </div>
    </div>
  )
})

export default ViewChip
