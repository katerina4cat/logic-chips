import { ViewModel, view } from '@yoskutik/react-vvm'
import { makeObservable } from 'mobx'
import cl from './Modal.module.scss'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  enabled: boolean
  setenabled: (v: boolean) => void
}

export class ModalViewModel extends ViewModel<unknown, Props> {
  constructor() {
    super()
    makeObservable(this)
  }
}
const Modal = view(ModalViewModel)<Props>(({ viewModel }) => {
  const { enabled, setenabled, ...rest } = viewModel.viewProps
  if (enabled)
    return (
      <div className={cl.ModalBack} onClick={(e) => setenabled(false)}>
        <div
          {...rest}
          onClick={(e) => e.stopPropagation()}
          className={[cl.ModalContent, rest.className].join(' ')}
        />
      </div>
    )
})

export default Modal
