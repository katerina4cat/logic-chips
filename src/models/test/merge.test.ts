import { STATE, mergeState, stateInfo } from '../STATE'
import { expect, test } from 'vitest'

const checkTest = [
  [STATE.HIGHT, STATE.HIGHT, STATE.ERROR],
  [STATE.HIGHT, STATE.LOW, STATE.ERROR],
  [STATE.HIGHT, STATE.UNDEFINED, STATE.HIGHT],
  [STATE.HIGHT, STATE.ERROR, STATE.ERROR],

  [STATE.LOW, STATE.HIGHT, STATE.ERROR],
  [STATE.LOW, STATE.LOW, STATE.ERROR],
  [STATE.LOW, STATE.UNDEFINED, STATE.LOW],
  [STATE.LOW, STATE.ERROR, STATE.ERROR],

  [STATE.UNDEFINED, STATE.HIGHT, STATE.HIGHT],
  [STATE.UNDEFINED, STATE.LOW, STATE.LOW],
  [STATE.UNDEFINED, STATE.UNDEFINED, STATE.UNDEFINED],
  [STATE.UNDEFINED, STATE.ERROR, STATE.ERROR],

  [STATE.ERROR, STATE.HIGHT, STATE.ERROR],
  [STATE.ERROR, STATE.LOW, STATE.ERROR],
  [STATE.ERROR, STATE.UNDEFINED, STATE.ERROR],
  [STATE.ERROR, STATE.ERROR, STATE.ERROR]
]

checkTest.forEach((testValue) => {
  test(`${stateInfo[testValue[0]].title} <- ${stateInfo[testValue[1]].title} to be ${stateInfo[testValue[2]].title}`, () => {
    expect(mergeState(testValue[0], testValue[1])).toBe(testValue[2])
  })
})
