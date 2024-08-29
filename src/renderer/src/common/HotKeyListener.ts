import { HotKey } from './HotKey'

const defaultHotKeys: AvaibleHotKey = {
  RADIAL_MENU1: new HotKey({ keyCodes: [/Digit[1-9]/], alt: true }),
  EDIT_RADIAL_MENU: new HotKey({ keyCodes: ['KeyA'] }),
  SAVE: new HotKey({ keyCodes: ['KeyS'], ctrl: true }),
  LIBRARY: new HotKey({ keyCodes: ['KeyA'] }),
  ADDING_CHIPS_ADD: new HotKey({ keyCodes: ['ArrowUp', 'ArrowRight'] }),
  ADDING_CHIPS_SUB: new HotKey({ keyCodes: ['ArrowLeft', 'ArrowDown'] }),
  CANCEL: new HotKey({ keyCodes: ['Escape'] }),
  NEW_CHIP: new HotKey({ keyCodes: ['KeyN'], alt: true }),
  BACK_BTN: new HotKey({ keyCodes: ['Backspace'] })
}

class HotKeyListener {
  hotkeys = defaultHotKeys
  constructor() {
    window.addEventListener('unload', this.unload)
    window.addEventListener('keydown', this.onKeyDown)
  }
  unload = () => {
    window.removeEventListener('unload', this.unload)
    window.removeEventListener('keydown', this.onKeyDown)
  }
  onKeyDown = (e: KeyboardEvent) => {
    Object.values(this.hotkeys).forEach((hotKey) => hotKey.test(e))
  }
}

export const hotKeyEventListener = new HotKeyListener()

interface AvaibleHotKey {
  RADIAL_MENU1: HotKey
  EDIT_RADIAL_MENU: HotKey
  SAVE: HotKey
  LIBRARY: HotKey
  ADDING_CHIPS_ADD: HotKey
  ADDING_CHIPS_SUB: HotKey
  CANCEL: HotKey
  NEW_CHIP: HotKey
  BACK_BTN: HotKey
}
