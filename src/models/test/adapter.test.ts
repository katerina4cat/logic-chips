import { expect, test } from 'vitest'
import { Pin } from '../Pin'
import { STATE } from '../STATE'
import { sleep, ton } from './common'
import { ADAPTERChip } from '../DefaultChips/ADAPTER'
import { Pos } from '../common/Pos'
import { runInAction } from 'mobx'

const pins = [new Pin(0, 'A', 1, true), new Pin(1, 'B', 4, true), new Pin(2, 'C', 1, true)]
const adapter = new ADAPTERChip(0, new Pos())
adapter.addInput(pins[0])
adapter.addInput(pins[1])
adapter.setOutputSettingss([
  {
    id: -1,
    inputID: [0, 1, 1, 1],
    typeIndex: [0, 0, 2, 3],
    title: 'x4Pin'
  },
  {
    id: -2,
    inputID: [1],
    typeIndex: [1],
    title: 'x1Pin1'
  },
  {
    id: -3,
    inputID: [1],
    typeIndex: [2],
    title: 'x1Pin2'
  }
])

test(`ADAPTER TEST`, async () => {
  runInAction(() => {
    pins[0].selfStates[0] = STATE.ERROR
    pins[1].selfStates[0] = STATE.LOW
    pins[1].selfStates[2] = STATE.HIGHT
    pins[1].selfStates[3] = STATE.UNDEFINED
  })
  const waitResult = [
    [STATE.ERROR, STATE.LOW, STATE.HIGHT, STATE.UNDEFINED],
    [STATE.LOW],
    [STATE.HIGHT]
  ]
  expect(adapter.outputs.map((out) => out.totalStates.map((state) => ton(state)))).toStrictEqual(
    waitResult.map((pin) => pin.map((state) => ton(state)))
  )
})
