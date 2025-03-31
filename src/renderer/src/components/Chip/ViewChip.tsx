import { ViewModel, view } from '@yoskutik/react-vvm'
import { action, makeObservable, observable } from 'mobx'
import cl from './ViewChip.module.scss'
import { Chip } from '@models/Chip'
import ViewPin from '../Pin/ViewPin'
import { windowScalingMethods } from '@renderer/common/PointsLineRounding'
import { Pos } from '@models/common/Pos'
import { EditViewModel } from '@renderer/pages/edit/Edit'
import { ChipType } from '@models/ChipType'
import Button from '../Button/Button'
import { CUSTOMChip } from '@models/DefaultChips/CUSTOM'
import { useRef } from 'react'

interface Props {
  chip: Chip
  preview?: boolean
}

export class ViewChipViewModel extends ViewModel<EditViewModel, Props> {
  @observable
  context = false
  constructor() {
    super()
    makeObservable(this)
  }
  ref = useRef<HTMLDivElement>(null)
  @action
  onMouseMove = () => {
    this.viewProps.chip.pos = windowScalingMethods.cursorPos.copy.sub(this.delta)
  }
  delta = new Pos()
  @action
  onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.button === 1 && this.viewProps.chip.type === ChipType.CUSTOM) {
      this.parent.forwardViewChip(this.viewProps.chip)
      return
    }
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
  @action
  checkOutsizeClick = (e: MouseEvent) => {
    if (!this.ref.current?.contains(e.target as Node)) {
      this.context = false
      window.removeEventListener('mousedown', this.checkOutsizeClick)
    }
  }
}
const ViewChip = view(ViewChipViewModel)<Props>(({ viewModel }) => {
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
        if (e.altKey) viewModel.parent.setAdding(viewModel.viewProps.chip.title)
      }}
      onContextMenu={action((e) => {
        viewModel.context = !viewModel.context
        window.addEventListener('mousedown', viewModel.checkOutsizeClick)
        e.preventDefault()
      })}
      onMouseDown={viewModel.viewProps.preview ? undefined : viewModel.onMouseDown}
    >
      <div className={cl.Pins} style={{ transform: 'translateX(-50%)' }}>
        {viewModel.viewProps.chip.inputs.map((pin) => (
          <ViewPin pin={pin} key={pin.id} />
        ))}
      </div>
      <div className={cl.Title}>{viewModel.viewProps.chip.title}</div>
      <div className={cl.Pins} style={{ transform: 'translateX(50%)' }}>
        {viewModel.viewProps.chip.outputs.map((pin) => (
          <ViewPin pin={pin} key={pin.id} side />
        ))}
      </div>
      <div
        className={cl.Context}
        ref={viewModel.ref}
        style={{ display: viewModel.context ? undefined : 'none' }}
      >
        <div className={cl.Title}>Чип: {viewModel.viewProps.chip.title}</div>
        <Button
          onClick={() =>
            (viewModel.parent.currentChip as CUSTOMChip).destroyChip(viewModel.viewProps.chip)
          }
          className={cl.Btn}
        >
          Удалить
        </Button>
      </div>
    </div>
  )
})

export default ViewChip
