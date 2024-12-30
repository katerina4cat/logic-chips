import { ViewModel, view } from '@yoskutik/react-vvm'
import { makeObservable } from 'mobx'
import cl from './Hotkeys.module.scss'
import { useNavigate } from 'react-router-dom'
import { navigate } from '@renderer/App'
import Button from '@renderer/components/Button/Button'
import { hotKeyEventListener, hotkeyInfo } from '@renderer/common/HotKeyListener'
import { HotKey } from '@renderer/common/HotKey'

interface Props {}

export class HotkeysViewModel extends ViewModel<unknown, Props> {
  constructor() {
    super()
    makeObservable(this)
  }
}
const Hotkeys = view(HotkeysViewModel)<Props>(({ viewModel }) => {
  navigate.current = useNavigate()
  return (
    <div className={cl.Hotkeys}>
      <h1 className={cl.Title}>Горячии клавиши</h1>
      <div className={cl.List}>
        {Object.keys(hotKeyEventListener.hotkeys).map((hotkey) => {
          const currHt = hotKeyEventListener.hotkeys[hotkey] as HotKey
          let key = ''
          if (hotkeyInfo[hotkey].digit) key = '[1-9]'
          else {
            const keys = currHt.keyCodes.map((key) =>
              (key as string).replaceAll(/(Key|Arrow)/gm, '')
            )
            key = keys.length < 2 ? keys[0] : `(${keys.join(' | ')})`
          }
          return (
            <div className={cl.HotkeyInfo}>
              <div className={cl.Title}>
                {hotkeyInfo[hotkey].title}
                {hotkeyInfo[hotkey].desc ? (
                  <span title={hotkeyInfo[hotkey].desc} className={cl.Hint}>
                    ?
                  </span>
                ) : undefined}
              </div>
              <Button>
                {[currHt.ctrl && 'ctrl', currHt.shift && 'shift', currHt.alt && 'alt']
                  .filter(Boolean)
                  .join(' + ')}{' '}
                {key}
                {}
              </Button>
            </div>
          )
        })}
      </div>
      <Button onClick={() => navigate.current(-1)}>Назад</Button>
    </div>
  )
})

export default Hotkeys
