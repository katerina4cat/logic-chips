import { HotKey, HotKeyWithDigit } from './HotKey'

const defaultHotKeys: AvaibleHotKey = {
  RADIAL_MENU: new HotKeyWithDigit({ keyCodes: [/Digit[1-9]/], alt: true }),
  SAVE: new HotKey({ keyCodes: ['KeyS'], ctrl: true }),
  LIBRARY: new HotKey({ keyCodes: ['KeyA'], ctrl: true }),
  ADDING_CHIPS_ADD: new HotKey({ keyCodes: ['ArrowUp', 'ArrowRight'] }),
  ADDING_CHIPS_SUB: new HotKey({ keyCodes: ['ArrowLeft', 'ArrowDown'] }),
  CANCEL: new HotKey({ keyCodes: ['Escape'] }),
  NEW_CHIP: new HotKey({ keyCodes: ['KeyX'], ctrl: true }),
  BACK_BTN: new HotKey({ keyCodes: ['Backspace'] }),
  UNDO: new HotKey({ keyCodes: ['KeyZ'] }),
  SWITCH_VISIBLE_TITLES: new HotKey({ keyCodes: ['KeyQ', 'Tab'] })
}

interface HotkeyInfo {
  title: string
  digit?: true
  desc?: string
}

export const hotkeyInfo: { [key in keyof AvaibleHotKey]: HotkeyInfo } = {
  RADIAL_MENU: { title: 'Радиальное меню', desc: '', digit: true },
  SAVE: { title: 'Сохранение чипа', desc: '' },
  LIBRARY: { title: 'Открыть библиотеку чипов', desc: '' },
  ADDING_CHIPS_ADD: { title: 'Увеличить кол-во добавляемых чипов', desc: '' },
  ADDING_CHIPS_SUB: { title: 'Уменьшить кол-во добавляемых чипов', desc: '' },
  CANCEL: {
    title: 'Отмена текущего действия',
    desc: 'Используется для отмены протягивания провода, установки чипов, закрытия модальных окон.'
  },
  NEW_CHIP: {
    title: 'Создать новый чип',
    desc: 'Создаёт новый чип, очищая при этом всё поле редактора.'
  },
  BACK_BTN: {
    title: 'Выйти из вложенного просмотра назад',
    desc: 'Выходит на уровень ниже из просматриваемого чипа.'
  },
  UNDO: { title: 'Отменить последнюю опорную точку провода', desc: '' },
  SWITCH_VISIBLE_TITLES: {
    title: 'Вкл./Выкл. отображение подписей пинов',
    desc: 'Включение/Отключение отображения боковых подписей пинов чипов внутри редактора.'
  }
}

class HotKeyListener {
  hotkeys = defaultHotKeys
  canSearch = true

  constructor() {
    window.addEventListener('unload', this.unload)
    window.addEventListener('keydown', this.onKeyDown)
  }
  unload = () => {
    window.removeEventListener('unload', this.unload)
    window.removeEventListener('keydown', this.onKeyDown)
  }
  onKeyDown = (e: KeyboardEvent) => {
    if (this.canSearch) Object.values(this.hotkeys).forEach((hotKey) => hotKey.test(e))
  }
}

export const hotKeyEventListener = new HotKeyListener()

interface AvaibleHotKey {
  RADIAL_MENU: HotKeyWithDigit
  SAVE: HotKey
  LIBRARY: HotKey
  ADDING_CHIPS_ADD: HotKey
  ADDING_CHIPS_SUB: HotKey
  CANCEL: HotKey
  NEW_CHIP: HotKey
  BACK_BTN: HotKey
  UNDO: HotKey
  SWITCH_VISIBLE_TITLES: HotKey
}
