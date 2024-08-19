export const enum ChipType {
  CUSTOM,
  AND,
  NOT,
  TRISTATE,
  ESEGMENT,
  ADAPTER,
  BUS
}

interface IChipTypeInfo {
  title?: string
  color?: string
}

export const chipTypeInfo: { [key in ChipType]: IChipTypeInfo } = {
  [ChipType.CUSTOM]: {},
  [ChipType.AND]: { title: 'AND', color: '#267ab2' },
  [ChipType.NOT]: { title: 'NOT', color: '#8c1f1a' },
  [ChipType.TRISTATE]: { title: 'TRISTATE', color: '#262626' },
  [ChipType.ESEGMENT]: { title: 'ESEGMENT', color: '#242529' },
  [ChipType.ADAPTER]: { title: 'ADAPTER', color: '#809ec2' },
  [ChipType.BUS]: {}
}
