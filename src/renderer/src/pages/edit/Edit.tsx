import { ViewModel, view } from '@yoskutik/react-vvm'
import { action, makeObservable, observable } from 'mobx'
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
import { Pin } from '@models/Pin'
import { Pos } from '@models/common/Pos'

interface Props {}

export class EditViewModel extends ViewModel<unknown, Props> {
  @observable
  currentChip = new CUSTOMChip('', '', 0)
  @observable
  addingChip?: Chip
  constructor() {
    super()
    makeObservable(this)
    this.currentChip.addPin(
      new Pin(undefined, this.currentChip, 'IN', 1, true, new Pos(0, 25)),
      true
    )
    this.currentChip.addPin(
      new Pin(undefined, this.currentChip, 'IN', 32, true, new Pos(0, 45)),
      true
    )
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
  const { id } = useParams()
  useEffect(() => {
    if (id && saveManager.savesTitleInfo.findIndex((save) => save.title === id) !== -1)
      saveManager.loadSaveByName(id)
    else {
      navigate.current(-1)
      alert('Не удаётся найти это сохранение')
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
