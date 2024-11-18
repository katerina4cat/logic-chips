import { action, makeObservable, observable, override, reaction, runInAction } from 'mobx'
import { Chip, ISaveSubChip } from '../Chip'
import { ChipType, chipTypeInfo } from '../ChipType'
import { Pos } from '../common/Pos'
import { Pin, PinStateInfo } from '../Pin'
import { generateNumberID } from '@models/common/RandomId'
import { Colors, COLORS } from '@models/common/COLORS'

export interface IAdapterSettings {
  inputs: IAdapterInputsConfig[]
  outputs: IAdapterOutputConfig[]
}

interface IAdapterInputsConfig {
  type: number
  id: number
}

interface IAdapterOutputConfig {
  states: IAdapterOutputState[]
  title: string
  id: number
}
interface IAdapterOutputState {
  inputID: number
  inputIndex: number
  title?: string
  color?: COLORS
}

export class ADAPTERChip extends Chip {
  @observable
  displayAdderPin = true
  inputsID = 0
  @observable
  outputSettings: IAdapterOutputConfig[] = []
  constructor(id: number = generateNumberID(), pos: Pos, data: IAdapterSettings) {
    super(
      chipTypeInfo[ChipType.ADAPTER].title!,
      ChipType.ADAPTER,
      chipTypeInfo[ChipType.ADAPTER].color!,
      id,
      pos
    )
    reaction(
      () => this.inputs.length,
      () => {
        this.inputs.forEach((pin) => {
          reaction(() => pin.totalStates, this.calculateLogic, {
            fireImmediately: true
          })
          reaction(() => pin.linkedPin.length, this.changeInputs, {
            fireImmediately: true
          })
        })
      },
      { fireImmediately: true }
    )
    if (data) this.setOutputSettings(data)
    makeObservable(this)
  }

  @action
  setOutputSettings = (settings: IAdapterSettings) => {
    this.outputSettings = settings.outputs
    settings.inputs.forEach((inp) => {
      this.inputs.push(new Pin(inp.id, this, undefined, inp.type, false))
    })
    this.calculateLogic()
  }

  @action
  changeInputs = () => {
    const inputs = this.inputs.filter((pin) => pin.linkedPin.length === 0 && pin.type > 0)
    if (inputs.length > 0) {
      this.inputs = this.inputs.filter((pin) => !inputs.find((pinF) => pin === pinF))
      this.calculateLogic()
    }
  }

  @action
  calculateLogic = () => {
    this.outputSettings.forEach((out) => {
      const pinStatesInfo = out.states.map((state) => ({
        title: state.title,
        state: this.inputs.find((pin) => pin.id === state.inputID)?.totalStates[state.inputIndex],
        color: state.color || COLORS.red
      }))
      if (pinStatesInfo.find((psta) => psta.state === undefined)) return
      if (!this.outputs.find((pin) => pin.id === out.id))
        this.outputs.push(
          new Pin(
            out.id,
            this,
            [
              new PinStateInfo(out.title),
              ...pinStatesInfo.map((state) => new PinStateInfo(state.title, state.color))
            ],
            out.states.length,
            true
          )
        )
      const pin = this.outputs.find((pin) => pin.id === out.id)!
      pin.selfStates = pinStatesInfo.map((psta) => psta.state!)
    })
  }

  @action
  addInput = (pin: Pin) => {
    const buff = new Pin(this.inputsID, this, undefined, pin.type)
    this.inputsID += 1
    buff.linkPin(pin)
    this.inputs.push(buff)
    reaction(() => buff.totalStates, this.calculateLogic)
  }

  toSubSave = (): ISaveSubChip => {
    const data: IAdapterSettings = {
      inputs: this.inputs.map((inp) => ({ id: inp.id, type: inp.type })),
      outputs: []
    }
    return { id: this.id, title: this.title, type: this.type, pos: this.pos, data: data }
  }
}
