export const RemoveElement = (arr: any[], el: any) => {
  const index = arr.findIndex((e) => e === el)
  if (index != -1) arr.splice(index, 1)
}
