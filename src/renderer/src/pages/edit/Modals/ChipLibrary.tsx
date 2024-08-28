import Modal from '@renderer/components/Modal/Modal'
import { ViewModel, view } from '@yoskutik/react-vvm'
import { makeObservable } from 'mobx'
import { modalsStates } from '../ModalsStates'

interface Props {}

export class ChipLibraryViewModel extends ViewModel<unknown, Props> {
  constructor() {
    super()
    makeObservable(this)
  }
}
const ChipLibrary = view(ChipLibraryViewModel)<Props>(({ viewModel }) => {
  return (
    <>
      <Modal
        enabled={modalsStates.states.library}
        setenabled={(v) => modalsStates.closeAll('library', v)}
      ></Modal>
    </>
  )
})

export default ChipLibrary
