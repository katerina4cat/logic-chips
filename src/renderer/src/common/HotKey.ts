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
        let isAnyCompleted = false
        this.listeners.forEach((listener) => {
          const res = listener()
          if (res === undefined || res) isAnyCompleted = true
        })
        if (isAnyCompleted) event.preventDefault()
      }
  }
}

export class HotKeyWithDigit extends HotKey {
  override test = (event: KeyboardEvent) => {
    if (event.altKey === this.alt && event.ctrlKey === this.ctrl && event.shiftKey === this.shift)
      if (
        this.keyCodes.findIndex((code) =>
          code instanceof RegExp ? code.test(event.code) : code === event.code
        ) !== -1
      ) {
        let isAnyCompleted = false
        this.listeners.forEach((listener) => {
          const res = listener(Number(/\d+/.exec(event.code)))
          if (res === undefined || res) isAnyCompleted = true
        })
        if (isAnyCompleted) event.preventDefault()
      }
  }
}
