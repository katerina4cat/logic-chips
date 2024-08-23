import { ViewModel, view } from '@yoskutik/react-vvm'
import { action, makeObservable, observable } from 'mobx'
import cl from './NewSave.module.scss'
import Input from '@renderer/components/Input/Input'
import Button from '@renderer/components/Button/Button'
import { useNavigate } from 'react-router-dom'
import { navigate } from '@renderer/App'

interface Props {}

type inputs = 'title'

export class NewSaveViewModel extends ViewModel<unknown, Props> {
  constructor() {
    super()
    makeObservable(this)
  }
  @observable
  inputData: { [key in inputs]: string } = {
    title: ''
  }
  @observable
  handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.inputData[event.target.name] = event.target.value
    return event.target.value
  }

  @action
  createNewSave = () => {}
}
const NewSave = view(NewSaveViewModel)<Props>(({ viewModel }) => {
  navigate.current = useNavigate()
  return (
    <div className={cl.NewSave}>
      <h1>Новое сохранение</h1>
      <Input
        value={viewModel.inputData.title}
        name={'title'}
        onChange={viewModel.handleInput}
        placeholder="Название"
      />
      <div className={cl.Buttons}>
        <Button onClick={viewModel.createNewSave} className={cl.Button}>
          Создать
        </Button>
        <Button onClick={() => navigate.current(-1)} className={cl.Button}>
          Назад
        </Button>
      </div>
    </div>
  )
})

export default NewSave
