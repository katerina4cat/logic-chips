export const enum SIM_ERROR {
  LINKING_SELF_PIN,
  LINK_SEARCH_PIN,
  LINKING_DIFFERENT_PIN,
  WIRE_BUS_ALREADY_LINKED,
  CHIP_WIRE_NOT_EXISTS,
  CHIP_WIRE_ALREADY_EXISTS,
  CHIP_PIN_ALREADY_EXIST,
  CHIP_PIN_NOT_EXIST,
  CHIP_ALREADY_EXIST,
  CHIP_NOT_EXIST
}
export class SimulatingError extends Error {
  type: SIM_ERROR
  critical: number
  constructor(type: SIM_ERROR, message: string, critical: number = 1) {
    super(message)
    this.type = type
    this.critical = critical
  }
  static warning = (type: SIM_ERROR, message: string) => new SimulatingError(type, message)
}
