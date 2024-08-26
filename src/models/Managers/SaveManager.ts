import { Chip, ISaveChip } from '@models/Chip'
import { ChipType } from '@models/ChipType'
import { Colors } from '@models/common/COLORS'
import { Pos } from '@models/common/Pos'
import { ADAPTERChip } from '@models/DefaultChips/ADAPTER'
import { ANDChip } from '@models/DefaultChips/AND'
import { BUSChip } from '@models/DefaultChips/BUS'
import { CUSTOMChip } from '@models/DefaultChips/CUSTOM'
import { ESEGMENTChip } from '@models/DefaultChips/ESEGMENT'
import { NOTChip } from '@models/DefaultChips/NOT'
import { TRISTATEChip } from '@models/DefaultChips/TRISTATE'
import { Pin } from '@models/Pin'
import { Wire } from '@models/Wire'
import { computed, makeObservable, observable, reaction } from 'mobx'

class SaveManager {
  @observable
  saves: ISaveInfo[] = []
  constructor() {
    this.saves = JSON.parse(localStorage.getItem('saves') || '[]') as ISaveInfo[]
    makeObservable(this)
    reaction(() => this.currentSave, this.save)
  }
  @observable
  currentSave?: ISaveInfo
  @observable
  loadSaveByName = (title: string) => {
    const ind = this.saves.findIndex((save) => save.title === title)
    if (ind !== -1) this.currentSave = this.saves[ind]
    else {
      const buff = {
        title: title,
        created: Date.now(),
        chips: [],
        wheels: [['AND', 'NOT', 'TRISTATE'], [], [], [], [], [], [], [], []]
      }
      this.saves.push(buff)
      this.currentSave = buff
    }
  }
  @computed
  get savesTitleInfo() {
    return this.saves.map((save) => ({
      title: save.title,
      created: save.created,
      chips: save.chips.length
    }))
  }
  addOrEditCurrentSave = (chip: Chip) => {
    if (this.currentSave === undefined) {
      alert('Как ты смог инициализировать сохранение чипа, без выбора сохранения?')
      return
    }
    const ind = this.currentSave.chips.findIndex((savedChip) => savedChip.title === chip.title)
    if (ind !== -1) this.currentSave.chips[ind] = chip.toSave()
    else this.currentSave.chips.push(chip.toSave())
  }

  save = () => {
    localStorage.setItem('saves', JSON.stringify(this.saves))
  }

  loadChipByName = (chipName: string, id?: number) => {
    if (this.currentSave === undefined) {
      alert('Как ты смог инициализировать сохранение чипа, без выбора сохранения?')
      return
    }
    const chipInfo = this.currentSave.chips.find((chipI) => chipI.title === chipName)
    if (chipInfo === undefined) {
      switch (chipName) {
        case 'NOT':
          return new NOTChip(id, new Pos())
        case 'AND':
          return new ANDChip(id, new Pos())
        case 'TRISTATE':
          return new TRISTATEChip(id, new Pos())
        case 'ESEGMENT':
          return new ESEGMENTChip(id, new Pos())
        case 'ADAPTER':
          return new ADAPTERChip(id, new Pos(), [])
      }
      throw 'Невозможно открыть такой чип'
    }
    const chip = new CUSTOMChip(chipInfo.title, chipInfo.color, id || 0)
    chipInfo.inputs.forEach((pinInfo) =>
      chip.addPin(
        new Pin(
          pinInfo.id,
          chip,
          pinInfo.title,
          pinInfo.type,
          true,
          new Pos(0, pinInfo.y),
          Colors[pinInfo.color]
        ),
        true
      )
    )
    chipInfo.outputs.forEach((pinInfo) =>
      chip.addPin(
        new Pin(
          pinInfo.id,
          chip,
          pinInfo.title,
          pinInfo.type,
          false,
          new Pos(0, pinInfo.y),
          Colors[pinInfo.color]
        ),
        false
      )
    )
    chipInfo.subChips.forEach((subChipInfo) => {
      switch (subChipInfo.type) {
        case ChipType.NOT:
          return new NOTChip(subChipInfo.id, new Pos(subChipInfo.pos.x, subChipInfo.pos.y))
        case ChipType.AND:
          return new ANDChip(subChipInfo.id, new Pos(subChipInfo.pos.x, subChipInfo.pos.y))
        case ChipType.ESEGMENT:
          return new ESEGMENTChip(subChipInfo.id, new Pos(subChipInfo.pos.x, subChipInfo.pos.y))
        case ChipType.TRISTATE:
          return new TRISTATEChip(subChipInfo.id, new Pos(subChipInfo.pos.x, subChipInfo.pos.y))
        case ChipType.ADAPTER:
          return new ADAPTERChip(
            subChipInfo.id,
            new Pos(subChipInfo.pos.x, subChipInfo.pos.y),
            subChipInfo.data
          )
        case ChipType.BUS:
          return new BUSChip(
            subChipInfo.id,
            new Pos(subChipInfo.pos.x, subChipInfo.pos.y),
            subChipInfo.data
          )
        case ChipType.CUSTOM:
          return this.loadChipByName(chipInfo.title)
      }
    })
    chipInfo.wires.forEach((wire) => {
      const from = chip.findPin(wire.fromChip, wire.fromPin)
      const to = chip.findPin(wire.toChip, wire.toPin)
      if (from && to)
        chip.addWire(
          new Wire(
            wire.points.map((pos) => new Pos(pos.x, pos.y)),
            from,
            to,
            true,
            wire.id
          )
        )
    })
    return chip
  }
}
interface ISaveInfo {
  title: string
  created: number
  chips: ISaveChip[]
  wheels: string[][]
}

export const saveManager = new SaveManager()
