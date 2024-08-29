import { ViewModel, view } from '@yoskutik/react-vvm'
import { action, makeObservable, observable, runInAction } from 'mobx'
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

interface Props {}

export class EditViewModel extends ViewModel<unknown, Props> {
  @observable
  currentChip: Chip = new CUSTOMChip('', '', 0)
  @observable
  chipViewerOver: Chip[] = []
  @observable
  addingChip?: Chip
  constructor() {
    super()
    makeObservable(this)
    hotKeyEventListener.hotkeys.NEW_CHIP.addListener(this.newChipCreating)
    hotKeyEventListener.hotkeys.BACK_BTN.addListener(this.backViewChip)
  }
  @action
  newChipCreating = () => {
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
  setAdding = (name: string) => {
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
    if (chip) {
      try {
        runInAction(() => {
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
      {viewModel.currentChip.subChips.map((chip) => (
        <ViewChip chip={chip} key={chip.id} />
      ))}
      <AddingChip />
      <SidePinBlock pins={viewModel.currentChip.inputs} input selfState />
      <SidePinBlock pins={viewModel.currentChip.outputs} />
      <Modals />
    </div>
  )
})

export default Edit
