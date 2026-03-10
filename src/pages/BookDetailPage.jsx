import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/atoms/Button'

const conditionClass = {
  '良好': 'condition-good',
  '普通': 'condition-normal',
  '傷あり': 'condition-worn'
}

const formatDate = (isoStr) => {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
}

export const BookDetailPage = ({ getBook, deleteBook, booksLoading }) => {
  const { id } = useParams()
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [deleting, setDeleting] = useState(false)

  if (booksLoading) {
    return <div className="page-loading">読み込み中...</div>
  }

  const book = getBook(id)

  if (!book) {
    return (
      <div className="not-found-page">
        <h2>教科書が見つかりません</h2>
        <Button variant="ghost" onClick={() => navigate('/books')}>一覧に戻る</Button>
      </div>
    )
  }

  // 編集・削除権限：本人 または 管理者
  const canEdit = currentUser?.uid === book.uploaderId || currentUser?.isAdmin

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteBook(book.id)
      navigate('/books')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="book-detail-page">
      <div className="book-detail-container">
        <div className="book-detail-header">
          <Button variant="ghost" onClick={() => navigate('/books')}>← 一覧に戻る</Button>
          {canEdit && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button variant="outline" onClick={() => navigate(`/books/${id}/edit`)}>
                編集
              </Button>
              <Button variant="danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? '削除中...' : '削除'}
              </Button>
            </div>
          )}
        </div>

        {/* 表紙エリア */}
        {book.coverURL
          ? <img src={book.coverURL} alt={book.bookName} className="book-detail-cover" />
          : <div className="book-detail-hero">📚</div>
        }

        {/* 書籍情報 */}
        <div className="book-detail-card">
          <h1 className="book-detail-title">{book.bookName}</h1>
          <p className="book-detail-author">{book.authorName}</p>
          <span className={`book-detail-condition ${conditionClass[book.condition] || ''}`}>
            {book.condition}
          </span>
          <div className="book-detail-date">出品日: {formatDate(book.createdAt)}</div>
        </div>

        {/* 出品者情報 */}
        <div
          className="book-uploader-card"
          onClick={() => navigate(`/profile/${book.uploaderId}`)}
        >
          <div>
            <p className="book-uploader-label">出品者</p>
            <p className="book-uploader-name">{book.uploaderName}</p>
          </div>
          <span className="book-uploader-arrow">→</span>
        </div>
      </div>
    </div>
  )
}
