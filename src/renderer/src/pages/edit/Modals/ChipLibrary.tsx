import Modal from '@renderer/components/Modal/Modal'
import { ViewModel, view } from '@yoskutik/react-vvm'
import { action, makeObservable } from 'mobx'
import { modalsStates } from '../ModalsStates'
import { saveManager } from '@models/Managers/SaveManager'
import cl from './ChipLibrary.module.scss'
import { ModalsViewModel } from '../Modals'

interface Props {}

export class ChipLibraryViewModel extends ViewModel<ModalsViewModel, Props> {
  constructor() {
    super()
    makeObservable(this)
  }
  defaultChips = ['AND', 'NOT', 'TRISTATE', 'ESEGMENT', 'ADAPTER']
}
const ChipLibrary = view(ChipLibraryViewModel)<Props>(({ viewModel }) => {
  return (
    <>
      <Modal
        enabled={modalsStates.states.library}
        setenabled={(v) => modalsStates.closeAll('library', v)}
      >
        <div className={cl.ChipLibrary}>
          {viewModel.defaultChips.map((title) => (
            <div
              className={cl.ChipButton}
              onClick={() => {
                viewModel.parent.parent.addingChip = saveManager.loadChipByName(title)
                modalsStates.closeAll('library', false)
              }}
              key={title}
            >
              {title}
            </div>
          ))}
          {saveManager.currentSave?.chips.map((chip) => (
            <div
              className={cl.ChipButton}
              onClick={action(() => {
                viewModel.parent.parent.addingChip = saveManager.loadChipByName(chip.title)
                modalsStates.closeAll('library', false)
              })}
              key={chip.title}
            >
              {chip.title}
            </div>
          ))}
        </div>
      </Modal>
    </>
  )
})

export default ChipLibrary
