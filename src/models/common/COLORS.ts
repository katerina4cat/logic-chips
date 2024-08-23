export interface Color {
  color: string
  title: string
  id: COLORS
}

export const enum COLORS {
  red = 'red',
  green = 'green',
  indigo = 'indigo',
  blue = 'blue',
  yellow = 'yellow'
}

export const Colors: { [key in COLORS]: Color } = {
  [COLORS.red]: { id: COLORS.red, color: '#e93145', title: 'Красный' },
  [COLORS.green]: { id: COLORS.green, color: '#1fb03a', title: 'Зелёный' },
  [COLORS.indigo]: { id: COLORS.indigo, color: '#8c49ff', title: 'Индиго' },
  [COLORS.blue]: { id: COLORS.blue, color: '#147fff', title: 'Синий' },
  [COLORS.yellow]: { id: COLORS.yellow, color: '#ff9b00', title: 'Жёлтый' }
}
