import { ViewModel, view } from '@yoskutik/react-vvm'
import { action, computed, makeObservable, observable, reaction, runInAction } from 'mobx'
import cl from './SidePinBlock.module.scss'
import { Pin } from '@models/Pin'
import SidePin from '../Pin/SidePin'
import { EditViewModel } from '@renderer/pages/edit/Edit'
import { windowScalingMethods } from '@renderer/common/PointsLineRounding'
import { CUSTOMChip } from '@models/DefaultChips/CUSTOM'

interface Props {
  pins: Pin[]
  input?: true
  selfState?: true
}

export class SidePinBlockViewModel extends ViewModel<EditViewModel, Props> {
  constructor() {
    super()
    makeObservable(this)
    reaction(
      () => windowScalingMethods.cursorPos.y,
      () => {
        this.previewPin.pos.y = windowScalingMethods.cursorPos.y
      }
    )
  }
  protected onViewMounted(): void {
    window.addEventListener('keydown', this.keyDown)
  }
  protected onViewUnmounted(): void {
    window.removeEventListener('keydown', this.keyDown)
    window.removeEventListener('keyup', this.keyUp)
  }
  @action
  keyDown = (e: KeyboardEvent) => {
    if (e.code === 'AltLeft') {
      e.preventDefault()
      this.previewPin.type = 8
      window.addEventListener('keyup', this.keyUp)
      window.removeEventListener('keydown', this.keyDown)
    }
  }
  @action
  keyUp = (e: KeyboardEvent) => {
    if (e.code === 'AltLeft') {
      this.previewPin.type = 1
      window.removeEventListener('keyup', this.keyUp)
      window.addEventListener('keydown', this.keyDown)
    }
  }

  @action
  addPin = () => {
    ;(this.parent.currentChip as CUSTOMChip).addPin(
      new Pin(
        undefined,
        this.parent.currentChip,
        undefined,
        this.previewPin.type,
        this.viewProps.input,
        this.previewPin.pos.copy
      ),
      !!this.viewProps.input
    )
  }
  @observable
  previewPin = new Pin(-999, this.parent.currentChip, '', 1)
  @observable
  show = false
}
const SidePinBlock = view(SidePinBlockViewModel)<Props>(({ viewModel }) => {
  return (
    <div className={cl.SideBlock} style={{ right: viewModel.viewProps.input ? undefined : 0 }}>
      <div
        className={cl.SideBlockElement}
        onMouseEnter={() =>
          runInAction(() => {
            viewModel.show = true
          })
        }
        onMouseLeave={() =>
          runInAction(() => {
            viewModel.show = false
          })
        }
        onClick={viewModel.addPin}
      ></div>
      {viewModel.viewProps.pins.map((pin) => (
        <SidePin
          pin={pin}
          input={viewModel.viewProps.input}
          selfState={viewModel.viewProps.selfState}
          key={pin.id}
        />
      ))}
      {viewModel.show && (
        <SidePin pin={viewModel.previewPin} input={viewModel.viewProps.input} isPreview />
      )}
    </div>
  )
})

export default SidePinBlock
