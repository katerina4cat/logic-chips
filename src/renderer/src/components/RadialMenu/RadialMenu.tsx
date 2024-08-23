import { ViewModel, view } from '@yoskutik/react-vvm'
import { action, computed, makeObservable, observable } from 'mobx'
import cl from './RadialMenu.module.scss'
import RadialElement from './RadialElement'
import { createRef } from 'react'
import { Pos } from '@models/common/Pos'
import { windowScalingMethods } from '@renderer/common/PointsLineRounding'

interface Props {
  elements: string[]
  editable?: boolean
  onClick: (element: string) => void
}

export class RadialMenuViewModel extends ViewModel<unknown, Props> {
  halfElement: number
  constructor() {
    super()
    makeObservable(this)
    this.halfElement = Math.PI * (1 / this.viewProps.elements.length)
  }

  @computed
  get centerRadial() {
    const rect = this.ref.current?.getBoundingClientRect()
    if (rect)
      return new Pos(rect.x + rect.width / 2, rect.y + rect.height / 2).div(
        windowScalingMethods.scale
      )
    return windowScalingMethods.scale.multy(50)
  }
  @action
  swapElement = (fromInd: number, toInd: number) => {
    const buff = this.viewProps.elements[fromInd]
    this.viewProps.elements[fromInd] = this.viewProps.elements[toInd]
    this.viewProps.elements[toInd] = buff
  }
  @observable
  ref = createRef<SVGSVGElement>()
}
const RadialMenu = view(RadialMenuViewModel)<Props>(({ viewModel }) => {
  return (
    <svg viewBox="0 0 100 100" className={cl.RadialMenu} ref={viewModel.ref}>
      {viewModel.viewProps.elements.map((element, ind) => {
        return (
          <RadialElement
            elementIndex={ind + 1}
            element={element}
            key={element}
            onClick={viewModel.viewProps.onClick}
          />
        )
      })}
    </svg>
  )
})

export default RadialMenu
