import { ViewModel, view } from '@yoskutik/react-vvm'
import { action, makeObservable, observable } from 'mobx'
import cl from './SevenSegmentDisplay.module.scss'
import { ViewChipViewModel } from './ViewChip'
import { ChipType } from '@models/ChipType'
import { saveManager } from '@models/Managers/SaveManager'
import { windowScalingMethods } from '@renderer/common/PointsLineRounding'
import ViewPin from '../Pin/ViewPin'
import { Chip } from '@models/Chip'

interface Props {
  chip: Chip
  preview?: boolean
}

const enum ESegmentElement {
  A = 0,
  B = 1,
  C = 2,
  D = 3,
  E = 4,
  F = 5,
  G = 6
}

export class SevenSegmentDisplayViewModel extends ViewChipViewModel {
  constructor() {
    super()
    makeObservable(this)
  }
  @observable
  highlight = new Array(this.viewProps.chip.inputs.length).fill(false)
}
const SevenSegmentDisplay = view(SevenSegmentDisplayViewModel)<Props>(({ viewModel }) => {
  return (
    <div
      className={cl.ViewChip}
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
      onContextMenu={
        viewModel.viewProps.chip.type === ChipType.CUSTOM
          ? action(() => {
              viewModel.parent.chipViewerOver.push(viewModel.parent.currentChip)
              viewModel.parent.currentChip = viewModel.viewProps.chip
            })
          : undefined
      }
      onMouseDown={viewModel.viewProps.preview ? undefined : viewModel.onMouseDown}
    >
      <div className={cl.Pins} style={{ transform: 'translateX(-50%)' }}>
        {viewModel.viewProps.chip.inputs.map((pin, ind) => (
          <ViewPin
            pin={pin}
            key={pin.id}
            onMouseEnter={action(() => (viewModel.highlight[ind] = true))}
            onMouseLeave={action(() => (viewModel.highlight[ind] = false))}
          />
        ))}
      </div>
      <div className={cl.Display}>
        <div className={cl.RowSegments}>
          <div
            className={cl.HorisontalSegment}
            style={{
              backgroundColor: viewModel.viewProps.chip.inputs[ESegmentElement.A].stateColor[0],
              opacity: viewModel.highlight[ESegmentElement.A] ? 0.2 : 1
            }}
          />
        </div>
        <div className={cl.RowSegments}>
          <div
            className={cl.VerticalSegment}
            style={{
              backgroundColor: viewModel.viewProps.chip.inputs[ESegmentElement.F].stateColor[0],
              opacity: viewModel.highlight[ESegmentElement.F] ? 0.2 : 1
            }}
          />
          <div
            className={cl.VerticalSegment}
            style={{
              backgroundColor: viewModel.viewProps.chip.inputs[ESegmentElement.B].stateColor[0],
              opacity: viewModel.highlight[ESegmentElement.B] ? 0.2 : 1
            }}
          />
        </div>
        <div className={cl.RowSegments}>
          <div
            className={cl.HorisontalSegment}
            style={{
              backgroundColor: viewModel.viewProps.chip.inputs[ESegmentElement.G].stateColor[0],
              opacity: viewModel.highlight[ESegmentElement.G] ? 0.2 : 1
            }}
          />
        </div>
        <div className={cl.RowSegments}>
          <div
            className={cl.VerticalSegment}
            style={{
              backgroundColor: viewModel.viewProps.chip.inputs[ESegmentElement.E].stateColor[0],
              opacity: viewModel.highlight[ESegmentElement.E] ? 0.2 : 1
            }}
          />
          <div
            className={cl.VerticalSegment}
            style={{
              backgroundColor: viewModel.viewProps.chip.inputs[ESegmentElement.C].stateColor[0],
              opacity: viewModel.highlight[ESegmentElement.C] ? 0.2 : 1
            }}
          />
        </div>
        <div className={cl.RowSegments}>
          <div
            className={cl.HorisontalSegment}
            style={{
              backgroundColor: viewModel.viewProps.chip.inputs[ESegmentElement.D].stateColor[0],
              opacity: viewModel.highlight[ESegmentElement.D] ? 0.2 : 1
            }}
          />
        </div>
      </div>
      <div className={cl.Pins} style={{ transform: 'translateX(50%)' }}>
        {viewModel.viewProps.chip.outputs.map((pin) => (
          <ViewPin pin={pin} key={pin.id} />
        ))}
      </div>
    </div>
  )
})

export default SevenSegmentDisplay
