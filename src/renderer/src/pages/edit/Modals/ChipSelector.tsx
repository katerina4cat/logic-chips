import { ViewModel, view } from '@yoskutik/react-vvm'
import { action, makeObservable } from 'mobx'
import { ModalsViewModel } from '../Modals'
import { saveManager } from '@models/Managers/SaveManager'
import RadialMenu from '@renderer/components/RadialMenu/RadialMenu'
import { modalsStates } from '../ModalsStates'

interface Props {}

export class ChipSelectorViewModel extends ViewModel<ModalsViewModel, Props> {
  constructor() {
    super()
    makeObservable(this)
  }
}
const ChipSelector = view(ChipSelectorViewModel)<Props>(({ viewModel }) => {
  if (!saveManager.currentSave) return undefined
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: modalsStates.states.radial ? 'flex' : 'none',
        backgroundColor: 'rgba(0,0,0,0.45)',
        zIndex: 75,
        justifyContent: 'center',
        alignItems: 'center'
      }}
      onClick={action(() => {
        modalsStates.states.radial = false
      })}
    >
      <RadialMenu
        elements={saveManager.currentSave.wheels[modalsStates.currentRadial - 1]}
        title={(v) => v}
        editable
        onClick={viewModel.parent.parent.setAdding}
      />
    </div>
  )
})

export default ChipSelector
