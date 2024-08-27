import { ViewModel, view } from '@yoskutik/react-vvm'
import { makeObservable } from 'mobx'
import cl from './Menu.module.scss'
import Button from '@renderer/components/Button/Button'
import { useNavigate } from 'react-router-dom'
import { navigate } from '@renderer/App'

interface Props {}

export class MenuViewModel extends ViewModel<unknown, Props> {
  constructor() {
    super()
    makeObservable(this)
  }
}
const Menu = view(MenuViewModel)<Props>(({ viewModel }) => {
  navigate.current = useNavigate()
  return (
    <div className={cl.Menu}>
      <h1>LogicChip</h1>
      <Button onClick={() => navigate.current('/NewGame')}>Новая игра</Button>
      <Button onClick={() => navigate.current('/Saves')}>Загрузить игру</Button>
      <Button onClick={() => navigate.current('/Options')}>Настройки</Button>
    </div>
  )
})

export default Menu
