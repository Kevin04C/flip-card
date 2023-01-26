export const fetchPokemon = async (id) => {
  const URL = 'https://pokeapi.co/api/v2/pokemon/'
  try {
    const res = await fetch(URL + id)
    const { sprites } = await res.json()
    const { front_default: img } = sprites?.other['official-artwork']
    return img
  } catch (error) {
    throw new Error('Hubo un error')
  }
}
