import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/atoms/Button'
import { BookUploadForm } from '../components/organisms/BookUploadForm'
import { storage } from '../firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'



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
        <div className="form-card" style={{ padding: 0, background: 'transparent', boxShadow: 'none' }}>
          {error && <div className="auth-error">{error}</div>}
          <BookUploadForm
            bookName={bookName}
            setBookName={setBookName}
            authorName={authorName}
            setAuthorName={setAuthorName}
            condition={condition}
            setCondition={setCondition}
            coverPreview={coverPreview}
            handleFileChange={handleFileChange}
            handleSubmit={handleSubmit}
            submitting={submitting}
            canSubmit={canSubmit}
            onCancel={() => navigate('/books')}
          />
        </div>
      </div>
    </div>
  )
}
