import { ViewModel, view } from '@yoskutik/react-vvm'
import { action, makeObservable, observable } from 'mobx'
import cl from './CompositeOneState.module.scss'
import { Colors, Color, COLORS } from '@models/common/COLORS'
import { STATE, stateInfo } from '@models/STATE'
import { hotKeyEventListener } from '@renderer/common/HotKeyListener'
import { CompositeContextViewModel } from './CompositeContext'
import { createRef } from 'react'
import { Pin } from '@models/Pin'

interface Props {
  ind: number
  state: STATE
  pin: Pin
  selfState?: true
}

export class CompositeOneStateViewModel extends ViewModel<CompositeContextViewModel, Props> {
  constructor() {
    super()
    makeObservable(this)
  }
  @observable
  colorPicker = false
  @action
  checkOutsizeClick = (e: MouseEvent) => {
    if (!this.ref.current?.contains(e.target as Node)) {
      this.colorPicker = false
      window.removeEventListener('click', this.checkOutsizeClick)
    }
  }
  ref = createRef<HTMLDivElement>()
}
const CompositeOneState = view(CompositeOneStateViewModel)<Props>(({ viewModel }) => {
  return (
    <div className={cl.BlockPin}>
      <div
        key={viewModel.viewProps.ind}
        className={[
          cl.StatusBtn,
          viewModel.viewProps.state === STATE.ERROR ? 'errorFill' : ''
        ].join(' ')}
        onClick={
          viewModel.viewProps.selfState &&
          action(() => {
            viewModel.viewProps.pin.selfStates[viewModel.viewProps.ind - 1] =
              viewModel.viewProps.pin.selfStates[viewModel.viewProps.ind - 1] === STATE.LOW
                ? STATE.HIGHT
                : STATE.LOW
          })
        }
        onContextMenu={action((e) => {
          viewModel.colorPicker = true
          window.addEventListener('click', viewModel.checkOutsizeClick)
          e.preventDefault()
        })}
        style={{
          backgroundColor: viewModel.viewProps.pin.stateColor[viewModel.viewProps.ind - 1]
        }}
      />

      <input
        value={viewModel.viewProps.pin.statesInfo[viewModel.viewProps.ind]?.title}
        className={cl.PinTitle}
        onFocus={() => {
          hotKeyEventListener.canSearch = false
        }}
        onChange={action((e) => {
          viewModel.viewProps.pin.statesInfo[viewModel.viewProps.ind].title = e.target.value
        })}
        onBlur={action((e) => {
          hotKeyEventListener.canSearch = true
          if (e.target.value === '')
            viewModel.viewProps.pin.statesInfo[viewModel.viewProps.ind].title = 'Pin'
        })}
      />
      <div
        className={cl.DefaultContext}
        style={{ display: viewModel.colorPicker ? 'flex' : 'none' }}
        ref={viewModel.ref}
      >
        <div>
          Пин: {viewModel.viewProps.pin.globalState.title} -{' '}
          {viewModel.viewProps.pin.statesInfo[viewModel.viewProps.ind]?.title}
        </div>
        <div className={cl.Colors}>
          {Object.keys(Colors).map((key) => (
            <div
              key={key}
              className={cl.StatusBtn}
              style={{
                backgroundColor: (Colors[key] as Color).color,
                borderColor:
                  viewModel.viewProps.pin.statesInfo[viewModel.viewProps.ind]?.color?.id === key
                    ? 'white'
                    : undefined
              }}
              onClick={action((e) => {
                viewModel.viewProps.pin.statesInfo[viewModel.viewProps.ind]!.colorName =
                  key as COLORS
              })}
            />
          ))}
        </div>
      </div>
    </div>
  )
})

export default CompositeOneState
