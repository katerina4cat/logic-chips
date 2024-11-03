import { ViewModel, view } from '@yoskutik/react-vvm'
import { action, makeObservable } from 'mobx'
import cl from './SaveModal.module.scss'
import Button from '@renderer/components/Button/Button'
import Modal from '@renderer/components/Modal/Modal'
import { ModalsViewModel } from '../Modals'
import { modalsStates } from '../ModalsStates'
import { saveManager } from '@models/Managers/SaveManager'
import { navigate } from '@renderer/App'

interface Props {}

export class MenuModalViewModel extends ViewModel<ModalsViewModel, Props> {
  constructor() {
    super()
    makeObservable(this)
  }
}
const MenuModal = view(MenuModalViewModel)<Props>(({ viewModel }) => {
  if (!modalsStates.states.menu) return undefined
  return (
    <Modal
      className={cl.SaveModal}
      enabled={modalsStates.states.menu}
      setenabled={() => {
        modalsStates.closeAll('menu', false)
      }}
    >
      <h2>Меню</h2>
      <Button
        onClick={() => {
          modalsStates.closeAll('menu', false)
        }}
      >
        Продолжить
      </Button>
      <Button
        onClick={() => {
          navigate.current('/Settings')
          modalsStates.closeAll('menu', false)
        }}
      >
        Настройки
      </Button>
      <Button
        onClick={() => {
          navigate.current('/')
          modalsStates.closeAll('menu', false)
        }}
      >
        Выйти
      </Button>
    </Modal>
  )
})

export default MenuModal
