import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/atoms/Button'
import { Input } from '../components/atoms/Input'
import { storage } from '../firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const CONDITIONS = ['良好', '学部専門', 'その他']

const departmentActiveClass = {
  '良好': 'active-general',
  '学部専門': 'active-major',
  'その他': 'active-other'
}

export const ExamUploadPage = ({ addExam }) => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [examName, setBookName] = useState('')
  const [professorName, setAuthorName] = useState('')
  const [department, setCondition] = useState('')
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
        const storageRef = ref(storage, `exam-files/${currentUser.uid}/${Date.now()}`)
        await uploadBytes(storageRef, coverFile)
        coverURL = await getDownloadURL(storageRef)
      }
      await addExam({
        examName: examName.trim(),
        professorName: professorName.trim(),
        department,
        uploaderId: currentUser.uid,
        uploaderName: currentUser.name || currentUser.email,
        coverURL,
      })
      navigate('/exams')
    } catch (err) {
      setError(err.message || '出品に失敗しました。もう一度お試しください。')
    } finally {
      setSubmitting(false)
    }
  }

  const canSubmit = examName.trim() && professorName.trim() && department

  return (
    <div className="form-page">
      <div className="form-container">
        <div className="form-header">
          <Button variant="ghost" onClick={() => navigate('/exams')}>← 戻る</Button>
          <h1 className="form-title">過去問を投稿</h1>
        </div>

        <div className="form-card">
          {error && <div className="auth-error">{error}</div>}

          {/* 表紙画像 */}
          <div className="input-group">
            <label className="input-label">表紙画像（任意）</label>
            <div className="photo-upload-area">
              {coverPreview
                ? <img src={coverPreview} alt="表紙プレビュー" className="exam-file-preview" />
                : <div className="exam-file-placeholder">📚</div>
              }
              <label className="photo-upload-btn">
                画像を選択
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="photo-file-input"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          <Input
            label="本のタイトル *"
            value={examName}
            onChange={e => setBookName(e.target.value)}
            placeholder="例: 数学ガール"
          />
          <Input
            label="教授名 *"
            value={professorName}
            onChange={e => setAuthorName(e.target.value)}
            placeholder="例: 結城 浩"
          />

          <div className="input-group">
            <label className="input-label">本の対象学部 *</label>
            <div className="department-group">
              {CONDITIONS.map(c => (
                <button
                  key={c}
                  type="button"
                  className={`department-btn ${department === c ? departmentActiveClass[c] : ''}`}
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
            <Button variant="ghost" onClick={() => navigate('/exams')}>
              キャンセル
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
