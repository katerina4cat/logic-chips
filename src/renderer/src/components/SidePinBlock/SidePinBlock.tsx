import { ViewModel, view } from '@yoskutik/react-vvm'
import { makeObservable } from 'mobx'
import cl from './SidePinBlock.module.scss'
import { Pin } from '@models/Pin'
import SidePin from '../Pin/SidePin'

interface Props {
  pins: Pin[]
  input?: true
  selfState?: true
}

export class SidePinBlockViewModel extends ViewModel<unknown, Props> {
  constructor() {
    super()
    makeObservable(this)
  }
}
const SidePinBlock = view(SidePinBlockViewModel)<Props>(({ viewModel }) => {
  return (
    <div className={cl.SideBlock} style={{ right: viewModel.viewProps.input ? undefined : 1 }}>
      {viewModel.viewProps.pins.map((pin) => (
        <SidePin
          pin={pin}
          input={viewModel.viewProps.input}
          selfState={viewModel.viewProps.selfState}
          key={pin.id}
        />
      ))}
    </div>
  )
})

export default SidePinBlock
