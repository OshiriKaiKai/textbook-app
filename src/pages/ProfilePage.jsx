import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { BookCard } from '../components/molecules/BookCard'
import { Button } from '../components/atoms/Button'

export const ProfilePage = ({ getProfile, fetchProfile, getBooksByUser }) => {
  const { uid } = useParams()
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [profileLoading, setProfileLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setProfileLoading(true)
    fetchProfile(uid).finally(() => {
      if (!cancelled) setProfileLoading(false)
    })
    return () => { cancelled = true }
  }, [uid, fetchProfile])

  const profile = getProfile(uid)
  const userBooks = getBooksByUser(uid)

  // 編集権限：本人 または 管理者
  const canEdit = currentUser?.uid === uid || currentUser?.isAdmin

  if (profileLoading) {
    return <div className="page-loading">読み込み中...</div>
  }

  if (!profile) {
    return (
      <div className="not-found-page">
        <h2>プロフィールが見つかりません</h2>
        <Button variant="ghost" onClick={() => navigate('/books')}>一覧に戻る</Button>
      </div>
    )
  }

  return (
    <div className="profile-page">
      {/* ヒーロー画像エリア（画面上半分） */}
      <div className="profile-hero">
        {profile.photoURL ? (
          <img src={profile.photoURL} alt={profile.name} className="profile-photo" />
        ) : (
          <span className="profile-photo-placeholder">👤</span>
        )}
        <div className="profile-hero-overlay" />
      </div>

      <div className="profile-content">
        {/* プロフィール情報カード */}
        <div className="profile-info-card">
          <div className="profile-actions">
            <Button variant="ghost" onClick={() => navigate('/books')}>← 一覧に戻る</Button>
            {canEdit && (
              <Button variant="outline" onClick={() => navigate('/profile/edit')}>
                プロフィールを編集
              </Button>
            )}
          </div>

          <h1 className="profile-name">{profile.name || '（名前未設定）'}</h1>
          <p className="profile-department">{profile.department}</p>

          <div className="profile-meta">
            {profile.hobbies && (
              <div className="profile-meta-row">
                <span className="profile-meta-label">趣味</span>
                <span className="profile-meta-value">{profile.hobbies}</span>
              </div>
            )}
            {profile.lineLink && (
              <div className="profile-meta-row">
                <span className="profile-meta-label">LINE</span>
                <a
                  href={profile.lineLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="profile-meta-link"
                >
                  {profile.lineLink}
                </a>
              </div>
            )}
            {profile.bio && (
              <div className="profile-meta-row">
                <span className="profile-meta-label">自己紹介</span>
                <span className="profile-meta-value">{profile.bio}</span>
              </div>
            )}
          </div>
        </div>

        {/* 出品した本一覧 */}
        <h2 className="profile-section-title">出品した教科書（{userBooks.length}冊）</h2>
        {userBooks.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>出品した教科書はありません</p>
        ) : (
          <div className="profile-books-grid">
            {userBooks.map((book, index) => (
              <BookCard key={book.id} book={book} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
