import { ViewModel, view } from '@yoskutik/react-vvm'
import { action, makeObservable } from 'mobx'
import cl from './ViewPin.module.scss'
import { Pin } from '@models/Pin'
import { STATE } from '@models/STATE'
import { Pos } from '@models/common/Pos'
import { createRef } from 'react'

interface Props {
  pin: Pin
  className?: string
  style?: React.CSSProperties
}

export class ViewPinViewModel extends ViewModel<unknown, Props> {
  constructor() {
    super()
    makeObservable(this)
  }

  protected onViewMounted(): void {
    window.addEventListener('resize', this.calcPinPosition)
    this.calcPinPosition()
  }

  protected onViewUnmounted(): void {
    window.removeEventListener('resize', this.calcPinPosition)
  }
  @action
  calcPinPosition = (ui?: UIEvent) => {
    const box = this.ref.current?.getBoundingClientRect()
    if (box) this.viewProps.pin.pos.x = ((box.x + box.width / 2) / window.innerWidth) * 100
  }
  ref = createRef<HTMLDivElement>()
}
const ViewPin = view(ViewPinViewModel)<Props>(({ viewModel }) => {
  return (
    <div
      style={{ backgroundColor: viewModel.viewProps.pin.stateColor, ...viewModel.viewProps.style }}
      className={[
        viewModel.viewProps.pin.totalStates[0] !== STATE.ERROR ? '' : 'errorFill',
        cl.Pin,
        viewModel.viewProps.className
      ].join(' ')}
      ref={viewModel.ref}
    ></div>
  )
})

export default ViewPin
