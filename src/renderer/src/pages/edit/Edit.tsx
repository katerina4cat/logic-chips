import { ViewModel, view } from '@yoskutik/react-vvm'
import { makeObservable } from 'mobx'
import './global.scss'
import { CUSTOMChip } from '@models/DefaultChips/CUSTOM'
import ViewWire from '@renderer/components/Wire/ViewWire'
import SidePinBlock from '@renderer/components/SidePinBlock/SidePinBlock'
import WireIncompleted from '@renderer/components/Wire/WireIncompleted'
import { createRef, useEffect } from 'react'
import RadialMenu from '@renderer/components/RadialMenu/RadialMenu'
import { useNavigate, useParams } from 'react-router-dom'
import { saveManager } from '@models/Managers/SaveManager'
import { navigate } from '@renderer/App'
import ViewChip from '@renderer/components/Chip/ViewChip'
import { ANDChip } from '@models/DefaultChips/AND'
import { Pos } from '@models/common/Pos'

interface Props {}

export class EditViewModel extends ViewModel<unknown, Props> {
  currentChip = new CUSTOMChip('', '', 0)
  constructor() {
    super()
    makeObservable(this)
    this.currentChip.addChip(new ANDChip(23, new Pos(34, 54)))
  }
  svgRef = createRef<SVGSVGElement>()
}
const Edit = view(EditViewModel)<Props>(({ viewModel }) => {
  navigate.current = useNavigate()
  const { id } = useParams()
  useEffect(() => {
    if (id && saveManager.savesTitleInfo.findIndex((save) => save.title === id) !== -1)
      saveManager.loadSaveByName(id)
    else {
      navigate.current(-1)
      alert('Не удаётся найти это сохранение')
    }
  }, [])
  if (!saveManager.currentSave) return undefined
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
      <SidePinBlock pins={viewModel.currentChip.inputs} input selfState />
      <SidePinBlock pins={viewModel.currentChip.outputs} />

      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'none'
        }}
      >
        <RadialMenu
          elements={saveManager.currentSave.wheels[0]}
          editable
          onClick={(element: string) => {
            console.log(element)
          }}
        />
      </div>
    </div>
  )
})

export default Edit
