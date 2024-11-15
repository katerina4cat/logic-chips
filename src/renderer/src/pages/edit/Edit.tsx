import { ViewModel, view } from '@yoskutik/react-vvm'
import { action, makeObservable, observable, reaction, runInAction } from 'mobx'
import './global.scss'
import { CUSTOMChip } from '@models/DefaultChips/CUSTOM'
import ViewWire from '@renderer/components/Wire/ViewWire'
import SidePinBlock from '@renderer/components/SidePinBlock/SidePinBlock'
import WireIncompleted from '@renderer/components/Wire/WireIncompleted'
import { createRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { saveManager } from '@models/Managers/SaveManager'
import { navigate } from '@renderer/App'
import ViewChip from '@renderer/components/Chip/ViewChip'
import { hotKeyEventListener } from '@renderer/common/HotKeyListener'
import { Chip } from '@models/Chip'
import AddingChip from './AddingChip'
import Modals from './Modals'
import { modalsStates } from './ModalsStates'
import { ChipType } from '@models/ChipType'
import SevenSegmentDisplay from '@renderer/components/Chip/SevenSegmentDisplay'
import AdapterChip from '@renderer/components/Chip/AdapterChip'

interface Props {}

export const getViewChip = (chip, preview = false, key?: number) => {
  switch (chip.type) {
    case ChipType.ESEGMENT:
      return <SevenSegmentDisplay chip={chip} key={key ? key : chip.id} preview={preview} />
    case ChipType.ADAPTER:
      return <AdapterChip chip={chip} key={key ? key : chip.id} preview={preview} />
    default:
      return <ViewChip chip={chip} key={key ? key : chip.id} preview={preview} />
  }
}

export class EditViewModel extends ViewModel<unknown, Props> {
  @observable
  currentChip: Chip = new CUSTOMChip('', undefined, 0)
  @observable
  chipViewerOver: Chip[] = []
  @observable
  addingChip?: Chip
  constructor() {
    super()
    makeObservable(this)
    hotKeyEventListener.hotkeys.NEW_CHIP.addListener(this.newChipCreating)
    hotKeyEventListener.hotkeys.BACK_BTN.addListener(this.backViewChip)
    window.addEventListener('beforeunload', this.saveBeforeUnload)
  }
  saveBeforeUnload = () => {
    if (saveManager.currentSave) saveManager.currentSave.unsavedChip = this.currentChip.toSave()
    saveManager.save()
  }
  @action
  newChipCreating = () => {
    if (saveManager.currentSave) saveManager.currentSave.unsavedChip = undefined
    navigate.current(`/Edit/${saveManager.currentSave?.title}`)
    this.currentChip = new CUSTOMChip('', '#666', 0)
  }
  @action
  backViewChip = () => {
    if (this.chipViewerOver.length !== 0) this.currentChip = this.chipViewerOver.pop()!
  }
  protected onViewUnmounted(): void {
    hotKeyEventListener.hotkeys.NEW_CHIP.removeListener(this.newChipCreating)
    hotKeyEventListener.hotkeys.BACK_BTN.removeListener(this.backViewChip)
  }
  svgRef = createRef<SVGSVGElement>()
  @action
  clearAdding = () => {
    this.addingChip = undefined
    hotKeyEventListener.hotkeys.CANCEL.removeListener(this.clearAdding)
    hotKeyEventListener.hotkeys.BACK_BTN.removeListener(this.clearAdding)
  }
  @action
  setAdding = (name: string) => {
    hotKeyEventListener.hotkeys.CANCEL.addListener(this.clearAdding)
    hotKeyEventListener.hotkeys.BACK_BTN.addListener(this.clearAdding)
    this.addingChip = saveManager.loadChipByName(name)
    modalsStates.closeAll('radial', false)
  }
}
const Edit = view(EditViewModel)<Props>(({ viewModel }) => {
  navigate.current = useNavigate()
  hotKeyEventListener
  const { id, chip } = useParams()
  useEffect(() => {
    if (id && saveManager.savesTitleInfo.findIndex((save) => save.title === id) !== -1)
      saveManager.loadSaveByName(id)
    else {
      navigate.current(-1)
      alert('Не удаётся найти это сохранение')
      return
    }
    if (saveManager.currentSave?.unsavedChip) {
      if (confirm('Загрузить последний редактируемый чип?'))
        try {
          runInAction(() => {
            // saveManager.currentSave!.unsavedChip!
            const buff = saveManager.loadChipByInfo(saveManager.currentSave!.unsavedChip!, {
              id: 0
            })
            if (buff) viewModel.currentChip = buff
          })
          return
        } catch {}
    }
    if (chip) {
      try {
        runInAction(() => {
          if (saveManager.currentSave) saveManager.currentSave.unsavedChip = undefined
          const buff = saveManager.loadChipByName(chip)
          if (buff) viewModel.currentChip = buff
        })
      } catch {}
    }
  }, [])
  return (
    <div style={{ width: '100%', height: '200%', position: 'relative' }}>
      <svg
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0
        }}
        preserveAspectRatio="none"
        ref={viewModel.svgRef}
      >
        {viewModel.currentChip.wires.map((wire) => (
          <ViewWire
            wire={wire}
            key={`${wire.from.chip.id}-${wire.from.id}->${wire.to.chip.id}-${wire.to.id}`}
          />
        ))}
        <WireIncompleted />
      </svg>
      {viewModel.currentChip.subChips.map((chip) => getViewChip(chip))}
      <AddingChip />
      <SidePinBlock pins={viewModel.currentChip.inputs} input selfState />
      <SidePinBlock pins={viewModel.currentChip.outputs} />
      <Modals />
    </div>
  )
})

export default Edit
