import { ViewModel, view } from '@yoskutik/react-vvm'
import { makeObservable } from 'mobx'
import cl from './Saves.module.scss'
import { useNavigate } from 'react-router-dom'
import Button from '@renderer/components/Button/Button'
import { navigate } from '@renderer/App'

interface Props {}

export class SavesViewModel extends ViewModel<unknown, Props> {
  constructor() {
    super()
    makeObservable(this)
  }
}
const Saves = view(SavesViewModel)<Props>(({ viewModel }) => {
  navigate.current = useNavigate()
  return (
    <div className={cl.Saves}>
      <h1>Сохранения</h1>
      <Button onClick={() => navigate.current(-1)} className={cl.Button}>
        Назад
      </Button>
    </div>
  )
})

export default Saves
