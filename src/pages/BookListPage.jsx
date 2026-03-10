import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { BookCard } from '../components/molecules/BookCard'
import { SearchBar } from '../components/molecules/SearchBar'
import { Button } from '../components/atoms/Button'

export const BookListPage = ({ books, booksLoading, booksError }) => {
  const [query, setQuery] = useState('')
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const filtered = books.filter(book =>
    book.bookName.toLowerCase().includes(query.toLowerCase()) ||
    book.authorName.toLowerCase().includes(query.toLowerCase())
  )

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="book-list-page">
      {/* ナビゲーションバー */}
      <nav className="navbar">
        <span className="navbar-brand" onClick={() => navigate('/books')}>📚 教科書交換</span>
        <div className="navbar-actions">
          <span className="navbar-user">{currentUser?.email}</span>
          <Button variant="ghost" onClick={() => navigate(`/profile/${currentUser?.uid}`)}>
            マイページ
          </Button>
          <Button variant="ghost" onClick={handleLogout}>ログアウト</Button>
        </div>
      </nav>

      <div className="book-list-content">
        <div className="book-list-header">
          <h1 className="book-list-title">教科書一覧</h1>
          <Button variant="primary" onClick={() => navigate('/books/upload')}>
            + 教科書を出品
          </Button>
        </div>

        <SearchBar value={query} onChange={setQuery} />

        {booksError && (
          <div className="auth-error">データの読み込みに失敗しました: {booksError}</div>
        )}

        {booksLoading ? (
          <div className="book-empty">読み込み中...</div>
        ) : filtered.length === 0 ? (
          <div className="book-empty">
            {query ? `「${query}」に一致する本が見つかりません` : 'まだ出品された教科書がありません'}
          </div>
        ) : (
          <div className="book-grid">
            {filtered.map((book, index) => (
              <BookCard key={book.id} book={book} index={index} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
