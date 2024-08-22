import { expect, test } from 'vitest'
import { mergeStates, STATE, stateInfo } from '../STATE'
import { sleep, ton } from './common'
import { ANDChip } from '../DefaultChips/AND'
import { Pos } from '../common/Pos'
import { Pin } from '../Pin'
import { runInAction } from 'mobx'
import { NOTChip } from '../DefaultChips/NOT'
import { TRISTATEChip } from '../DefaultChips/TRISTATE'
import { BUSChip } from '../DefaultChips/BUS'
import { Chip } from '@models/Chip'

const chip = new Chip('', undefined, '', 0, new Pos())
const pins = {
  A: new Pin(0, chip, 'A', 1, true),
  B: new Pin(1, chip, 'B', 1, true),
  C: new Pin(2, chip, 'C', 1, true),
  D: new Pin(3, chip, 'D', 8, true),
  D2: new Pin(32, chip, 'D2', 8, true),
  R1: new Pin(4, chip, 'R1', 1),
  R2: new Pin(4, chip, 'R1', 8)
}

const bus = {
  bus1_1: new BUSChip(0, new Pos(), 1),
  bus2_1: new BUSChip(1, new Pos(), 1),
  bus3_1: new BUSChip(2, new Pos(), 1),
  bus4_8: new BUSChip(3, new Pos(), 8),
  bus5_8: new BUSChip(4, new Pos(), 8)
}

runInAction(() => {
  pins.A.selfStates[0] = STATE.UNDEFINED
  pins.B.selfStates[0] = STATE.UNDEFINED
  pins.C.selfStates[0] = STATE.UNDEFINED
  pins.D.selfStates = [
    STATE.UNDEFINED,
    STATE.UNDEFINED,
    STATE.UNDEFINED,
    STATE.UNDEFINED,
    STATE.UNDEFINED,
    STATE.UNDEFINED,
    STATE.UNDEFINED,
    STATE.UNDEFINED
  ]

  pins.D2.selfStates = [
    STATE.UNDEFINED,
    STATE.HIGHT,
    STATE.UNDEFINED,
    STATE.UNDEFINED,
    STATE.UNDEFINED,
    STATE.UNDEFINED,
    STATE.HIGHT,
    STATE.UNDEFINED
  ]

  bus.bus1_1.linkInputPin(pins.A)
  bus.bus2_1.linkInputPin(pins.B)
  bus.bus2_1.linkInputPin(pins.C)
  bus.bus1_1.linkBus(bus.bus2_1)
  bus.bus2_1.linkBus(bus.bus3_1)
  pins.R1.linkPin(bus.bus3_1.outputs[0])
  bus.bus4_8.linkBus(bus.bus5_8)
  pins.R2.linkPin(bus.bus5_8.outputs[0])
  bus.bus4_8.linkInputPin(pins.D)
  bus.bus5_8.linkInputPin(pins.D2)
})

test(`One 1`, async () => {
  runInAction(() => {
    pins.A.selfStates[0] = STATE.HIGHT
  })
  await sleep(5)
  expect(
    pins.R1.totalStates,
    `${ton(pins.A.totalStates[0])} -> ${ton(pins.R1.totalStates[0])}`
  ).toStrictEqual([STATE.HIGHT])
})

test(`One 2`, async () => {
  runInAction(() => {
    pins.A.selfStates[0] = STATE.UNDEFINED
    pins.C.selfStates[0] = STATE.LOW
  })
  await sleep(5)
  expect(
    pins.R1.totalStates,
    `${ton(pins.C.totalStates[0])} -> ${ton(pins.R1.totalStates[0])}`
  ).toStrictEqual([STATE.LOW])
})

test(`One 3`, async () => {
  runInAction(() => {
    pins.A.selfStates[0] = STATE.HIGHT
    pins.B.selfStates[0] = STATE.LOW
    pins.C.selfStates[0] = STATE.UNDEFINED
  })
  await sleep(5)
  expect(
    pins.R1.totalStates,
    `${ton(pins.C.totalStates[0])} -> ${ton(pins.R1.totalStates[0])}`
  ).toStrictEqual([STATE.ERROR])
})

test(`One 4`, async () => {
  runInAction(() => {
    bus.bus2_1.unlinkInputPin(pins.B)
  })
  await sleep(5)
  expect(pins.R1.totalStates).toStrictEqual([STATE.HIGHT])
})

test(`One 5`, async () => {
  runInAction(() => {
    bus.bus2_1.linkInputPin(pins.B)
    bus.bus1_1.unlinkBus(bus.bus2_1)
  })
  await sleep(5)
  expect(pins.R1.totalStates).toStrictEqual([STATE.LOW])
})

test(`Many 1`, async () => {
  runInAction(() => {
    pins.D.selfStates = [
      STATE.LOW,
      STATE.UNDEFINED,
      STATE.UNDEFINED,
      STATE.ERROR,
      STATE.UNDEFINED,
      STATE.HIGHT,
      STATE.HIGHT,
      STATE.LOW
    ]
  })
  await sleep(5)
  expect(pins.R2.totalStates).toStrictEqual(mergeStates(pins.D.selfStates, pins.D2.selfStates))
})

test(`Many 2`, async () => {
  runInAction(() => {
    bus.bus4_8.unlinkBus(bus.bus5_8)
  })
  await sleep(5)
  expect(pins.R2.totalStates).toStrictEqual(pins.D2.selfStates)
})
