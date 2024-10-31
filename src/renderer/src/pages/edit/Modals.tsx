import { ViewModel, view } from '@yoskutik/react-vvm'
import { makeObservable } from 'mobx'
import { EditViewModel } from './Edit'
import SaveModal from './Modals/SaveModal'
import ChipSelector from './Modals/ChipSelector'
import ChipLibrary from './Modals/ChipLibrary'
import MenuModal from './Modals/MenuModal'

interface Props {}

export class ModalsViewModel extends ViewModel<EditViewModel, Props> {
  constructor() {
    super()
    makeObservable(this)
  }
}
const Modals = view(ModalsViewModel)<Props>(({ viewModel }) => {
  return (
    <>
      <ChipSelector />
      <SaveModal />
      <ChipLibrary />
      <MenuModal />
    </>
  )
})

export default Modals
