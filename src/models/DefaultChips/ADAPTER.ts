import { action, makeObservable, observable, reaction, runInAction } from 'mobx'
import { Chip } from '../Chip'
import { ChipType, chipTypeInfo } from '../ChipType'
import { Pos } from '../common/Pos'
import { Pin } from '../Pin'

export interface IAdapterOutputSettings {
  id: number
  title: string
  inputID: number[]
  typeIndex: number[]
}

export class ADAPTERChip extends Chip {
  @observable
  displayAdderPin = true
  inputsID = 0
  @observable
  outputSettings: IAdapterOutputSettings[] = []
  constructor(id: number, pos: Pos, data: IAdapterOutputSettings[]) {
    super(
      chipTypeInfo[ChipType.ADAPTER].title!,
      ChipType.ADAPTER,
      chipTypeInfo[ChipType.ADAPTER].color!,
      id,
      pos
    )
    this.inputs.forEach((inp) => reaction(() => inp.totalStates, this.calculateLogic))
    makeObservable(this)
    this.setOutputSettings(data)
  }

  @action
  setOutputSettings = (outputSettings: IAdapterOutputSettings[]) => {
    this.outputSettings = outputSettings
    const buff: Pin[] = []
    outputSettings.forEach((settings) => {
      const ind = this.outputs.findIndex(
        (pin) => pin.id === settings.id && pin.type === settings.inputID.length
      )
      if (ind !== -1) buff.push(this.outputs[ind])
      else buff.push(new Pin(settings.id, this, settings.title, settings.inputID.length, true))
    })
    this.outputs = buff
  }

  calculateLogic = () => {
    this.outputSettings.forEach((settings) => {
      // Поиск выходного пина из настроек
      const outPin = this.outputs.find(
        (pin) => pin.id === settings.id && pin.type === settings.inputID.length
      )
      if (outPin) {
        // Проход по всем зависимым входным пинам для найденного выходного
        settings.inputID.forEach((inpID, ind) => {
          const inPin = this.inputs.find((pin) => pin.id === inpID)
          if (inPin) {
            // Если нашёлся входной пин
            runInAction(() => {
              // Устанавливается состояние в списке исходя из связанного индекса входного пина
              outPin.selfStates[ind] = inPin.totalStates[settings.typeIndex[ind]]
            })
          }
        })
      }
    })
  }

  @action
  addInput = (pin: Pin) => {
    const buff = new Pin(this.inputsID, this, pin.title, pin.type)
    this.inputsID += 1
    buff.linkPin(pin)
    this.inputs.push(buff)
    reaction(() => buff.totalStates, this.calculateLogic)
  }
}
