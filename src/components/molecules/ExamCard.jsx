import { useNavigate } from 'react-router-dom'



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
      className="book-card"
      onClick={handleCardClick}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="book-card-icon-wrap">
        <span className="book-card-icon">📁</span>
      </div>
      <div className="book-card-body">
        <h3 className="book-card-title">{exam?.examName || '名称未設定'}</h3>
        <p className="book-card-author">
          {exam?.fileURL || exam?.coverURL ? 'ファイルあり' : 'ファイルなし'}
        </p>
      </div>
      <p className="book-card-uploader" onClick={handleUploaderClick}>
        出品者: {exam?.uploaderName || '不明'}
      </p>
    </div>
  )
}
