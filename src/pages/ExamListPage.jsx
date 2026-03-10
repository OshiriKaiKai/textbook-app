import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ExamCard } from '../components/molecules/ExamCard'
import { SearchBar } from '../components/molecules/SearchBar'
import { Button } from '../components/atoms/Button'

export const ExamListPage = ({ exams, examsLoading, examsError }) => {
  const [query, setQuery] = useState('')
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const filtered = exams.filter(exam =>
    (exam.examName || '').toLowerCase().includes(query.toLowerCase()) ||
    (exam.professorName || '').toLowerCase().includes(query.toLowerCase())
  )

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="exam-list-page">
      {/* ナビゲーションバー */}
      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span className="navbar-brand" onClick={() => navigate('/books')}>📚 一橋文庫</span>
          <Button variant="ghost" onClick={() => navigate('/books')}>教科書</Button>
          <Button variant="ghost" onClick={() => navigate('/exams')}>過去問</Button>
        </div>
        <div className="navbar-actions">
          <span className="navbar-user">{currentUser?.email}</span>
          <Button variant="ghost" onClick={() => navigate(`/profile/${currentUser?.uid}`)}>
            マイページ
          </Button>
          <Button variant="ghost" onClick={handleLogout}>ログアウト</Button>
        </div>
      </nav>

      <div className="exam-list-content">
        <div className="exam-list-header">
          <h1 className="exam-list-title">過去問一覧</h1>
          <Button variant="primary" onClick={() => navigate('/exams/upload')}>
            + 過去問を投稿
          </Button>
        </div>

        <SearchBar value={query} onChange={setQuery} />

        {examsError && (
          <div className="auth-error">データの読み込みに失敗しました: {examsError}</div>
        )}

        {examsLoading ? (
          <div className="exam-empty">読み込み中...</div>
        ) : filtered.length === 0 ? (
          <div className="exam-empty">
            {query ? `「${query}」に一致する本が見つかりません` : 'まだ投稿された過去問がありません'}
          </div>
        ) : (
          <div className="exam-grid">
            {filtered.map((exam, index) => (
              <ExamCard key={exam.id} exam={exam} index={index} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
