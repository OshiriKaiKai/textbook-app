import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/atoms/Button'
import { Input } from '../components/atoms/Input'

export const ProfileEditPage = ({ fetchProfile, upsertProfile }) => {
  const { currentUser, refreshCurrentUser } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [profileLoading, setProfileLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [department, setDepartment] = useState('')
  const [hobbies, setHobbies] = useState('')
  const [lineLink, setLineLink] = useState('')
  const [bio, setBio] = useState('')
  const [photoPreviewURL, setPhotoPreviewURL] = useState('')
  const [photoFile, setPhotoFile] = useState(null)

  useEffect(() => {
    fetchProfile(currentUser.uid).then(profile => {
      if (profile) {
        setName(profile.name || '')
        setDepartment(profile.department || '')
        setHobbies(profile.hobbies || '')
        setLineLink(profile.lineLink || '')
        setBio(profile.bio || '')
        setPhotoPreviewURL(profile.photoURL || '')
      }
      setProfileLoading(false)
    })
  }, [currentUser.uid])

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPhotoFile(file)
    // createObjectURLでプレビュー表示（base64変換不要）
    setPhotoPreviewURL(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // photoFileがある場合はStorageへアップロード、ない場合は既存URLを維持
      await upsertProfile(
        currentUser.uid,
        { name, department, hobbies, lineLink, bio, photoURL: photoPreviewURL },
        photoFile
      )
      await refreshCurrentUser()
      navigate(`/profile/${currentUser.uid}`)
    } finally {
      setSaving(false)
    }
  }

  if (profileLoading) {
    return <div className="page-loading">読み込み中...</div>
  }

  return (
    <div className="form-page">
      <div className="form-container">
        <div className="form-header">
          <Button variant="ghost" onClick={() => navigate(`/profile/${currentUser.uid}`)}>
            ← 戻る
          </Button>
          <h1 className="form-title">プロフィール編集</h1>
        </div>

        <div className="form-card">
          {/* 写真アップロード */}
          <div className="input-group">
            <label className="input-label">プロフィール写真</label>
            <div className="photo-upload-area">
              {photoPreviewURL ? (
                <img src={photoPreviewURL} alt="プレビュー" className="photo-preview" />
              ) : (
                <div className="photo-placeholder">👤</div>
              )}
              <label className="photo-upload-btn">
                写真を選択
                <input
                  type="file"
                  accept="image/*"
                  className="photo-file-input"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                />
              </label>
              {photoPreviewURL && (
                <Button variant="ghost" onClick={() => {
                  setPhotoPreviewURL('')
                  setPhotoFile(null)
                }}>削除</Button>
              )}
            </div>
          </div>

          <Input
            label="名前 *"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="山田 太郎"
          />
          <Input
            label="学部"
            value={department}
            onChange={e => setDepartment(e.target.value)}
            placeholder="工学部"
          />
          <Input
            label="趣味"
            value={hobbies}
            onChange={e => setHobbies(e.target.value)}
            placeholder="読書、プログラミング"
          />
          <Input
            label="LINEのリンク"
            value={lineLink}
            onChange={e => setLineLink(e.target.value)}
            placeholder="https://line.me/ti/p/..."
          />

          <div className="input-group">
            <label className="input-label">自己紹介</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="自己紹介を入力してください..."
              className="input-field"
            />
          </div>

          <div className="form-actions">
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={!name.trim() || saving}
            >
              {saving ? '保存中...' : '保存する'}
            </Button>
            <Button variant="ghost" onClick={() => navigate(`/profile/${currentUser.uid}`)}>
              キャンセル
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
