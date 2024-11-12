import { Pin } from '@models/Pin'
import GlobalVars from './GlobalVars'
import { action, observable } from 'mobx'
import { hotKeyEventListener } from './HotKeyListener'

export const wireConnector = { current: (pin?: Pin, ctrl: boolean = false) => {} }

export const currentVaribles: GlobalVars = observable({
  SidePinTitleVisible: false
})

const switchSideVisible = action((v?: any) => {
  if (v !== undefined && typeof v === 'boolean') currentVaribles.SidePinTitleVisible = v
  else currentVaribles.SidePinTitleVisible = !currentVaribles.SidePinTitleVisible
})
hotKeyEventListener.hotkeys.SWITCH_VISIBLE_TITLES.addListener(switchSideVisible)
