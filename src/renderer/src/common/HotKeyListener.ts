import { makeObservable, observable } from 'mobx'
import { HotKey, HotKeysInfo } from './HotKey'

const defaultHotKey: { [key in keyof AvaibleHotKey]: HotKeysInfo[] } = {
  RADIAL_MENU: [{ keyCode: /Digit[1-9]/, alt: true }],
  SAVE: [{ keyCode: 'KeyS', ctrl: true }],
  LIBRARY: [{ keyCode: 'KeyA', ctrl: true }],
  ADDING_CHIPS_ADD: [{ keyCode: 'ArrowRight' }, { keyCode: 'ArrowUp' }],
  ADDING_CHIPS_SUB: [{ keyCode: 'ArrowLeft' }, { keyCode: 'ArrowDown' }],
  CANCEL: [{ keyCode: 'Escape' }],
  NEW_CHIP: [{ keyCode: 'KeyX', ctrl: true }],
  BACK_BTN: [{ keyCode: 'Backspace' }],
  UNDO: [{ keyCode: 'KeyZ' }],
  SWITCH_VISIBLE_TITLES: [{ keyCode: 'KeyQ' }, { keyCode: 'Tab' }]
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
  @observable
  hotkeys!: AvaibleHotKey
  canSearch = true

  saveCurrentSettings = () => {
    const buffHK = {}
    Object.keys(defaultHotKey).forEach((hotkeyName) => {
      buffHK[hotkeyName] = this.hotkeys[hotkeyName].keys
      buffHK[hotkeyName] = buffHK[hotkeyName].map(
        (key: HotKeysInfo): HotKeysInfo => ({
          ...key,
          keyCode: key.keyCode instanceof RegExp ? 'RegExp' + key.keyCode.source : key.keyCode
        })
      )
    })
    localStorage.setItem('hotkeys', JSON.stringify(buffHK))
    this.load()
  }

  load = () => {
    const savedHotkeys = JSON.parse(localStorage.getItem('hotkeys') || '[]') as unknown as {
      [key in string]: HotKeysInfo[]
    }
    const buffHK = {}
    Object.keys(defaultHotKey).forEach((hotkeyName) => {
      let keys = {}
      if (hotkeyName in savedHotkeys) keys = savedHotkeys[hotkeyName]
      else keys = defaultHotKey[hotkeyName]

      buffHK[hotkeyName] = new HotKey(keys as HotKeysInfo[])
    }) as any
    this.hotkeys = buffHK as AvaibleHotKey
  }

  constructor() {
    this.load()
    window.addEventListener('unload', this.unload)
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
    window.addEventListener('keypress', this.onKeyUp)
    makeObservable(this)
  }
  unload = () => {
    window.removeEventListener('unload', this.unload)
    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('keyup', this.onKeyUp)
    window.removeEventListener('keypress', this.onKeyUp)
  }
  onKeyUp = (e: KeyboardEvent) => {
    if (this.canSearch) Object.values(this.hotkeys).forEach((hotKey) => hotKey.test(e))
  }
  onKeyDown = (e: KeyboardEvent) => {
    if (this.canSearch) Object.values(this.hotkeys).forEach((hotKey) => hotKey.test(e, true))
  }
}

export const hotKeyEventListener = new HotKeyListener()

interface AvaibleHotKey {
  RADIAL_MENU: HotKey
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
