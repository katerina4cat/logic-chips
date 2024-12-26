import { ViewModel, view } from '@yoskutik/react-vvm'
import cl from './Button.module.scss'
import React from 'react'

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  disabled?: boolean
  customtype?: BTN_TYPE
}

export type BTN_TYPE = 'Submit' | 'Extra'

export class ButtonViewModel extends ViewModel<unknown, Props> {
  constructor() {
    super()
  }
}

const classNames = {
  Submit: cl.Submit,
  Extra: cl.Extra
}

const Button = view(ButtonViewModel)<Props>(({ viewModel }) => {
  return (
    <button
      {...viewModel.viewProps}
      className={[
        cl.Button,
        viewModel.viewProps.customtype ? classNames[viewModel.viewProps.customtype] : '',
        viewModel.viewProps.className
      ].join(' ')}
      disabled={viewModel.viewProps.disabled}
    />
  )
})

export default Button
