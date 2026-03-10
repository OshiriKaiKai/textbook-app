import { useNavigate } from 'react-router-dom'

const departmentColor = {
  '良好': '#00ff88',
  '学部専門': 'var(--accent)',
  'その他': '#ff4d6d'
}

export const ExamCard = ({ exam, index = 0 }) => {
  const navigate = useNavigate()

  const handleCardClick = () => {
    navigate(`/exams/${exam.id}`)
  }

  const handleUploaderClick = (e) => {
    e.stopPropagation()
    navigate(`/profile/${exam.uploaderId}`)
  }

  return (
    <div
      className="exam-card"
      onClick={handleCardClick}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {exam?.coverURL
        ? <img src={exam.coverURL} alt={exam.examName || '過去問'} className="exam-card-cover" />
        : <div className="exam-card-icon-wrap"><span className="exam-card-icon">📚</span></div>
      }
      <div className="exam-card-body">
        <h3 className="exam-card-title">{exam?.examName || '名称未設定'}</h3>
        <p className="exam-card-author">{exam?.professorName || '教授未設定'}</p>
        <span
          className="exam-card-department"
          style={{ color: departmentColor[exam?.department] || 'var(--text-primary)' }}
        >
          {exam?.department || '未設定'}
        </span>
      </div>
      <p className="exam-card-uploader" onClick={handleUploaderClick}>
        出品者: {exam?.uploaderName || '不明'}
      </p>
    </div>
  )
}
