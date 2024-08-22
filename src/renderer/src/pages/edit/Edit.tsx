import { ViewModel, view } from '@yoskutik/react-vvm'
import { makeObservable } from 'mobx'
import './global.scss'
import { CUSTOMChip } from '@models/DefaultChips/CUSTOM'
import { Colors } from '@models/common/COLORS'
import { Pos } from '@models/common/Pos'
import { Pin } from '@models/Pin'
import { Wire } from '@models/Wire'
import ViewWire from '@renderer/components/Wire/ViewWire'
import SidePinBlock from '@renderer/components/SidePinBlock/SidePinBlock'
import WireIncompleted from '@renderer/components/Wire/WireIncompleted'
import { createRef } from 'react'

interface Props {}

export class EditViewModel extends ViewModel<unknown, Props> {
  currentChip = new CUSTOMChip('', '', 0)
  constructor() {
    super()
    makeObservable(this)

    this.currentChip.addPin(
      new Pin(23, this.currentChip, 'In1', 1, true, new Pos(0, 45), Colors.yellow),
      true
    )
    this.currentChip.addPin(
      new Pin(23, this.currentChip, 'Out1', 1, false, new Pos(0, 25), Colors.yellow),
      false
    )
    this.currentChip.addWire(
      new Wire(
        [new Pos(25, 25), new Pos(60, 80)],
        this.currentChip.inputs[0],
        this.currentChip.outputs[0],
        true
      )
    )
  }
  svgRef = createRef<SVGSVGElement>()
}
const Edit = view(EditViewModel)<Props>(({ viewModel }) => {
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
      <SidePinBlock pins={viewModel.currentChip.inputs} input selfState />
      <SidePinBlock pins={viewModel.currentChip.outputs} />
    </div>
  )
})

export default Edit
