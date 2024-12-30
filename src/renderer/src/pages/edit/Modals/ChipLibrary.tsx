import Modal from '@renderer/components/Modal/Modal'
import { ViewModel, view } from '@yoskutik/react-vvm'
import { action, computed, makeObservable, observable } from 'mobx'
import { modalsStates } from '../ModalsStates'
import { defaultChips, saveManager } from '@models/Managers/SaveManager'
import cl from './ChipLibrary.module.scss'
import { ModalsViewModel } from '../Modals'
import Button from '@renderer/components/Button/Button'
import { navigate } from '@renderer/App'
import RadialMenu, { CHIP_TRANSFER } from '@renderer/components/RadialMenu/RadialMenu'
import { hotKeyEventListener } from '@renderer/common/HotKeyListener'
import { Pos } from '@models/common/Pos'
import { windowScalingMethods } from '@renderer/common/PointsLineRounding'
import { createRef } from 'react'

interface Props {}

export class ChipLibraryViewModel extends ViewModel<ModalsViewModel, Props> {
  constructor() {
    super()
    makeObservable(this)
  }
  @observable
  selected = ''
  @observable
  currentWheel = 0
  @computed
  get canDelete() {
    return (
      defaultChips.find((chipName) => chipName === this.selected) === undefined &&
      !saveManager.dependentChips(this.selected)?.length
    )
  }
  @action
  deleteChip = () => {
    const dependent = saveManager.dependentChips(this.selected)
    if (dependent?.length !== 0) {
      alert(`У этого чипа имеются зависимости!
        ${dependent?.join('\n')}`)
      return
    }
    if (defaultChips.find((chipName) => chipName === this.selected)) {
      alert(`Этот чип невозможно удалить!
        ${dependent?.join('\n')}`)
      return
    }

    saveManager.removeChip(this.selected)
    this.selected = ''
  }
  @action
  setCurrentWheel = (wheel: number) => {
    this.currentWheel = wheel - 1
  }
  @observable
  contextPosition = new Pos()
  @observable
  contextText = ''
  ref = createRef<HTMLDivElement>()
  @action
  onContextRadialElement = (element: string) => {
    window.addEventListener('click', this.checkOutsizeClick)
    this.contextPosition = windowScalingMethods.cursorPos.multy(windowScalingMethods.scale)
    this.contextText = element
  }
  @action
  checkOutsizeClick = (e: MouseEvent) => {
    if (!this.ref.current?.contains(e.target as Node)) {
      this.contextText = ''
      window.removeEventListener('click', this.checkOutsizeClick)
    }
  }
}
const ChipLibrary = view(ChipLibraryViewModel)<Props>(({ viewModel }) => {
  if (!saveManager.currentSave || !modalsStates.states.library) {
    hotKeyEventListener.hotkeys.RADIAL_MENU.removeListener(viewModel.setCurrentWheel)
    return undefined
  }
  hotKeyEventListener.hotkeys.RADIAL_MENU.addListener(viewModel.setCurrentWheel)
  return (
    <>
      <Modal
        className={cl.ChipLibrary}
        enabled={modalsStates.states.library}
        setenabled={(v) => modalsStates.closeAll('library', v)}
        rightpanel={
          <div
            style={{
              width: '37.5vw',
              aspectRatio: '1',
              zIndex: 75,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <RadialMenu
              elements={saveManager.currentSave.wheels[viewModel.currentWheel]}
              title={(v) => v}
              editable
              key={viewModel.currentWheel}
              onContext={viewModel.onContextRadialElement}
            />
            <div
              className={cl.ContextRadial}
              style={{
                top: viewModel.contextPosition.y,
                left: viewModel.contextPosition.x,
                display: viewModel.contextText ? 'flex' : 'none'
              }}
              onClick={(e) => e.stopPropagation()}
              ref={viewModel.ref}
            >
              <h5>{viewModel.contextText}</h5>
              <Button>Удалить</Button>
            </div>
          </div>
        }
      >
        <h2>Список чипов</h2>
        <div className={cl.List}>
          {defaultChips.map((title) => (
            <div
              className={[cl.ChipButton, title === viewModel.selected ? cl.SelectedChip : undefined]
                .filter(Boolean)
                .join(' ')}
              onClick={action(() => {
                viewModel.selected = title
              })}
              onDoubleClick={action(() => {
                viewModel.parent.parent.setAdding(title)
                modalsStates.closeAll('library', false)
              })}
              key={title}
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData(CHIP_TRANSFER, title)
                event.dataTransfer.dropEffect = 'move'
              }}
            >
              {title}
            </div>
          ))}
          {saveManager.currentSave?.chips.map((chip) => (
            <div
              className={[
                cl.ChipButton,
                chip.title === viewModel.selected ? cl.SelectedChip : undefined
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={action(() => {
                viewModel.selected = chip.title
              })}
              onDoubleClick={action(() => {
                viewModel.parent.parent.setAdding(chip.title)
                modalsStates.closeAll('library', false)
              })}
              key={chip.title}
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData(CHIP_TRANSFER, chip.title)
                event.dataTransfer.dropEffect = 'move'
              }}
            >
              {chip.title}
            </div>
          ))}
        </div>
        <div className={cl.Buttons}>
          <Button
            onClick={action(() => {
              viewModel.parent.parent.setAdding(viewModel.selected)
              modalsStates.closeAll('library', false)
            })}
            disabled={!viewModel.selected}
          >
            Добавить
          </Button>
          <Button
            disabled={viewModel.canDelete && viewModel.selected ? undefined : true}
            onClick={viewModel.deleteChip}
          >
            Удалить
          </Button>
          <Button
            onClick={action(() => {
              navigate.current(`/Edit/${saveManager.currentSave?.title}/${viewModel.selected}`)
              const chip = saveManager.loadChipByName(viewModel.selected)
              if (chip) {
                viewModel.parent.parent.currentChip = chip
                modalsStates.closeAll('library', false)
              } else alert('Не удалось загрузить чип')
            })}
            disabled={!viewModel.selected}
          >
            Изменить
          </Button>
          <Button
            onClick={action(() => {
              viewModel.parent.parent.newChipCreating()
              modalsStates.closeAll('library', false)
            })}
          >
            Новый чип
          </Button>
        </div>
      </Modal>
    </>
  )
})

export default ChipLibrary
