import { ViewModel, view } from '@yoskutik/react-vvm'
import { action, makeObservable } from 'mobx'
import cl from './RadialMenu.module.scss'
import { windowScalingMethods } from '@renderer/common/PointsLineRounding'
import RadialElement, { RadialElementObject } from './RadialElement'

interface Props {
  elements: RadialElementObject[]
  editable?: boolean
}

export class RadialMenuViewModel extends ViewModel<unknown, Props> {
  halfElement: number
  constructor() {
    super()
    makeObservable(this)
    this.halfElement = Math.PI * (1 / this.viewProps.elements.length)
  }
  @action
  swapElement = (fromInd: number, toInd: number) => {
    const buff = this.viewProps.elements[fromInd]
    this.viewProps.elements[fromInd] = this.viewProps.elements[toInd]
    this.viewProps.elements[toInd] = buff
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
            editable={viewModel.viewProps.editable}
            key={element.key}
          />
        )
      })}
    </svg>
  )
})

export default RadialMenu
