import { ViewModel, view } from '@yoskutik/react-vvm'
import cl from './Button.module.scss'
import React from 'react'

interface Props extends React.HTMLAttributes<HTMLButtonElement> {}

export class ButtonViewModel extends ViewModel<unknown, Props> {
  constructor() {
    super()
  }
}

const Button = view(ButtonViewModel)<Props>(({ viewModel }) => {
  return (
    <button
      {...viewModel.viewProps}
      className={[cl.Button, viewModel.viewProps.className].join(' ')}
    />
  )
})

export default Button
