import { ViewModel, view } from '@yoskutik/react-vvm'
import { computed, makeObservable } from 'mobx'
import cl from './RadialMenu.module.scss'
import { windowScalingMethods } from '@renderer/common/PointsLineRounding'
import RadialElement, { RadialElementObject } from './RadialElement'

interface Props {
  elements: RadialElementObject[]
}

export class RadialMenuViewModel extends ViewModel<unknown, Props> {
  halfElement: number
  constructor() {
    super()
    makeObservable(this)
    this.halfElement = Math.PI * (1 / this.viewProps.elements.length)
  }
}
const RadialMenu = view(RadialMenuViewModel)<Props>(({ viewModel }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cl.RadialMenu}
      style={{
        top: `${windowScalingMethods.scale.y * 50}px`
      }}
    >
      {viewModel.viewProps.elements.map((element, ind) => {
        return (
          <RadialElement
            halfElement={viewModel.halfElement}
            elementIndex={ind + 1}
            element={element}
          />
        )
      })}
    </svg>
  )
})

export default RadialMenu
