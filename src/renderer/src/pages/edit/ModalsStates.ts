import { hotKeyEventListener } from '@renderer/common/HotKeyListener'
import { makeObservable, observable, action } from 'mobx'

type ModalsList = {
  saving: boolean
  radial: boolean
  library: boolean
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
      library: false
    }
    makeObservable(this)
    hotKeyEventListener.hotkeys.RADIAL_MENU1.addListener(this.radialHandler)
    hotKeyEventListener.hotkeys.SAVE.addListener(() => modalsStates.closeAll('saving'))
  }
  @action
  radialHandler = (data: string) => {
    const numberBuff = Number(data.match(/\d/))
    const swapRadial = this.currentRadial !== numberBuff
    this.currentRadial = numberBuff
    if (swapRadial) modalsStates.closeAll('radial', true)
    else modalsStates.closeAll('radial')
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
