import { ViewModel, view } from '@yoskutik/react-vvm'
import { action, makeObservable, observable } from 'mobx'
import { SidePinViewModel } from './SidePin'
import Window from '../Window/Window'
import cl from './CompositeContext.module.scss'
import { Pos } from '@models/common/Pos'
import { STATE, stateInfo } from '@models/STATE'
import { Colors } from '@models/common/COLORS'

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
      title={viewModel.parent.viewProps.pin.title}
      zindex={Number(`1.${Date.now()}`)}
    >
      <div className={cl.StatesList}>
        {(viewModel.parent.viewProps.input
          ? viewModel.parent.viewProps.pin.selfStates
          : viewModel.parent.viewProps.pin.totalStates
        ).map((state, ind) => (
          <div
            className={[cl.StatusBtn, state === STATE.ERROR ? 'errorFill' : ''].join(' ')}
            onClick={
              viewModel.parent.viewProps.selfState &&
              action(
                () =>
                  (viewModel.parent.viewProps.pin.selfStates[ind] =
                    viewModel.parent.viewProps.pin.selfStates[ind] === STATE.LOW
                      ? STATE.HIGHT
                      : STATE.LOW)
              )
            }
            style={{
              backgroundColor: stateInfo[state].color
                ? stateInfo[state].color(Colors.red)
                : undefined,
              cursor: viewModel.parent.viewProps.input ? 'pointer' : 'auto'
            }}
          />
        ))}
      </div>
    </Window>
  )
})

export default CompositeContext
