import { ViewModel, view } from '@yoskutik/react-vvm'
import { action, makeObservable, observable, reaction } from 'mobx'
import cl from './ViewPin.module.scss'
import { Pin } from '@models/Pin'
import { STATE } from '@models/STATE'
import { Pos } from '@models/common/Pos'
import { createRef } from 'react'
import { currentVaribles, wireConnector } from '@renderer/common/GlobalVariables'
import { windowScalingMethods } from '@renderer/common/PointsLineRounding'
import { CUSTOMChip } from '@models/DefaultChips/CUSTOM'
import { Colors, Color, COLORS } from '@models/common/COLORS'
import { hotKeyEventListener } from '@renderer/common/HotKeyListener'
import Button from '../Button/Button'

interface Props {
  pin: Pin
  side?: boolean
  className?: string
  style?: React.CSSProperties
  index?: number
  onMouseEnter?: () => {}
  onMouseLeave?: () => {}
}

export class ViewPinViewModel extends ViewModel<unknown, Props> {
  constructor() {
    super()
    makeObservable(this)
    reaction(() => this.viewProps.index, this.calcPinPosition, { requiresObservable: true })
  }

  @action
  protected onViewMounted(): void {
    window.addEventListener('resize', this.calcPinPosition)
    this.calcPinPosition()
  }

  protected onViewUnmounted(): void {
    if (this.viewProps.side) {
      window.removeEventListener('resize', this.calcPinPosition)
    }
  }
  @action
  calcPinPosition = () => {
    if (this.viewProps.side && this.viewProps.pin.chip.id === 0) {
      const box = this.ref.current!.getBoundingClientRect()
      this.viewProps.pin.pos.x = (box.x + box.width / 2) / windowScalingMethods.scale.x
    } else {
      const box = this.ref.current!.getBoundingClientRect()
      this.viewProps.pin.atChippos = new Pos(box.x + box.width / 2, box.y + box.height / 2)
        .divMe(windowScalingMethods.scale)
        .subMe(this.viewProps.pin.chip.pos)
    }
  }
  @observable
  defaultcontext = false
  ref = createRef<HTMLDivElement>()
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
    if (!this.defaultcontext) return false
    this.defaultcontext = false
    hotKeyEventListener.hotkeys.CANCEL.removeListener(this.disableDefaultContext)
    return true
  }
}
const ViewPin = view(ViewPinViewModel)<Props>(({ viewModel }) => {
  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          backgroundColor: viewModel.viewProps.pin.stateColor[0],
          ...viewModel.viewProps.style
        }}
        className={[
          viewModel.viewProps.pin.totalStates[0] !== STATE.ERROR ? '' : 'errorFill',
          cl.Pin,
          viewModel.viewProps.pin.type !== 1 ? cl.CompositePin : '',
          viewModel.viewProps.className
        ].join(' ')}
        ref={viewModel.ref}
        onClick={(e) => wireConnector.current(viewModel.viewProps.pin, e.ctrlKey)}
        onContextMenu={action((e) => {
          e.preventDefault()
          viewModel.defaultcontext = true
          window.addEventListener('click', viewModel.checkOutsizeClick)
          hotKeyEventListener.hotkeys.CANCEL.addListener(viewModel.disableDefaultContext)
        })}
        onMouseEnter={viewModel.viewProps.onMouseEnter}
        onMouseLeave={viewModel.viewProps.onMouseLeave}
      ></div>
      <div
        className={cl.DefaultContext}
        style={{
          display: viewModel.defaultcontext ? 'flex' : 'none',
          left: viewModel.viewProps.pin.isSource ? '10em' : undefined,
          right: viewModel.viewProps.pin.isSource ? undefined : '10em'
        }}
      >
        <div>Пин: {viewModel.viewProps.pin.globalState.title}</div>
        {viewModel.viewProps.pin.type === 1 ? (
          <div className={cl.Colors}>
            {Object.keys(Colors).map((key) => (
              <div
                key={key}
                className={cl.StatusBtn}
                style={{
                  backgroundColor: (Colors[key] as Color).color,
                  borderColor:
                    viewModel.viewProps.pin.globalState.color.id === key ? 'white' : undefined
                }}
                onClick={action((e) => {
                  viewModel.viewProps.pin.globalState.colorName = key as COLORS
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
            onFocus={() => {
              hotKeyEventListener.canSearch = false
            }}
            onChange={action((e) => {
              if (/^(\d+)?$/.test(e.target.value)) viewModel.pinType = Number(e.target.value)
            })}
            onBlur={action(() => {
              hotKeyEventListener.canSearch = true
              viewModel.pinType =
                viewModel.pinType <= 1 ? 2 : viewModel.pinType > 32 ? 32 : viewModel.pinType
              if (viewModel.viewProps.pin.type !== viewModel.pinType)
                viewModel.viewProps.pin.chip.wires
                  .filter(
                    (wire) =>
                      wire.from === viewModel.viewProps.pin || wire.to === viewModel.viewProps.pin
                  )
                  .forEach((wire) => (viewModel.viewProps.pin.chip as CUSTOMChip).destroyWire(wire))
              viewModel.viewProps.pin.type = viewModel.pinType
            })}
          />
        ) : undefined}
        {viewModel.viewProps.pin.chip.id === 0 && (
          <Button
            className={cl.Button}
            onClick={() => {
              ;(viewModel.viewProps.pin.chip as CUSTOMChip).destroyPin(viewModel.viewProps.pin)
            }}
          >
            Удалить
          </Button>
        )}
      </div>
      {viewModel.viewProps.pin.chip.id !== 0 && currentVaribles.SidePinTitleVisible ? (
        <div
          className={cl.Title}
          style={{
            left: viewModel.viewProps.side ? `1.25em` : undefined,
            right: viewModel.viewProps.side ? undefined : `1.25em`
          }}
        >
          {viewModel.viewProps.pin.globalState.title}
        </div>
      ) : undefined}
    </div>
  )
})

export default ViewPin
