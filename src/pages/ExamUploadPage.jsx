import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/atoms/Button'
import { ExamUploadForm } from '../components/organisms/ExamUploadForm'
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

  const [examName, setExamName] = useState('')
  const [examFile, setExamFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setExamFile(file)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')
    try {
      let fileURL = ''
      if (examFile) {
        const storageRef = ref(storage, `exam-files/${currentUser.uid}/${Date.now()}_${examFile.name}`)
        await uploadBytes(storageRef, examFile)
        fileURL = await getDownloadURL(storageRef)
      }
      await addExam({
        examName: examName.trim(),
        uploaderId: currentUser.uid,
        uploaderName: currentUser.name || currentUser.email,
        fileURL,
        fileName: examFile ? examFile.name : ''
      })
      navigate('/exams')
    } catch (err) {
      setError(err.message || '出品に失敗しました。もう一度お試しください。')
    } finally {
      setSubmitting(false)
    }
  }

  const canSubmit = examName.trim() && examFile

  return (
    <div className="form-page">
      <div className="form-container">
        <div className="form-header">
          <Button variant="ghost" onClick={() => navigate('/exams')}>← 戻る</Button>
          <h1 className="form-title">過去問を投稿</h1>
        </div>

        <div className="form-card" style={{ padding: 0, background: 'transparent', boxShadow: 'none' }}>
          {error && <div className="auth-error">{error}</div>}
          <ExamUploadForm
            examName={examName}
            setExamName={setExamName}
            examFile={examFile}
            handleFileChange={handleFileChange}
            handleSubmit={handleSubmit}
            submitting={submitting}
            canSubmit={canSubmit}
            onCancel={() => navigate('/exams')}
          />
        </div>
      </div>
    </div>
  )
}
