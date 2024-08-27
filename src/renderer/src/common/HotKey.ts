export class HotKey {
  listeners: ((data?: any) => void)[] = []
  addListener = (listener: (data?: any) => void) => {
    if (this.listeners.findIndex((listen) => listen === listener) !== 1)
      this.listeners.push(listener)
  }
  removeListener = (listener: (data?: any) => void) => {
    const ind = this.listeners.findIndex((listen) => listen === listener)
    if (ind !== -1) this.listeners.splice(ind, 1)
  }

  keyCodes: (string | RegExp)[]
  alt: boolean
  ctrl: boolean
  shift: boolean
  constructor(obj: {
    keyCodes: (string | RegExp)[]
    alt?: boolean
    ctrl?: boolean
    shift?: boolean
  }) {
    this.keyCodes = obj.keyCodes
    this.alt = obj.alt || false
    this.ctrl = obj.ctrl || false
    this.shift = obj.shift || false
  }

  test = (event: KeyboardEvent) => {
    if (event.altKey === this.alt && event.ctrlKey === this.ctrl && event.shiftKey === this.shift)
      if (
        this.keyCodes.findIndex((code) =>
          code instanceof RegExp ? code.test(event.code) : code === event.code
        ) !== -1
      ) {
        this.listeners.forEach((listener) => listener(event.code))
        event.preventDefault()
      }
  }
}
