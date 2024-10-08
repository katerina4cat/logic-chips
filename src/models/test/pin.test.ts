import 'reflect-metadata'
import { expect, test } from 'vitest'
import { Pin } from '../Pin'
import { STATE, stateInfo } from '../STATE'
import { sleep } from './common'
import { Chip } from '../Chip'
import { Pos } from '../common/Pos'
import { Wire } from '../Wire'
const buffChip = new Chip('ыв', undefined, 'sd', 0, new Pos())

const pins = {
  inOne: new Pin(0, buffChip, 'INPUT1', undefined, true),
  inTwo: new Pin(1, buffChip, 'INPUT2', undefined, true),
  inEgh: new Pin(2, buffChip, 'INPUT8', 8, true),
  inEgh3: new Pin(7, buffChip, 'INPUT8', 8, true),
  inEgh2: new Pin(5, buffChip, 'INPUT83', 8),
  outOne: new Pin(3, buffChip, 'INPUT1', undefined),
  outEgh: new Pin(4, buffChip, 'INPUT8', 8)
}

const wires: Wire[] = []
const createNewWire = (from: Pin, to: Pin) => {
  wires.push(new Wire([], from, to, true))
}

createNewWire(pins.inEgh3, pins.inEgh2)

for (let i = 0; i < 7; i++) pins.inEgh3.selfStates[i] = STATE.UNDEFINED
pins.inEgh3.selfStates[7] = pins.inOne.totalStates[0]

test(`Add one`, async () => {
  createNewWire(pins.inOne, pins.outOne)
  await sleep(100)
  expect(
    pins.outOne.totalStates,
    `[${pins.outOne.linkedPin.map((pin) => pin.totalStates[0]).join(', ')}] -> ${pins.outOne.totalStates[0]}`
  ).toStrictEqual([STATE.LOW])
})

test(`Change one`, async () => {
  pins.inOne.selfStates[0] = STATE.HIGHT
  await sleep(100)
  expect(pins.outOne.totalStates).toStrictEqual([STATE.HIGHT])
})

test(`Add second`, async () => {
  createNewWire(pins.inTwo, pins.outOne)
  await sleep(100)
  expect(pins.outOne.totalStates).toStrictEqual([STATE.ERROR])
})

test(`Change second`, async () => {
  pins.inTwo.selfStates[0] = STATE.LOW
  await sleep(100)
  expect(pins.outOne.totalStates).toStrictEqual([STATE.ERROR])
})

test(`Change First`, async () => {
  pins.inOne.selfStates[0] = STATE.LOW
  await sleep(100)
  expect(pins.outOne.totalStates).toStrictEqual([STATE.ERROR])
})

test(`Change First`, async () => {
  pins.inOne.selfStates[0] = STATE.ERROR
  await sleep(100)
  expect(pins.outOne.totalStates).toStrictEqual([STATE.ERROR])
})

test(`Composite adding`, async () => {
  createNewWire(pins.inEgh, pins.outEgh)

  await sleep(100)
  expect(pins.outEgh.totalStates).toStrictEqual([
    STATE.LOW,
    STATE.LOW,
    STATE.LOW,
    STATE.LOW,
    STATE.LOW,
    STATE.LOW,
    STATE.LOW,
    STATE.LOW
  ])
})

test(`Change composite`, async () => {
  pins.inEgh.selfStates[5] = STATE.HIGHT
  pins.inEgh.selfStates[3] = STATE.ERROR

  await sleep(100)
  expect(pins.outEgh.totalStates).toStrictEqual([
    STATE.LOW,
    STATE.LOW,
    STATE.LOW,
    STATE.ERROR,
    STATE.LOW,
    STATE.HIGHT,
    STATE.LOW,
    STATE.LOW
  ])
})

test(`Change composite`, async () => {
  createNewWire(pins.inEgh2, pins.outEgh)

  await sleep(100)
  expect(pins.outEgh.totalStates).toStrictEqual([
    STATE.LOW,
    STATE.LOW,
    STATE.LOW,
    STATE.ERROR,
    STATE.LOW,
    STATE.HIGHT,
    STATE.LOW,
    STATE.ERROR
  ])
})
