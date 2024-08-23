import { action, makeObservable } from 'mobx'
import { Chip } from '../Chip'
import { Pos } from '../common/Pos'
import { SimulatingError, SIM_ERROR } from '../common/SimulatingError'
import { Pin } from '../Pin'
import { Wire } from '../Wire'

export class CUSTOMChip extends Chip {
  constructor(title: string, color: string, id: number = Date.now(), pos: Pos = new Pos()) {
    super(title, undefined, color, id, pos)
    makeObservable(this)
  }

  @action
  addPin = (pin: Pin, input: boolean) => {
    if (input) {
      if (this.inputs.findIndex((findingPin) => findingPin.id === pin.id) !== -1)
        throw SimulatingError.warning(
          SIM_ERROR.CHIP_PIN_ALREADY_EXIST,
          'Данный пин уже был создан!'
        )
      this.inputs.push(pin)
    } else {
      if (this.outputs.findIndex((findingPin) => findingPin.id === pin.id) !== -1)
        throw SimulatingError.warning(
          SIM_ERROR.CHIP_PIN_ALREADY_EXIST,
          'Данный пин уже был создан!'
        )
      this.outputs.push(pin)
    }
  }

  @action
  destroyPin = (pin: Pin) => {
    const ind = (pin.isSource ? this.inputs : this.outputs).findIndex(
      (findingPin) => findingPin === pin
    )
    if (ind === -1)
      throw SimulatingError.warning(SIM_ERROR.CHIP_PIN_NOT_EXIST, 'Не удалось найти пин!')
    ;(pin.isSource ? this.inputs : this.outputs).splice(ind, 1)
    this.wires
      .filter((wire) => wire.from[1] === pin || wire.to[1] === pin)
      .forEach((wire) => this.destroyWire(wire))
  }

  @action
  addChip = (chip: Chip) => {
    const ind = this.subChips.findIndex((findingChip) => findingChip.id === chip.id)
    if (ind !== -1)
      throw SimulatingError.warning(SIM_ERROR.CHIP_ALREADY_EXIST, 'Чип с таким ID уже существует!')
    this.subChips.push(chip)
  }
  @action
  destroyChip = (chip: Chip) => {
    const ind = this.subChips.findIndex((findingChip) => findingChip.id === chip.id)
    if (ind === -1)
      throw SimulatingError.warning(SIM_ERROR.CHIP_NOT_EXIST, 'Не удалось найти этот чип!')
    this.wires
      .filter((wire) => wire.from[0] === chip || wire.to[0] === chip)
      .forEach((wire) => this.destroyWire(wire))
    this.subChips.slice(ind, 1)
  }

  @action
  addWire = (wire: Wire) => {
    const ind = this.wires.findIndex((findingWire) => findingWire === wire)
    if (ind !== -1)
      throw SimulatingError.warning(
        SIM_ERROR.CHIP_WIRE_ALREADY_EXISTS,
        'Такой провод уже существует!'
      )
    wire.completeLink()
    this.wires.push(wire)
  }

  @action
  destroyWire = (wire: Wire) => {
    const ind = this.wires.findIndex((findingWire) => findingWire === wire)
    if (ind === -1)
      throw SimulatingError.warning(
        SIM_ERROR.CHIP_WIRE_NOT_EXISTS,
        'Не удалось найти этот провод в чипе!'
      )
    wire.breakWire()
    this.wires.splice(ind, 1)
  }
}
