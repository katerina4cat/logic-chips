import { makeObservable, observable } from 'mobx'

export interface HotKeysInfo {
  keyCode: string | RegExp
  alt?: boolean
  ctrl?: boolean
  shift?: boolean
}

const dict = {
  ArrowUp: '↑',
  ArrowDown: '↓',
  ArrowLeft: '←',
  ArrowRight: '→',
  Backquote: '~',
  NumpadDecimal: 'Num .',
  NumpadMultiply: 'Num *',
  NumpadDivide: 'Num /',
  NumpadSubtract: 'Num -',
  NumpadAdd: 'Num +',
  Equal: '=',
  Minus: '-',
  Backslash: '\\',
  Slash: '/',
  Comma: '<',
  Period: '>',
  BracketLeft: '[',
  BracketRight: ']'
}

export const beautifyKeyCode = (keyCode?: string | RegExp) => {
  if (!keyCode) return ''
  if (keyCode instanceof RegExp) {
    return beautifyKeyCode(keyCode.source)
  }
  if (keyCode.startsWith('Key')) return keyCode.substring(3)
  if (keyCode in dict) return dict[keyCode]
  if (keyCode.startsWith('Numpad')) return keyCode.replace('Numpad', 'Num ')
  if (keyCode.startsWith('Digit')) return keyCode.replace('Digit', '')
  return keyCode
}

export class HotKey {
  listeners: ((data?: any) => boolean | void)[] = []
  addListener = (listener: (data?: any) => boolean | void) => {
    if (this.listeners.findIndex((listen) => listen === listener) !== 1)
      this.listeners.push(listener)
  }
  removeListener = (listener: (data?: any) => boolean | void) => {
    const ind = this.listeners.findIndex((listen) => listen === listener)
    if (ind !== -1) this.listeners.splice(ind, 1)
  }

  @observable
  keys: HotKeysInfo[] = []
  constructor(keys: HotKeysInfo[]) {
    this.keys = keys.map((key) => ({
      keyCode:
        key.keyCode instanceof RegExp
          ? key.keyCode
          : key.keyCode.startsWith('RegExp')
            ? RegExp(key.keyCode.substring(6))
            : key.keyCode,
      alt: !!key.alt,
      ctrl: !!key.ctrl,
      shift: !!key.shift
    }))
    makeObservable(this)
  }

  execute = (event?: Partial<KeyboardEvent>) => {
    this.listeners.forEach((listener) => {
      const res = listener(
        event?.code === 'None' ? event.code : Number(/\d+/.exec(event?.code || ''))
      )
      if (res === undefined || res) {
        event?.preventDefault && event?.preventDefault()
      }
    })
  }

  test = (event: KeyboardEvent, withRun: boolean = false) => {
    const index = this.keys.findIndex((key) =>
      key.keyCode instanceof RegExp ? key.keyCode.test(event.code) : key.keyCode === event.code
    )
    if (
      index !== -1 &&
      this.keys[index].alt === event.altKey &&
      this.keys[index].ctrl === event.ctrlKey &&
      this.keys[index].shift === event.shiftKey
    ) {
      event.preventDefault()
      if (withRun) this.execute(event)
    }
  }
}
