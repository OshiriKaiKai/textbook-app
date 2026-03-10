import { useRef } from 'react'
import { Button } from '../atoms/Button'
import { Input } from '../atoms/Input'

export const ExamUploadForm = ({
  examName, setExamName,
  examFile, handleFileChange,
  handleSubmit, submitting, canSubmit,
  onCancel
}) => {
  const fileInputRef = useRef(null)

  return (
    <div className="form-card">
      <div className="input-group">
        <label className="input-label">過去問ファイル *</label>
        <div className="photo-upload-area" style={{ minHeight: '80px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ color: 'var(--text-secondary)' }}>
            {examFile ? `選択中: ${examFile.name}` : 'ファイルが選択されていません'}
          </div>
          <label className="photo-upload-btn" style={{ width: 'fit-content', margin: '0 auto' }}>
            ファイルを選択
            <input
              type="file"
              accept="application/pdf,image/*,.doc,.docx"
              className="photo-file-input"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>

      <Input
        label="試験の名前 *"
        value={examName}
        onChange={e => setExamName(e.target.value)}
        placeholder="例: 2023年度 微分積分学 期末試験"
      />

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
