import { useNavigate } from 'react-router-dom'

const conditionColor = {
  '良好': '#00ff88',
  '普通': 'var(--accent)',
  '傷あり': '#ff4d6d'
}

export const BookCard = ({ book, index = 0 }) => {
  const navigate = useNavigate()

  const handleCardClick = () => {
    navigate(`/books/${book.id}`)
  }

  const handleUploaderClick = (e) => {
    e.stopPropagation()
    navigate(`/profile/${book.uploaderId}`)
  }

  return (
    <div
      className="book-card"
      onClick={handleCardClick}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {book.coverURL
        ? <img src={book.coverURL} alt={book.bookName} className="book-card-cover" />
        : <div className="book-card-icon-wrap"><span className="book-card-icon">📚</span></div>
      }
      <div className="book-card-body">
        <h3 className="book-card-title">{book.bookName}</h3>
        <p className="book-card-author">{book.authorName}</p>
        <span
          className="book-card-condition"
          style={{ color: conditionColor[book.condition] || 'var(--text-primary)' }}
        >
          {book.condition}
        </span>
      </div>
      <p className="book-card-uploader" onClick={handleUploaderClick}>
        出品者: {book.uploaderName}
      </p>
    </div>
  )
}
