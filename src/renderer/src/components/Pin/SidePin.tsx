import { ViewModel, view } from '@yoskutik/react-vvm'
import { action, makeObservable, observable, runInAction } from 'mobx'
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
import { Color, Colors } from '@models/common/COLORS'

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
  }
  @action
  changeState = () => {
    this.viewProps.pin.selfStates[0] =
      this.viewProps.pin.selfStates[0] === STATE.LOW ? STATE.HIGHT : STATE.LOW
  }
  mouseDown = () => {
    window.addEventListener('mouseup', this.mouseUp)
    window.addEventListener('mousemove', this.mouseMoveWithPin)
  }
  @action
  mouseMoveWithPin = (e: MouseEvent) => {
    this.viewProps.pin.pos.y = (e.pageY / window.innerHeight) * 100
  }
  mouseUp = () => {
    window.removeEventListener('mousemove', this.mouseMoveWithPin)
    window.removeEventListener('mouseup', this.mouseUp)
  }
  @action
  openComposeContext = () => {
    this.context = true
  }
  @observable
  context = false
  @observable
  defaultcontext = false
  @observable
  pinType = this.viewProps.pin.type
  @action
  checkOutsizeClick = (e: MouseEvent) => {
    if (!this.ref.current?.contains(e.target as Node)) {
      this.defaultcontext = false
      window.removeEventListener('click', this.checkOutsizeClick)
    }
  }
  @action
  disableDefaultContext = () => {
    this.defaultcontext = false
    hotKeyEventListener.hotkeys.CANCEL.removeListener(this.disableDefaultContext)
  }
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
          right: viewModel.viewProps.input ? undefined : 1,
          pointerEvents: viewModel.viewProps.isPreview ? 'none' : undefined
        }}
        onClick={(e) => e.stopPropagation()}
        ref={viewModel.ref}
      >
        <div
          className={cl.Scroll}
          onMouseDown={viewModel.mouseDown}
          onContextMenu={action((e) => {
            e.preventDefault()
            viewModel.defaultcontext = true
            window.addEventListener('click', viewModel.checkOutsizeClick)
            hotKeyEventListener.hotkeys.CANCEL.addListener(viewModel.disableDefaultContext)
          })}
        ></div>

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
            backgroundColor: viewModel.viewProps.pin.stateColor,
            cursor: viewModel.viewProps.input ? 'pointer' : 'auto'
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
            value={viewModel.viewProps.pin.title}
            className={cl.PinTitle}
            onChange={action((e) => {
              viewModel.viewProps.pin.title = e.target.value
            })}
            onBlur={action((e) => {
              if (e.target.value === '') viewModel.viewProps.pin.title = 'Pin'
            })}
          />
        )}
        <div
          className={cl.DefaultContext}
          style={{
            display: viewModel.defaultcontext ? 'flex' : 'none',
            left: viewModel.viewProps.input ? '10em' : undefined,
            right: viewModel.viewProps.input ? undefined : '10em'
          }}
        >
          <div>Пин: {viewModel.viewProps.pin.title}</div>
          {viewModel.viewProps.pin.type === 1 ? (
            <div className={cl.Colors}>
              {Object.keys(Colors).map((key) => (
                <div
                  key={key}
                  className={cl.StatusBtn}
                  style={{
                    backgroundColor: (Colors[key] as Color).color,
                    cursor: viewModel.viewProps.input ? 'pointer' : 'auto',
                    borderColor: viewModel.viewProps.pin.color.id === key ? 'white' : undefined
                  }}
                  onClick={action((e) => {
                    viewModel.viewProps.pin.color = Colors[key]
                  })}
                />
              ))}
            </div>
          ) : undefined}
          {viewModel.viewProps.pin.type !== 1 ? (
            <input
              value={viewModel.pinType === 0 ? '' : viewModel.pinType}
              type="number"
              min={2}
              max={32}
              className={cl.PinTitle}
              onChange={action((e) => {
                if (/^(\d+)?$/.test(e.target.value)) viewModel.pinType = Number(e.target.value)
              })}
              onBlur={action(() => {
                viewModel.pinType =
                  viewModel.pinType <= 1 ? 2 : viewModel.pinType > 32 ? 32 : viewModel.pinType
                viewModel.viewProps.pin.type = viewModel.pinType
              })}
            />
          ) : undefined}
          <Button
            className={cl.Button}
            onClick={() => {
              viewModel.parent.parent.currentChip.destroyPin(viewModel.viewProps.pin)
            }}
          >
            Удалить
          </Button>
        </div>
      </div>
      {viewModel.viewProps.pin.type !== 1 ? <CompositeContext /> : undefined}
    </>
  )
})

export default SidePin
