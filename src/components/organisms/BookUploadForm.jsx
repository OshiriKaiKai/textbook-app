import { useRef } from 'react'
import { Button } from '../atoms/Button'
import { Input } from '../atoms/Input'

const CONDITIONS = ['良好', '普通', '傷あり']

const conditionActiveClass = {
  '良好': 'active-good',
  '普通': 'active-normal',
  '傷あり': 'active-worn'
}

export const BookUploadForm = ({
  bookName, setBookName,
  authorName, setAuthorName,
  condition, setCondition,
  coverPreview, handleFileChange,
  handleSubmit, submitting, canSubmit,
  onCancel
}) => {
  const fileInputRef = useRef(null)

  return (
    <div className="form-card">
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
        <Button variant="ghost" onClick={onCancel}>
          キャンセル
        </Button>
      </div>
    </div>
  )
}
