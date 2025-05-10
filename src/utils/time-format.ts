export const getDateFormatted = (date: Date): string | undefined => {
  if (!date) return undefined

  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  })
}
