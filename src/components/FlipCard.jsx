import { useRef } from 'react'

export const FlipCard = ({ index, updateGame, image }) => {
  const cardRef = useRef(null)

  const handleBackCard = () => {
    updateGame(index, cardRef, image)
  }
  return (
    <article className="card" ref={cardRef} onClick={handleBackCard}>
      <div className="card-content">
        <div className="card-front">
          <span>?</span>
        </div>
        <div className="card-back">
          <img src={image} alt="" />
        </div>
      </div>
    </article>
  )
}
