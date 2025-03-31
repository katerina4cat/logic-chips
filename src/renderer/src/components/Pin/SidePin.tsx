import { ViewModel, view } from '@yoskutik/react-vvm'
import { action, makeObservable, observable, reaction, runInAction } from 'mobx'
import cl from './SidePin.module.scss'
import { Pin } from '@models/Pin'
import ViewPin from './ViewPin'
import { STATE } from '@models/STATE'
import { windowScalingMethods } from '@renderer/common/PointsLineRounding'
import { SidePinBlockViewModel } from '../SidePinBlock/SidePinBlock'
import CompositeSvg from './Composite.svg?react'
import CompositeContext from './CompositeContext'
import Button from '../Button/Button'
import { createRef } from 'react'
import { hotKeyEventListener } from '@renderer/common/HotKeyListener'
import { Color, COLORS, Colors } from '@models/common/COLORS'
import { CUSTOMChip } from '@models/DefaultChips/CUSTOM'

interface Props {
  pin: Pin
  input?: true
  selfState?: true
  isPreview?: true
}

export class SidePinViewModel extends ViewModel<SidePinBlockViewModel, Props> {
  constructor() {
    super()
    makeObservable(this)
    reaction(() => windowScalingMethods.cursorPos, this.mouseMoveWithPin)
  }
  @action
  changeState = () => {
    if (!this.parent.parent.insideChip)
      this.viewProps.pin.selfStates[0] =
        this.viewProps.pin.selfStates[0] === STATE.LOW ? STATE.HIGHT : STATE.LOW
  }
  moovingPin = false
  @action
  mouseMoveWithPin = () => {
    if (this.moovingPin) this.viewProps.pin.pos.y = windowScalingMethods.cursorPos.y
  }
  mouseDown = () => {
    this.moovingPin = true
    window.addEventListener('mouseup', this.mouseUp)
  }
  mouseUp = () => {
    this.moovingPin = false
    window.removeEventListener('mouseup', this.mouseUp)
  }
  @action
  openComposeContext = () => {
    this.context = true
  }
  @observable
  context = false
  ref = createRef<HTMLDivElement>()
}
const SidePin = view(SidePinViewModel)<Props>(({ viewModel }) => {
  return (
    <>
      <div
        className={cl.SidePin}
        style={{
          flexDirection: viewModel.viewProps.input ? 'row' : 'row-reverse',
          top: `${viewModel.viewProps.pin.pos.y * windowScalingMethods.scale.y}px`,
          left: viewModel.viewProps.input ? 0 : undefined,
          right: viewModel.viewProps.input ? undefined : 0,
          pointerEvents: viewModel.viewProps.isPreview ? 'none' : undefined
        }}
        onClick={(e) => e.stopPropagation()}
        ref={viewModel.ref}
      >
        <div className={cl.Scroll} onMouseDown={viewModel.mouseDown}></div>

        <div
          className={[
            cl.StatusBtn,
            viewModel.viewProps.pin.type !== 1 ? cl.ComposePin : '',
            viewModel.viewProps.pin.totalStates[0] === STATE.ERROR ? 'errorFill' : ''
          ].join(' ')}
          onClick={
            viewModel.viewProps.pin.type === 1
              ? viewModel.viewProps.selfState && viewModel.changeState
              : viewModel.openComposeContext
          }
          style={{
            backgroundColor: viewModel.viewProps.pin.stateColor[0],
            cursor:
              viewModel.viewProps.input && !viewModel.parent.parent.insideChip ? 'pointer' : 'auto'
          }}
        >
          {viewModel.viewProps.pin.type !== 1 ? (
            <>
              <CompositeSvg className={cl.CompositeIcon} />
              <div className={cl.CompositeNumber}>{viewModel.viewProps.pin.type}</div>
            </>
          ) : undefined}
        </div>

        <div
          className={cl.Line}
          style={{ transform: `translateX(${viewModel.viewProps.input ? -0.15 : 0.15}em)` }}
        ></div>
        <ViewPin
          pin={viewModel.viewProps.pin}
          style={{ transform: `translateX(${viewModel.viewProps.input ? -0.2 : 0.2}em)` }}
          side
        />
        {viewModel.viewProps.isPreview ? undefined : (
          <input
            value={viewModel.viewProps.pin.globalState.title}
            className={cl.PinTitle}
            onFocus={() => {
              hotKeyEventListener.canSearch = false
            }}
            onChange={action((e) => {
              viewModel.viewProps.pin.globalState.title = e.target.value
            })}
            onBlur={action((e) => {
              hotKeyEventListener.canSearch = true
              if (e.target.value === '') viewModel.viewProps.pin.globalState.title = 'Pin'
            })}
          />
        )}
      </div>
      {viewModel.viewProps.pin.type !== 1 ? <CompositeContext /> : undefined}
    </>
  )
})

export default SidePin
