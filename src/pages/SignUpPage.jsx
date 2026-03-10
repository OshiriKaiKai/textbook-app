import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/atoms/Button'
import { Input } from '../components/atoms/Input'

export const SignUpPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('パスワードが一致しません')
      return
    }
    if (password.length < 6) {
      setError('パスワードは6文字以上にしてください')
      return
    }
    try {
      await register(email, password)
      navigate('/books')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo">📚</div>
        <h1 className="auth-title">新規登録</h1>
        <p className="auth-subtitle">アカウントを作成して始めましょう</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <Input
            label="メールアドレス"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="example@email.com"
          />
          <Input
            label="パスワード（6文字以上）"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="パスワードを入力"
          />
          <Input
            label="パスワード（確認）"
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            placeholder="パスワードを再入力"
          />
          <Button
            type="submit"
            variant="primary"
            disabled={!email || !password || !confirm}
          >
            アカウントを作成
          </Button>
        </form>

        <div className="auth-link">
          すでにアカウントをお持ちの方は <Link to="/login">ログイン</Link>
        </div>
      </div>
    </div>
  )
}
