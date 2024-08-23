import { ViewModel, view } from '@yoskutik/react-vvm'
import { action, makeObservable, observable, runInAction } from 'mobx'
import cl from './SidePinBlock.module.scss'
import { Pin } from '@models/Pin'
import SidePin from '../Pin/SidePin'
import { EditViewModel } from '@renderer/pages/edit/Edit'
import { windowScalingMethods } from '@renderer/common/PointsLineRounding'

interface Props {
  pins: Pin[]
  input?: true
  selfState?: true
}

export class SidePinBlockViewModel extends ViewModel<EditViewModel, Props> {
  constructor() {
    super()
    makeObservable(this)
  }
  protected onViewMounted(): void {
    window.addEventListener('mousemove', this.mouseMove)
  }
  protected onViewUnmounted(): void {
    window.removeEventListener('mousemove', this.mouseMove)
  }
  @action
  mouseMove = (e: MouseEvent) => {
    this.previewPin.pos.y = e.pageY / windowScalingMethods.scale.y
  }
  @action
  addPin = () => {
    this.parent.currentChip.addPin(
      new Pin(
        Date.now(),
        this.parent.currentChip,
        undefined,
        1,
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
    <div
      className={cl.SideBlock}
      style={{ right: viewModel.viewProps.input ? undefined : 0 }}
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
    >
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
