import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/atoms/Button'
import { Input } from '../components/atoms/Input'
import { storage } from '../firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const CONDITIONS = ['良好', '普通', '傷あり']

const conditionActiveClass = {
  '良好': 'active-good',
  '普通': 'active-normal',
  '傷あり': 'active-worn'
}

export const BookEditPage = ({ getBook, updateBook, booksLoading }) => {
  const { id } = useParams()
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const book = getBook(id)

  const [bookName, setBookName] = useState(book?.bookName || '')
  const [authorName, setAuthorName] = useState(book?.authorName || '')
  const [condition, setCondition] = useState(book?.condition || '')
  const [coverFile, setCoverFile] = useState(null)
  const [coverPreview, setCoverPreview] = useState(book?.coverURL || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  if (booksLoading) {
    return <div className="page-loading">読み込み中...</div>
  }

  if (!book) {
    return (
      <div className="not-found-page">
        <h2>教科書が見つかりません</h2>
        <Button variant="ghost" onClick={() => navigate('/books')}>一覧に戻る</Button>
      </div>
    )
  }

  // 編集権限チェック
  const canEdit = currentUser?.uid === book.uploaderId || currentUser?.isAdmin
  if (!canEdit) {
    return (
      <div className="not-found-page">
        <h2>編集権限がありません</h2>
        <Button variant="ghost" onClick={() => navigate(`/books/${id}`)}>詳細に戻る</Button>
      </div>
    )
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      let coverURL = book.coverURL || ''
      if (coverFile) {
        const storageRef = ref(storage, `book-covers/${currentUser.uid}/${Date.now()}`)
        await uploadBytes(storageRef, coverFile)
        coverURL = await getDownloadURL(storageRef)
      }
      await updateBook(id, {
        bookName: bookName.trim(),
        authorName: authorName.trim(),
        condition,
        coverURL,
      })
      // ⑧ → ④（出品者プロフィールへ遷移）
      navigate(`/profile/${book.uploaderId}`)
    } catch (err) {
      setError(err.message || '保存に失敗しました。もう一度お試しください。')
    } finally {
      setSaving(false)
    }
  }

  const canSubmit = bookName.trim() && authorName.trim() && condition

  return (
    <div className="form-page">
      <div className="form-container">
        <div className="form-header">
          <Button variant="ghost" onClick={() => navigate(`/books/${id}`)}>← 戻る</Button>
          <h1 className="form-title">教科書を編集</h1>
        </div>

        <div className="form-card">
          {error && <div className="auth-error">{error}</div>}

          {/* 表紙画像 */}
          <div className="input-group">
            <label className="input-label">表紙画像（任意）</label>
            <div className="photo-upload-area">
              {coverPreview
                ? <img src={coverPreview} alt="表紙プレビュー" className="book-cover-preview" />
                : <div className="book-cover-placeholder">📚</div>
              }
              <label className="photo-upload-btn">
                画像を変更
                <input
                  type="file"
                  accept="image/*"
                  className="photo-file-input"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          <Input
            label="本のタイトル *"
            value={bookName}
            onChange={e => setBookName(e.target.value)}
            placeholder="例: 数学ガール"
          />
          <Input
            label="著者名 *"
            value={authorName}
            onChange={e => setAuthorName(e.target.value)}
            placeholder="例: 結城 浩"
          />

          <div className="input-group">
            <label className="input-label">本の状態 *</label>
            <div className="condition-group">
              {CONDITIONS.map(c => (
                <button
                  key={c}
                  type="button"
                  className={`condition-btn ${condition === c ? conditionActiveClass[c] : ''}`}
                  onClick={() => setCondition(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <Button variant="primary" onClick={handleSave} disabled={!canSubmit || saving}>
              {saving ? '保存中...' : '保存する'}
            </Button>
            <Button variant="ghost" onClick={() => navigate(`/books/${id}`)}>
              キャンセル
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
