import { ViewModel, view } from '@yoskutik/react-vvm'
import { action, makeObservable } from 'mobx'
import cl from './AdapterChip.module.scss'
import ViewPin from '../Pin/ViewPin'
import { windowScalingMethods } from '@renderer/common/PointsLineRounding'
import { Pos } from '@models/common/Pos'
import { EditViewModel } from '@renderer/pages/edit/Edit'
import { saveManager } from '@models/Managers/SaveManager'
import { ChipType } from '@models/ChipType'
import { ADAPTERChip } from '@models/DefaultChips/ADAPTER'
import { Pin, PinStateInfo } from '@models/Pin'

interface Props {
  chip: ADAPTERChip
  preview?: boolean
}

export class AdapterChipViewModel extends ViewModel<EditViewModel, Props> {
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

  adderPin = new Pin(-1, this.viewProps.chip, [new PinStateInfo('NewInput')], -1, false)
}
const AdapterChip = view(AdapterChipViewModel)<Props>(({ viewModel }) => {
  return (
    <div
      className={cl.AdapterChip}
      style={
        viewModel.viewProps.preview
          ? { position: 'static', backgroundColor: viewModel.viewProps.chip.color }
          : {
              top: viewModel.viewProps.chip.pos.y * windowScalingMethods.scale.y,
              left: viewModel.viewProps.chip.pos.x * windowScalingMethods.scale.x,
              backgroundColor: viewModel.viewProps.chip.color
            }
      }
      onClick={(e) => {
        if (e.altKey)
          viewModel.parent.addingChip = saveManager.loadChipByName(viewModel.viewProps.chip.title)
      }}
      onContextMenu={() => {
        console.log(viewModel.viewProps.chip)
      }}
      onMouseDown={viewModel.viewProps.preview ? undefined : viewModel.onMouseDown}
    >
      <div className={cl.Pins} style={{ transform: 'translateX(-50%)' }}>
        {viewModel.viewProps.chip.inputs.map((pin) => (
          <ViewPin pin={pin} key={pin.id} />
        ))}
        {viewModel.viewProps.chip.displayAdderPin ? (
          <ViewPin pin={viewModel.adderPin} key={viewModel.adderPin.id} />
        ) : undefined}
      </div>
      <div className={cl.Title}>{viewModel.viewProps.chip.title}</div>
      <div className={cl.Pins} style={{ transform: 'translateX(50%)' }}>
        {viewModel.viewProps.chip.outputs.map((pin) => (
          <ViewPin pin={pin} key={pin.id} side />
        ))}
      </div>
    </div>
  )
})

export default AdapterChip
