import { useMemo } from 'react'

export const Aside = ({
  isPlay,
  time,
  startGame,
  resetGame,
  countMomvements,
  winner,
  playAgain
}) => {
  const formatTime = (time = '') => {
    return Math.floor(time).toString().padStart(2, '0')
  }

  const minutes = useMemo(() => formatTime(time / 60), [time])
  const seconds = useMemo(() => formatTime(time % 60), [time])

  const handleStart = () => {
    startGame()
  }

  const handleReset = () => {
    resetGame()
  }

  return (
    <aside className="aside">
      <div className="aside-time">
        <h3 className="time-title">Tiempo</h3>
        <div className="time">
          <span>
            {minutes}:{seconds}
          </span>
        </div>
      </div>
      <div className="movements">
        <p>
          Movimientos: <span>{countMomvements}</span>
        </p>
      </div>
      {isPlay ? (
        <button className="btn btn-reset" onClick={handleReset}>
          REINICIAR
        </button>
      ) : winner ? (
        <button className="btn btn-reset" onClick={playAgain}>
          JUGAR DE NUEVO
        </button>
      ) : (
        <button className="btn btn-empezar" onClick={handleStart}>
          EMPEZAR
        </button>
      )}
    </aside>
  )
}
