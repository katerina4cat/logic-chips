import { ViewModel, view } from '@yoskutik/react-vvm'
import { action, makeObservable, observable, reaction } from 'mobx'
import cl from './Edit.module.scss'
import { EditViewModel } from './Edit'
import ViewChip from '@renderer/components/Chip/ViewChip'
import { windowScalingMethods } from '@renderer/common/PointsLineRounding'
import { hotKeyEventListener } from '@renderer/common/HotKeyListener'
import { createRef } from 'react'
import { generateNumberID } from '@models/common/RandomId'
import { saveManager } from '@models/Managers/SaveManager'
import { Pos } from '@models/common/Pos'

interface Props {}

export class AddingChipViewModel extends ViewModel<EditViewModel, Props> {
  constructor() {
    super()
    makeObservable(this)
    reaction(
      () => this.parent.addingChip,
      action(() => {
        this.addingCount = 1
        if (this.parent.addingChip)
          setTimeout(() => {
            window.addEventListener('click', this.addChips)
          }, 25)
        else {
          window.removeEventListener('click', this.addChips)
        }
      })
    )
  }

  @observable
  addingCount = 1
  @action
  addCount = () => {
    this.addingCount += 1
  }
  @action
  subCount = () => {
    if (this.addingCount > 1) this.addingCount -= 1
  }
  @action
  addChips = () => {
    if (this.parent.addingChip) {
      const rect = this.ref.current?.getBoundingClientRect()
      if (!rect) return
      this.parent.addingChip.pos = windowScalingMethods.cursorPos.add(
        new Pos(-12, -12).divMe(windowScalingMethods.scale)
      )
      const heightPerElement = rect!.height / this.addingCount
      for (let i = 0; i < this.addingCount; i++) {
        const clone = saveManager.loadChipByName(this.parent.addingChip.title, generateNumberID())
        if (!clone) {
          console.log('Не удалось загрузить такие чипы')
          break
        }
        clone.pos = this.parent.addingChip.pos.copy
        clone.pos.y += (heightPerElement * i) / windowScalingMethods.scale.y
        this.parent.currentChip.addChip(clone)
      }
      this.parent.addingChip = undefined
    }
  }
  protected onViewMounted(): void {
    hotKeyEventListener.hotkeys.ADDING_CHIPS_ADD.addListener(this.addCount)
    hotKeyEventListener.hotkeys.ADDING_CHIPS_SUB.addListener(this.subCount)
  }
  protected onViewUnmounted(): void {
    window.removeEventListener('click', this.addChips)
    hotKeyEventListener.hotkeys.ADDING_CHIPS_ADD.removeListener(this.addCount)
    hotKeyEventListener.hotkeys.ADDING_CHIPS_SUB.removeListener(this.subCount)
  }
  ref = createRef<HTMLDivElement>()
}
const AddingChip = view(AddingChipViewModel)<Props>(({ viewModel }) => {
  if (!viewModel.parent.addingChip) return
  const position = windowScalingMethods.cursorPos.multy(windowScalingMethods.scale)
  return (
    <div
      className={cl.AddingChipBox}
      style={{
        top: `${position.y - 12}px`,
        left: `${position.x - 12}px`
      }}
      ref={viewModel.ref}
    >
      {new Array(viewModel.addingCount).fill(0).map((_, ind) => (
        <ViewChip chip={viewModel.parent.addingChip!} key={ind} preview />
      ))}
    </div>
  )
})

export default AddingChip
