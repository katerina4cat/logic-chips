import { ViewModel, view } from '@yoskutik/react-vvm'
import { action, makeObservable, observable, reaction } from 'mobx'
import cl from './Window.module.scss'
import { Pos } from '@models/common/Pos'
import { windowScalingMethods } from '@renderer/common/PointsLineRounding'

interface Props {
  display: boolean
  setdisplay: (v: boolean) => void
  position: Pos
  title?: string
  children: any
}

let globalZindexes = 5000

export class WindowViewModel extends ViewModel<unknown, Props> {
  constructor() {
    super()
    makeObservable(this)
    globalZindexes += 1
    this.zIndex = globalZindexes
    reaction(
      () => windowScalingMethods.cursorPos,
      () => {
        if (this.mooving)
          this.currentPos = windowScalingMethods.cursorPos.copy
            .multyMe(windowScalingMethods.scale)
            .subMe(this.deltaClick)
      }
    )
  }
  @observable
  hiden = false
  deltaClick = new Pos()
  @observable
  currentPos = this.viewProps.position.copy
  mooving = false
  @action
  mouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    this.deltaClick = new Pos(e.pageX - this.currentPos.x, e.pageY - this.currentPos.y)
    window.addEventListener('mouseup', this.mouseUp)
    globalZindexes += 1
    this.zIndex = globalZindexes
    this.mooving = true
  }
  mouseUp = () => {
    this.mooving = false
    window.removeEventListener('mouseup', this.mouseUp)
  }
  @observable
  zIndex
}
const Window = view(WindowViewModel)<Props>(({ viewModel }) => {
  return (
    <div
      className={cl.Window}
      style={{
        left: `${viewModel.currentPos.x}px`,
        top: `${viewModel.currentPos.y}px`,
        zIndex: viewModel.zIndex
      }}
    >
      <div className={cl.Header} onMouseDown={viewModel.mouseDown}>
        <div className={cl.Title}>{viewModel.viewProps.title}</div>
        <div
          className={cl.Button}
          onClick={action(() => (viewModel.hiden = !viewModel.hiden))}
          style={{
            transition: 'transform 0.125s ease-in-out',
            transform: viewModel.hiden ? 'rotate(-180deg)' : undefined,
            fontSize: '0.75em'
          }}
        >
          ▲
        </div>
        <div className={cl.Button} onClick={() => viewModel.viewProps.setdisplay(false)}>
          &times;
        </div>
      </div>
      <div
        className={[cl.Content, viewModel.hiden ? cl.HidenContent : ''].join(' ')}
        children={viewModel.viewProps.children}
      />
    </div>
  )
})

export default Window
