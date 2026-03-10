import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/atoms/Button'



const formatDate = (isoStr) => {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
}

export const ExamDetailPage = ({ getExam, deleteExam, examsLoading }) => {
  const { id } = useParams()
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [deleting, setDeleting] = useState(false)

  if (examsLoading) {
    return <div className="page-loading">読み込み中...</div>
  }

  const exam = getExam(id)

  if (!exam) {
    return (
      <div className="not-found-page">
        <h2>過去問が見つかりません</h2>
        <Button variant="ghost" onClick={() => navigate('/exams')}>一覧に戻る</Button>
      </div>
    )
  }

  // 編集・削除権限：本人 または 管理者
  const canEdit = currentUser?.uid === exam.uploaderId || currentUser?.isAdmin

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteExam(exam.id)
      navigate('/exams')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="book-detail-page">
      <div className="book-detail-container">
        <div className="book-detail-header">
          <Button variant="ghost" onClick={() => navigate('/exams')}>← 一覧に戻る</Button>
          {canEdit && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button variant="outline" onClick={() => navigate(`/exams/${id}/edit`)}>
                編集
              </Button>
              <Button variant="danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? '削除中...' : '削除'}
              </Button>
            </div>
          )}
        </div>

        {/* ダウンロードエリア */}
        <div className="book-detail-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '40px 20px' }}>
          <h1 className="book-detail-title" style={{ marginBottom: '0' }}>{exam.examName}</h1>
          
          {(exam.fileURL || exam.coverURL) ? (
            <a 
              href={exam.fileURL || exam.coverURL} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ textDecoration: 'none', width: '100%', maxWidth: '300px' }}
              download={exam.fileName || '過去問ファイル'}
            >
              <Button variant="primary" style={{ width: '100%' }}>
                <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>📥</span>
                ファイルをダウンロード
              </Button>
            </a>
          ) : (
            <div style={{ color: 'var(--text-secondary)' }}>ファイルがありません</div>
          )}

          <div className="book-detail-date" style={{ marginTop: '20px' }}>出品日: {formatDate(exam.createdAt)}</div>
        </div>

        {/* 出品者情報 */}
        <div
          className="book-uploader-card"
          onClick={() => navigate(`/profile/${exam.uploaderId}`)}
        >
          <div>
            <p className="book-uploader-label">出品者</p>
            <p className="book-uploader-name">{exam.uploaderName}</p>
          </div>
          <span className="book-uploader-arrow">→</span>
        </div>
      </div>
    </div>
  )
}
