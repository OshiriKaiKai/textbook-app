import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/atoms/Button'

export const VerifyEmailPage = () => {
  const { currentUser, logout, resendVerificationEmail, checkEmailVerified } = useAuth()
  const [resendMsg, setResendMsg] = useState('')
  const [checking, setChecking] = useState(false)

  const handleResend = async () => {
    try {
      await resendVerificationEmail()
      setResendMsg('確認メールを再送しました')
      setTimeout(() => setResendMsg(''), 4000)
    } catch {
      setResendMsg('送信に失敗しました。しばらく後にお試しください。')
    }
  }

  const handleCheck = async () => {
    setChecking(true)
    const verified = await checkEmailVerified()
    if (!verified) {
      setResendMsg('まだ確認が完了していません。メールをご確認ください。')
      setTimeout(() => setResendMsg(''), 4000)
    }
    setChecking(false)
    // 認証済みの場合はonAuthStateChangedが自動でページを切り替える
  }

  return (
    <div className="verify-email-page">
      <div className="verify-email-container">
        <div className="verify-email-icon">📨</div>
        <h1 className="verify-email-title">メールを確認してください</h1>
        <p className="verify-email-desc">
          <strong>{currentUser?.email}</strong> に確認メールを送りました。<br />
          メール内のリンクをクリックして、アカウントを有効化してください。
        </p>

        <div className="verify-email-actions">
          <Button variant="primary" onClick={handleCheck} disabled={checking}>
            {checking ? '確認中...' : '認証済みの場合はここをクリック'}
          </Button>
          <Button variant="ghost" onClick={handleResend}>
            確認メールを再送信
          </Button>
          <Button variant="ghost" onClick={logout}>
            ログアウト
          </Button>
        </div>

        <p className="verify-resend-msg">{resendMsg}</p>
      </div>
    </div>
  )
}
