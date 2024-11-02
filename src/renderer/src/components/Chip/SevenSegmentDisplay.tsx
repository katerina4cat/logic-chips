import { ViewModel, view } from '@yoskutik/react-vvm'
import { action, makeObservable, observable } from 'mobx'
import cl from './SevenSegmentDisplay.module.scss'
import { Chip } from '@models/Chip'
import { ChipType } from '@models/ChipType'
import { Pos } from '@models/common/Pos'
import { saveManager } from '@models/Managers/SaveManager'
import { windowScalingMethods } from '@renderer/common/PointsLineRounding'
import ViewPin from '../Pin/ViewPin'
import { EditViewModel } from '@renderer/pages/edit/Edit'

interface Props {
  chip: Chip
  preview?: boolean
}

export enum SegmentsPins {
  A = 0,
  B = 1,
  C = 2,
  D = 3,
  E = 4,
  F = 5,
  G = 6
}

export class SevenSegmentDisplayViewModel extends ViewModel<EditViewModel, Props> {
  @observable hovered
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
        {viewModel.viewProps.chip.inputs.map((pin) => (
          <ViewPin pin={pin} key={pin.id} />
        ))}
      </div>
      <div className={cl.Display}>
        <div>
          <div
            className={[
              cl.HorisontalSegment,
              viewModel.viewProps.chip.inputs[SegmentsPins.A].stateColor[1]
            ].join(' ')}
            style={{
              backgroundColor: viewModel.viewProps.chip.inputs[SegmentsPins.A].stateColor[1],
              opacity: viewModel.hovered[SegmentsPins.A] ? 0.2 : 1
            }}
          />
          <div className={cl.RowSegments}>
            <div
              className={[
                cl.VerticalSegment,
                viewModel.viewProps.chip.inputs[SegmentsPins.F].stateColor[2]
              ].join(' ')}
              style={{
                backgroundColor: viewModel.viewProps.chip.inputs[SegmentsPins.F].stateColor[2],
                opacity: viewModel.hovered[SegmentsPins.F] ? 0.2 : 1
              }}
            />
            <div
              className={[
                cl.VerticalSegment,
                viewModel.viewProps.chip.inputs[SegmentsPins.B].stateColor[3]
              ].join(' ')}
              style={{
                backgroundColor: viewModel.viewProps.chip.inputs[SegmentsPins.B].stateColor[3],
                opacity: viewModel.hovered[SegmentsPins.B] ? 0.2 : 1
              }}
            />
          </div>
          <div
            className={[
              cl.HorisontalSegment,
              viewModel.viewProps.chip.inputs[SegmentsPins.G].stateColor[4]
            ].join(' ')}
            style={{
              backgroundColor: viewModel.viewProps.chip.inputs[SegmentsPins.G].stateColor[4],
              opacity: viewModel.hovered[SegmentsPins.G] ? 0.2 : 1
            }}
          />
          <div className={cl.RowSegments}>
            <div
              className={[
                cl.VerticalSegment,
                viewModel.viewProps.chip.inputs[SegmentsPins.E].stateColor[5]
              ].join(' ')}
              style={{
                backgroundColor: viewModel.viewProps.chip.inputs[SegmentsPins.E].stateColor[5],
                opacity: viewModel.hovered[SegmentsPins.E] ? 0.2 : 1
              }}
            />
            <div
              className={[
                cl.VerticalSegment,
                viewModel.viewProps.chip.inputs[SegmentsPins.C].stateColor[6]
              ].join(' ')}
              style={{
                backgroundColor: viewModel.viewProps.chip.inputs[SegmentsPins.C].stateColor[6],
                opacity: viewModel.hovered[SegmentsPins.C] ? 0.2 : 1
              }}
            />
          </div>
          <div
            className={[
              cl.HorisontalSegment,
              viewModel.viewProps.chip.inputs[SegmentsPins.D].stateColor[7]
            ].join(' ')}
            style={{
              backgroundColor: viewModel.viewProps.chip.inputs[SegmentsPins.D].stateColor[7],
              opacity: viewModel.hovered[SegmentsPins.D] ? 0.2 : 1
            }}
          />
        </div>
        <div className={cl.Title}>{viewModel.viewProps.chip.title}</div>
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
