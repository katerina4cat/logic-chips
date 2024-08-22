import { expect, test } from 'vitest'
import { STATE, stateInfo } from '../STATE'
import { sleep, ton } from './common'
import { ANDChip } from '../DefaultChips/AND'
import { Pos } from '../common/Pos'
import { Pin } from '../Pin'
import { runInAction } from 'mobx'
import { NOTChip } from '../DefaultChips/NOT'
import { TRISTATEChip } from '../DefaultChips/TRISTATE'
import { Wire } from '../Wire'
import { Chip } from '../Chip'
import { CUSTOMChip } from '../DefaultChips/CUSTOM'

const checkTest = [
  [STATE.HIGHT, STATE.HIGHT],
  [STATE.HIGHT, STATE.LOW],
  [STATE.HIGHT, STATE.UNDEFINED],
  [STATE.HIGHT, STATE.ERROR],

  [STATE.LOW, STATE.HIGHT],
  [STATE.LOW, STATE.LOW],
  [STATE.LOW, STATE.UNDEFINED],
  [STATE.LOW, STATE.ERROR],

  [STATE.UNDEFINED, STATE.HIGHT],
  [STATE.UNDEFINED, STATE.LOW],
  [STATE.UNDEFINED, STATE.UNDEFINED],
  [STATE.UNDEFINED, STATE.ERROR],

  [STATE.ERROR, STATE.HIGHT],
  [STATE.ERROR, STATE.LOW],
  [STATE.ERROR, STATE.UNDEFINED],
  [STATE.ERROR, STATE.ERROR]
]

const checks = {
  AND1: new ANDChip(0, new Pos()),
  NOT: new NOTChip(1, new Pos()),
  TRISTATE: new TRISTATEChip(2, new Pos())
}

const thisProc = new CUSTOMChip('test', '', 3, new Pos())
runInAction(() => {
  thisProc.addPin(new Pin(0, thisProc, 'A', 1, true), true)
  thisProc.addPin(new Pin(1, thisProc, 'B', 1, true), true)
  thisProc.addPin(new Pin(2, thisProc, 'C', 1, true), true)
  thisProc.addWire(new Wire([], thisProc.inputs[0], checks.AND1.inputs[0]))
  thisProc.addWire(new Wire([], thisProc.inputs[1], checks.AND1.inputs[1]))
  thisProc.addWire(new Wire([], thisProc.inputs[2], checks.NOT.inputs[0]))
  thisProc.addWire(new Wire([], thisProc.inputs[0], checks.TRISTATE.inputs[0]))
  thisProc.addWire(new Wire([], thisProc.inputs[1], checks.TRISTATE.inputs[1]))
})

test(`AND`, async () => {
  const waitingResults = [
    STATE.HIGHT,
    STATE.LOW,
    STATE.LOW,
    STATE.ERROR,

    STATE.LOW,
    STATE.LOW,
    STATE.LOW,
    STATE.ERROR,

    STATE.LOW,
    STATE.LOW,
    STATE.LOW,
    STATE.ERROR,

    STATE.ERROR,
    STATE.ERROR,
    STATE.ERROR,
    STATE.ERROR
  ]
  for (let i = 0; i < checkTest.length; i++) {
    runInAction(() => {
      thisProc.inputs[0].selfStates[0] = checkTest[i][0]
      thisProc.inputs[1].selfStates[0] = checkTest[i][1]
    })
    await sleep(5)
    expect(
      checks.AND1.outputs[0].selfStates[0],
      `AND ${ton(checkTest[i][0])} ${ton(checkTest[i][1])} -> ${ton(checks.AND1.outputs[0].selfStates[0])} (${ton(waitingResults[i])})`
    ).toStrictEqual(waitingResults[i])
  }
})

test(`NOT`, async () => {
  const waitingResults = [
    STATE.LOW,
    STATE.LOW,
    STATE.LOW,
    STATE.LOW,

    STATE.HIGHT,
    STATE.HIGHT,
    STATE.HIGHT,
    STATE.HIGHT,

    STATE.HIGHT,
    STATE.HIGHT,
    STATE.HIGHT,
    STATE.HIGHT,

    STATE.ERROR,
    STATE.ERROR,
    STATE.ERROR,
    STATE.ERROR
  ]
  for (let i = 0; i < checkTest.length; i++) {
    runInAction(() => {
      thisProc.inputs[2].selfStates[0] = checkTest[i][0]
    })
    await sleep(5)
    expect(
      checks.NOT.outputs[0].selfStates[0],
      `NOT ${ton(checkTest[i][0])} -> ${ton(checks.NOT.outputs[0].selfStates[0])} (${ton(waitingResults[i])})`
    ).toStrictEqual(waitingResults[i])
  }
})

/*
1 1
1 0
1 U
1 E

0 1
0 0
0 U
0 E

U 1
U 0
U U
U E

E 1
E 0
E U
E E
   */
test(`TRISTATE`, async () => {
  const waitingResults = [
    STATE.HIGHT,
    STATE.UNDEFINED,
    STATE.UNDEFINED,
    STATE.ERROR,

    STATE.LOW,
    STATE.UNDEFINED,
    STATE.UNDEFINED,
    STATE.ERROR,

    STATE.UNDEFINED,
    STATE.UNDEFINED,
    STATE.UNDEFINED,
    STATE.ERROR,

    STATE.ERROR,
    STATE.UNDEFINED,
    STATE.UNDEFINED,
    STATE.ERROR
  ]
  for (let i = 0; i < checkTest.length; i++) {
    runInAction(() => {
      thisProc.inputs[0].selfStates[0] = checkTest[i][0]
      thisProc.inputs[1].selfStates[0] = checkTest[i][1]
    })
    await sleep(5)
    expect(
      checks.TRISTATE.outputs[0].selfStates[0],
      `TRISTATE ${ton(checkTest[i][0])} ${ton(checkTest[i][1])} -> ${ton(checks.TRISTATE.outputs[0].selfStates[0])} (${ton(waitingResults[i])})`
    ).toStrictEqual(waitingResults[i])
  }
})
