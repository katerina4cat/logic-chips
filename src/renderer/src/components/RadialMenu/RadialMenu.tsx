import { ViewModel, view } from '@yoskutik/react-vvm'
import { action, computed, makeObservable, observable } from 'mobx'
import cl from './RadialMenu.module.scss'
import RadialElement from './RadialElement'
import { createRef } from 'react'
import { Pos } from '@models/common/Pos'
import { windowScalingMethods } from '@renderer/common/PointsLineRounding'
import { saveManager } from '@models/Managers/SaveManager'
import RadialElementv2 from './RadialElementv2'

interface Props {
  elements: any[]
  title: (v: any) => string
  editable?: boolean
  onClick?: (element: string) => void
}

export const CHIP_TRANSFER = 'ChipName'

export class RadialMenuViewModel extends ViewModel<unknown, Props> {
  @computed
  get halfElement() {
    return Math.PI * (1 / this.viewProps.elements.length)
  }
  constructor() {
    super()
    makeObservable(this)
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
    toInd %= this.viewProps.elements.length
    toInd = toInd < 0 ? this.viewProps.elements.length + toInd : toInd
    if (fromInd === toInd) return 0
    const buff = this.viewProps.elements[fromInd]
    this.viewProps.elements[fromInd] = this.viewProps.elements[toInd]
    this.viewProps.elements[toInd] = buff
    saveManager.save()
    return (toInd - fromInd) * 2
  }
  @observable
  ref = createRef<SVGSVGElement>()

  @action
  dropHandler = (event: React.DragEvent<SVGSVGElement>) => {
    const chipName = event.dataTransfer.getData(CHIP_TRANSFER)
    if (
      saveManager.hasChipInSave(chipName) &&
      this.viewProps.elements.find((title) => title === chipName) === undefined
    ) {
      this.viewProps.elements.push(chipName)
      saveManager.save()
    }
  }
}
const RadialMenu = view(RadialMenuViewModel)<Props>(({ viewModel }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cl.RadialMenu}
      ref={viewModel.ref}
      onDrop={viewModel.dropHandler}
      onDragOver={(ev) => {
        ev.preventDefault()
        ev.dataTransfer.dropEffect = 'copy'
      }}
    >
      {viewModel.viewProps.elements.map((element, ind) => {
        return (
          <RadialElementv2
            elementIndex={ind}
            element={element}
            title={viewModel.viewProps.title}
            key={element}
            onClick={viewModel.viewProps.onClick}
          />
        )
      })}
    </svg>
  )
})

export default RadialMenu
