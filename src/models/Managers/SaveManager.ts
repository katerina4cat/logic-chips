import { Chip, ISaveChip, ISaveSubChip } from '@models/Chip'
import { ChipType, chipTypeInfo } from '@models/ChipType'
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
import { action, computed, makeObservable, observable, reaction } from 'mobx'

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

  hasChipInSave = (chipName: string) => {
    return (
      this.currentSave?.chips.find((chip) => chip.title === chipName) !== undefined ||
      Object.values(chipTypeInfo).find((baseChips) => baseChips.title === chipName) !== undefined
    )
  }
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
  dependentChips = (chipName: string) => {
    return this.currentSave?.chips
      .filter((chip) => chip.subChips.find((subChip) => subChip.title === chipName))
      .map((chip) => chip.title)
  }
  removeChip = (chipName: string) => {
    this.currentSave!.chips =
      this.currentSave?.chips.filter((chip) => chip.title !== chipName) || []
    this.save()
  }
  addOrEditCurrentSave = (chip: Chip) => {
    if (this.currentSave === undefined) {
      alert('Как ты смог инициализировать сохранение чипа, без выбора сохранения?')
      return
    }
    const ind = this.currentSave.chips.findIndex((savedChip) => savedChip.title === chip.title)
    if (ind !== -1) this.currentSave.chips[ind] = chip.toSave()
    else this.currentSave.chips.push(chip.toSave())
    this.save()
  }

  save = () => {
    localStorage.setItem('saves', JSON.stringify(this.saves))
  }

  loadChipByInfo = (chipInfo: ISaveChip, thisChipInfo?: Partial<ISaveSubChip>) => {
    const chip = new CUSTOMChip(
      chipInfo.title,
      chipInfo.color,
      thisChipInfo?.id || 0,
      new Pos(thisChipInfo?.pos?.x, thisChipInfo?.pos?.y)
    )
    chipInfo.inputs.forEach((pinInfo) =>
      chip.addPin(
        new Pin(
          pinInfo.id,
          chip,
          pinInfo.statesInfo,
          pinInfo.type,
          chip.id === 0,
          new Pos(0, pinInfo.y)
        ),
        true
      )
    )
    chipInfo.outputs.forEach((pinInfo) =>
      chip.addPin(
        new Pin(pinInfo.id, chip, pinInfo.statesInfo, pinInfo.type, false, new Pos(0, pinInfo.y)),
        false
      )
    )
    chipInfo.subChips.forEach((subChipInfo) => {
      let addingChip: Chip | undefined = undefined
      switch (subChipInfo.type) {
        case ChipType.NOT:
          addingChip = new NOTChip(subChipInfo.id, new Pos(subChipInfo.pos.x, subChipInfo.pos.y))
          break
        case ChipType.AND:
          addingChip = new ANDChip(subChipInfo.id, new Pos(subChipInfo.pos.x, subChipInfo.pos.y))
          break
        case ChipType.ESEGMENT:
          addingChip = new ESEGMENTChip(
            subChipInfo.id,
            new Pos(subChipInfo.pos.x, subChipInfo.pos.y)
          )
          break
        case ChipType.TRISTATE:
          addingChip = new TRISTATEChip(
            subChipInfo.id,
            new Pos(subChipInfo.pos.x, subChipInfo.pos.y)
          )
          break
        case ChipType.ADAPTER:
          addingChip = new ADAPTERChip(
            subChipInfo.id,
            new Pos(subChipInfo.pos.x, subChipInfo.pos.y),
            subChipInfo.data
          )
          break
        case ChipType.BUS:
          addingChip = new BUSChip(
            subChipInfo.id,
            new Pos(subChipInfo.pos.x, subChipInfo.pos.y),
            subChipInfo.data
          )
          break
        case ChipType.CUSTOM:
          addingChip = this.loadChipByName(subChipInfo.title, subChipInfo)
      }
      if (addingChip) chip.addChip(addingChip)
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
      else alert('Не удалось найти пины провода')
    })
    return chip
  }

  loadChipByName = (chipName: string, thisChipInfo?: Partial<ISaveSubChip>) => {
    if (this.currentSave === undefined) {
      alert('Как ты смог инициализировать сохранение чипа, без выбора сохранения?')
      return
    }
    const chipInfo = this.currentSave.chips.find((chipI) => chipI.title === chipName)
    if (chipInfo === undefined) {
      switch (chipName) {
        case 'NOT':
          return new NOTChip(thisChipInfo?.id, new Pos())
        case 'AND':
          return new ANDChip(thisChipInfo?.id, new Pos())
        case 'TRISTATE':
          return new TRISTATEChip(thisChipInfo?.id, new Pos())
        case 'ESEGMENT':
          return new ESEGMENTChip(thisChipInfo?.id, new Pos())
        case 'ADAPTER':
          return new ADAPTERChip(thisChipInfo?.id, new Pos(), thisChipInfo?.data)
      }
      throw 'Невозможно открыть такой чип'
    }
    return this.loadChipByInfo(chipInfo, thisChipInfo)
  }
}
interface ISaveInfo {
  title: string
  created: number
  chips: ISaveChip[]
  wheels: string[][]
  unsavedChip?: ISaveChip
}

export const saveManager = new SaveManager()
