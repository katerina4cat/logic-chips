import { ViewModel, view } from '@yoskutik/react-vvm'
import { makeObservable } from 'mobx'
import cl from './LoadUnsavedConfirm.module.scss'
import Modal from '@renderer/components/Modal/Modal'
import { modalsStates } from '../ModalsStates'
import Button from '@renderer/components/Button/Button'
import { ModalsViewModel } from '../Modals'

interface Props {}

export class LoadUnsavedConfirmViewModel extends ViewModel<ModalsViewModel, Props> {
  constructor() {
    super()
    makeObservable(this)
  }
}
const LoadUnsavedConfirm = view(LoadUnsavedConfirmViewModel)<Props>(({ viewModel }) => {
  return (
    <Modal
      enabled={modalsStates.states.unsavedConfirm}
      setenabled={(v) => modalsStates.closeAll('unsavedConfirm', v)}
      className={cl.Modal}
    >
      Загрузить последний редактируемый чип?
      <div className={cl.Buttons}>
        <Button
          onClick={() => {
            modalsStates.closeAll('unsavedConfirm', false)
          }}
          className={cl.Button}
        >
          Отмена
        </Button>
        <Button
          customtype="Submit"
          onClick={() => {
            modalsStates.closeAll('unsavedConfirm', false)
            viewModel.parent.parent.loadUnsavedChip()
          }}
          className={cl.Button}
        >
          Да
        </Button>
      </div>
    </Modal>
  )
})

export default LoadUnsavedConfirm
