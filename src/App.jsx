import confetti from 'canvas-confetti'
import { useEffect, useRef, useState } from 'react'
import { FlipCard } from './components/FlipCard'
import { game } from './constant'
import { fetchPokemon } from './services/fetchPokemon'
import { isCardsIquals } from './logic/isEquals'
import { Aside } from './components/Aside'

const initalStateCardSelected = { a: null, b: null }

export const App = () => {
  const [randomImages, setRandomImages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [movements, setMovements] = useState(Array(game.cardsNumbers).fill(null))
  const [countMomvements, setCountMomvements] = useState(0)
  const [cardsSelected, setCardsSelected] = useState(initalStateCardSelected)
  const [isPlay, setIsPlay] = useState(false)
  const [time, setTime] = useState(0)
  const [winner, setWinner] = useState(false)
  const audioRef = useRef(new Audio('/assets/sounds/success.mp3'))

  const getRandomImages = async () => {
    const idsPokemonsRandom = Array.from({ length: game.cardsNumbers / 2 }, () =>
      Math.floor(Math.random() * 1000)
    )
    try {
      const promises = idsPokemonsRandom.map((id) => fetchPokemon(id))
      const images = await Promise.all(promises)
      const state = [...images, ...images].sort(() => 0.5 - Math.random())
      setRandomImages(state)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const gameWinner = (movements) => {
    const winner = movements.every((m) => m === true)
    if (winner) {
      confetti()
      setWinner(true)
      setIsPlay(false)
    }
  }

  const updateGame = (index, cardRef, image) => {
    if (isPlay) {
      setCountMomvements((prev) => prev + 1)
      if (!cardsSelected.a && !cardsSelected.b) {
        const newState = { ...cardsSelected, a: { index, cardRef, image } }
        setCardsSelected(newState)
        cardRef.current.classList.add('show')
      }
      if (cardsSelected.a && !cardsSelected.b) {
        const newStateCardSelected = { ...cardsSelected, b: { index, cardRef, image } }
        setCardsSelected(newStateCardSelected)
        cardRef.current.classList.add('show')

        const resp = isCardsIquals(newStateCardSelected)

        if (!resp) {
          setTimeout(() => {
            newStateCardSelected.a.cardRef.current.classList.remove('show')
            newStateCardSelected.b.cardRef.current.classList.remove('show')
            setCardsSelected(initalStateCardSelected)
          }, 1000)
          return
        }

        audioRef.current.play()
        const newStateMovements = [...movements]
        const a = newStateCardSelected.a.index
        const b = newStateCardSelected.b.index
        newStateMovements[a] = true
        newStateMovements[b] = true

        setCardsSelected(initalStateCardSelected)
        setMovements(newStateMovements)
        gameWinner(newStateMovements)
      }
    }
  }

  const startGame = () => {
    setIsPlay(true)
  }

  const resetGame = () => {
    const res = confirm('¿Seguro que deseas reiniciar la partida?')
    if (res) {
      playAgain()
    }
  }

  const playAgain = () => {
    setRandomImages([])
    setMovements(Array(game.cardsNumbers).fill(null))
    setCountMomvements(0)
    setCardsSelected(initalStateCardSelected)
    setIsPlay(false)
    setTime(0)
    setWinner(false)
  }

  useEffect(() => {
    if (randomImages.length === 0) {
      getRandomImages()
    }
  }, [randomImages])

  useEffect(() => {
    let interval = null
    if (isPlay) {
      interval = setInterval(() => {
        setTime(time + 1)
      }, 1000)
    }
    return () => {
      clearInterval(interval)
    }
  }, [isPlay, time])

  return (
    <section className="container">
      <div className="wrapper">
        <div className="game">
          <div className="cards-content">
            <section className="cards">
              {isLoading ? (
                <p>cargando...</p>
              ) : (
                randomImages.map((image, index) => (
                  <FlipCard key={index} index={index} image={image} updateGame={updateGame} />
                ))
              )}
            </section>
          </div>
          <Aside
            isPlay={isPlay}
            time={time}
            startGame={startGame}
            countMomvements={countMomvements}
            winner={winner}
            resetGame={resetGame}
            playAgain={playAgain}
          />
        </div>
      </div>
    </section>
  )
}
