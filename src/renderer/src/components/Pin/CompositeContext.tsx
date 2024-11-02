import { ViewModel, view } from '@yoskutik/react-vvm'
import { action, makeObservable, observable, reaction } from 'mobx'
import { SidePinViewModel } from './SidePin'
import Window from '../Window/Window'
import cl from './CompositeContext.module.scss'
import { Pos } from '@models/common/Pos'
import CompositeOneState from './CompositeOneState'

interface Props {}

export class CompositeContextViewModel extends ViewModel<SidePinViewModel, Props> {
  constructor() {
    super()
    makeObservable(this)
  }
  @action
  setdisplay = (v: boolean) => (this.parent.context = v)
}
const CompositeContext = view(CompositeContextViewModel)<Props>(({ viewModel }) => {
  if (!viewModel.parent.context) return
  return (
    <Window
      display={viewModel.parent.context}
      setdisplay={viewModel.setdisplay}
      position={new Pos()}
      title={viewModel.parent.viewProps.pin.globalState.title}
    >
      <div className={cl.StatesList}>
        {(viewModel.parent.viewProps.input
          ? viewModel.parent.viewProps.pin.selfStates
          : viewModel.parent.viewProps.pin.totalStates
        ).map((state, ind) => (
          <CompositeOneState
            ind={ind}
            state={state}
            pin={viewModel.parent.viewProps.pin}
            selfState={viewModel.parent.viewProps.selfState}
          />
        ))}
      </div>
    </Window>
  )
})

export default CompositeContext
