import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/atoms/Button'

const departmentClass = {
  '良好': 'department-general',
  '学部専門': 'department-major',
  'その他': 'department-other'
}

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
    <div className="exam-detail-page">
      <div className="exam-detail-container">
        <div className="exam-detail-header">
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

        {/* 表紙エリア */}
        {exam.coverURL
          ? <img src={exam.coverURL} alt={exam.examName} className="exam-detail-cover" />
          : <div className="exam-detail-hero">📚</div>
        }

        {/* 書籍情報 */}
        <div className="exam-detail-card">
          <h1 className="exam-detail-title">{exam.examName}</h1>
          <p className="exam-detail-author">{exam.professorName}</p>
          <span className={`exam-detail-department ${departmentClass[exam.department] || ''}`}>
            {exam.department}
          </span>
          <div className="exam-detail-date">出品日: {formatDate(exam.createdAt)}</div>
        </div>

        {/* 出品者情報 */}
        <div
          className="exam-uploader-card"
          onClick={() => navigate(`/profile/${exam.uploaderId}`)}
        >
          <div>
            <p className="exam-uploader-label">出品者</p>
            <p className="exam-uploader-name">{exam.uploaderName}</p>
          </div>
          <span className="exam-uploader-arrow">→</span>
        </div>
      </div>
    </div>
  )
}
