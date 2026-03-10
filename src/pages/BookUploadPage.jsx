import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
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

export const BookUploadPage = ({ addBook }) => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [bookName, setBookName] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [condition, setCondition] = useState('')
  const [coverFile, setCoverFile] = useState(null)
  const [coverPreview, setCoverPreview] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')
    try {
      let coverURL = ''
      if (coverFile) {
        const storageRef = ref(storage, `book-covers/${currentUser.uid}/${Date.now()}`)
        await uploadBytes(storageRef, coverFile)
        coverURL = await getDownloadURL(storageRef)
      }
      await addBook({
        bookName: bookName.trim(),
        authorName: authorName.trim(),
        condition,
        uploaderId: currentUser.uid,
        uploaderName: currentUser.name || currentUser.email,
        coverURL,
      })
      navigate('/books')
    } catch (err) {
      setError(err.message || '出品に失敗しました。もう一度お試しください。')
    } finally {
      setSubmitting(false)
    }
  }

  const canSubmit = bookName.trim() && authorName.trim() && condition

  return (
    <div className="form-page">
      <div className="form-container">
        <div className="form-header">
          <Button variant="ghost" onClick={() => navigate('/books')}>← 戻る</Button>
          <h1 className="form-title">教科書を出品</h1>
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
                画像を選択
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
            <Button variant="primary" onClick={handleSubmit} disabled={!canSubmit || submitting}>
              {submitting ? '出品中...' : '出品する'}
            </Button>
            <Button variant="ghost" onClick={() => navigate('/books')}>
              キャンセル
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
