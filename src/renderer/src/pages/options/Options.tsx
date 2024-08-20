import { ViewModel, view } from '@yoskutik/react-vvm'
import { action, makeObservable } from 'mobx'
import cl from './Options.module.scss'
import Button from '@renderer/components/Button/Button'
import { useNavigate } from 'react-router-dom'
import { navigate } from '@renderer/App'
import { useTheme } from '@renderer/hooks/useTheme'

interface Props {}

export class OptionsViewModel extends ViewModel<unknown, Props> {
  constructor() {
    super()
    makeObservable(this)
  }
}
const Options = view(OptionsViewModel)<Props>(({ viewModel }) => {
  navigate.current = useNavigate()
  const [theme, setTheme, swapTheme] = useTheme()
  return (
    <div className={cl.Options}>
      <h1>Настройки</h1>
      <Button onClick={swapTheme}>{theme === 'dark' ? 'Светлая' : 'Тёмная'}</Button>
      <Button onClick={() => navigate.current(-1)}>Назад</Button>
    </div>
  )
})

export default Options
