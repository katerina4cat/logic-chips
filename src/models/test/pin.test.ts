import 'reflect-metadata'
import { expect, test } from 'vitest'
import { Pin } from '../Pin'
import { STATE, stateInfo } from '../STATE'
import { sleep } from './common'

const pins = {
  inOne: new Pin(0, 'INPUT1', undefined, true),
  inTwo: new Pin(1, 'INPUT2', undefined, true),
  inEgh: new Pin(2, 'INPUT8', 8, true),
  inEgh3: new Pin(7, 'INPUT8', 8, true),
  inEgh2: new Pin(5, 'INPUT83', 8),
  outOne: new Pin(3, 'INPUT1', undefined),
  outEgh: new Pin(4, 'INPUT8', 8)
}

pins.inEgh2.linkNewPin(pins.inEgh3)
for (let i = 0; i < 7; i++) pins.inEgh3.selfStates[i] = STATE.UNDEFINED
pins.inEgh3.selfStates[7] = pins.inOne.totalStates[0]


test(`Add one`, async () => {
  pins.outOne.linkNewPin(pins.inOne)
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
  pins.outOne.linkNewPin(pins.inTwo)
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
  pins.outEgh.linkNewPin(pins.inEgh)

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
  pins.outEgh.linkNewPin(pins.inEgh2)

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
