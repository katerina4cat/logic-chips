import { ViewModel, view } from '@yoskutik/react-vvm'
import { action, makeObservable, observable } from 'mobx'
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
  @observable
  selected = ''
  @action
  select = (name: string) => {
    this.selected = name
  }
  loadSave = () => {
    navigate.current('/Edit/' + this.selected)
  }
  @action
  removeSave = () => {
    saveManager.removeSave(this.selected)
  }
}
const Saves = view(SavesViewModel)<Props>(({ viewModel }) => {
  navigate.current = useNavigate()
  return (
    <div className={cl.Saves}>
      <h1 className={cl.Title}>Сохранения</h1>
      {saveManager.savesTitleInfo.map((save) => (
        <Button
          onClick={() => viewModel.select(save.title)}
          customtype={'Extra'}
          disabled={save.title === viewModel.selected}
        >
          {save.title}
        </Button>
      ))}
      <div className={cl.HandleButtons}>
        <Button
          onClick={viewModel.loadSave}
          className={cl.Buttons}
          disabled={!viewModel.selected}
          customtype={'Submit'}
        >
          Загрузить
        </Button>
        <Button
          onClick={viewModel.removeSave}
          className={cl.Buttons}
          disabled={!viewModel.selected}
        >
          Удалить
        </Button>
        <Button onClick={() => navigate.current(-1)} className={cl.Buttons}>
          Назад
        </Button>
      </div>
    </div>
  )
})

export default Saves
