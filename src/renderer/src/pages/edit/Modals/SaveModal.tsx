import { ViewModel, view } from '@yoskutik/react-vvm'
import { action, makeObservable } from 'mobx'
import cl from './SaveModal.module.scss'
import Button from '@renderer/components/Button/Button'
import Input from '@renderer/components/Input/Input'
import Modal from '@renderer/components/Modal/Modal'
import { ModalsViewModel } from '../Modals'
import { hotKeyEventListener } from '@renderer/common/HotKeyListener'
import { modalsStates } from '../ModalsStates'

interface Props {}

export class SaveModalViewModel extends ViewModel<ModalsViewModel, Props> {
  constructor() {
    super()
    makeObservable(this)
    hotKeyEventListener.hotkeys.SAVE.addListener(this.openModal)
  }
  @action
  openModal = () => {
    modalsStates.states.saving = true
  }
}
const SaveModal = view(SaveModalViewModel)<Props>(({ viewModel }) => {
  return (
    <Modal
      className={cl.SaveModal}
      enabled={modalsStates.states.saving}
      setenabled={() => {
        modalsStates.closeAll('saving', false)
      }}
    >
      <h2>Сохранить</h2>
      <Input
        value={viewModel.parent.parent.currentChip.title}
        onChange={action((e) => {
          viewModel.parent.parent.currentChip.title = e.target.value
          return e.target.value
        })}
        placeholder="Название"
      />
      <input
        type="color"
        onChange={action((e) => {
          viewModel.parent.parent.currentChip.color = e.target.value
        })}
        value={viewModel.parent.parent.currentChip.color}
      />
      <div className={cl.Buttons}>
        <Button
          onClick={() => {
            modalsStates.closeAll('saving', false)
          }}
        >
          Отмена
        </Button>
        <Button
          onClick={() => {
            modalsStates.closeAll('saving', false)
          }}
        >
          Сохранить
        </Button>
      </div>
    </Modal>
  )
})

export default SaveModal
