export const isCardsIquals = ({ a, b }) => {
  if (!a && !b) return false
  if (a.image !== b.image) return false
  return true
}
