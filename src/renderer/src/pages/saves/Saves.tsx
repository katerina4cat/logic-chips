import { ViewModel, view } from '@yoskutik/react-vvm'
import { makeObservable } from 'mobx'
import cl from './Saves.module.scss'
import { useNavigate } from 'react-router-dom'
import Button from '@renderer/components/Button/Button'
import { navigate } from '@renderer/App'
import { saveManager } from '@models/Managers/SaveManager'

interface Props {}

export class SavesViewModel extends ViewModel<unknown, Props> {
  constructor() {
    super()
    makeObservable(this)
  }
  loadSave = (name: string) => {
    navigate.current('/Edit/' + name)
  }
}
const Saves = view(SavesViewModel)<Props>(({ viewModel }) => {
  navigate.current = useNavigate()
  return (
    <div className={cl.Saves}>
      <h1>Сохранения</h1>
      {saveManager.savesTitleInfo.map((save) => (
        <Button onClick={() => viewModel.loadSave(save.title)}>{save.title}</Button>
      ))}
      <Button onClick={() => navigate.current(-1)} className={cl.Button}>
        Назад
      </Button>
    </div>
  )
})

export default Saves
