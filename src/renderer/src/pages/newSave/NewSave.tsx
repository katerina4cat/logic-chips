import { ViewModel, view } from '@yoskutik/react-vvm'
import { observable } from 'mobx'
import cl from './NewSave.module.scss'
import Input from '@renderer/components/Input/Input'

interface Props {}

type inputs = 'name'

export class NewSaveViewModel extends ViewModel<unknown, Props> {
  constructor() {
    super()
  }
  @observable
  inputData: { [key in inputs]: string } = {
    name: ''
  }
  @observable
  handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.inputData[event.target.name] = event.target.value
    return event.target.value
  }
}
const NewSave = view(NewSaveViewModel)<Props>(({ viewModel }) => {
  return (
    <div className={cl.NewSave}>
      <h1>Новое сохранение</h1>
      <Input value={viewModel.inputData.name} name={'name'} onChange={viewModel.handleInput} />
    </div>
  )
})

export default NewSave
