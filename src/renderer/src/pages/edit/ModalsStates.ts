import { hotKeyEventListener } from '@renderer/common/HotKeyListener'
import { makeObservable, observable, action } from 'mobx'

type ModalsList = {
  saving: boolean
  radial: boolean
  library: boolean
  menu: boolean
}

class ModalsStates {
  @observable
  states: ModalsList
  @observable
  currentRadial = 1
  constructor() {
    this.states = {
      saving: false,
      radial: false,
      library: false,
      menu: false
    }
    makeObservable(this)
    hotKeyEventListener.hotkeys.RADIAL_MENU.addListener(this.radialHandler)
    hotKeyEventListener.hotkeys.SAVE.addListener(() => {
      if (!this.states.menu) modalsStates.closeAll('saving')
    })
    hotKeyEventListener.hotkeys.LIBRARY.addListener(() => {
      if (!this.states.menu) modalsStates.closeAll('library')
    })
    hotKeyEventListener.hotkeys.CANCEL.addListener(this.cancelHandler)
  }
  @action
  cancelHandler = () => {
    this.closeAll(
      'menu',
      !Object.values(this.states).find((state) => state) &&
        hotKeyEventListener.hotkeys.CANCEL.listeners.length === 1
    )
  }
  @action
  radialHandler = (digit: number) => {
    if (this.states.menu) return
    if (hotKeyEventListener.hotkeys.RADIAL_MENU.listeners.length !== 1) return
    if (this.currentRadial !== digit) {
      this.currentRadial = digit
      if (!this.states.radial) this.closeAll('radial', true)
      return
    }
    this.closeAll('radial')
  }
  @action
  closeAll = (except: keyof ModalsList, v?: boolean) => {
    Object.keys(this.states).forEach((key) => {
      if (key !== except) this.states[key] = false
    })
    if (v === undefined) this.states[except] = !this.states[except]
    else this.states[except] = v
  }
}
export const modalsStates = new ModalsStates()
