import { ViewModel, view } from '@yoskutik/react-vvm'
import { makeObservable } from 'mobx'
import cl from './Menu.module.scss'
import Button from '@renderer/components/Button/Button'

interface Props {}

export class MenuViewModel extends ViewModel<unknown, Props> {
  constructor() {
    super()
    makeObservable(this)
  }
}
const Menu = view(MenuViewModel)<Props>(({ viewModel }) => {
  return (
    <div className={cl.Menu}>
      <h1>LogicChip</h1>
      <Button>Новая игра</Button>
      <Button>Загрузить игру</Button>
      <Button>Настройки</Button>
    </div>
  )
})

export default Menu
