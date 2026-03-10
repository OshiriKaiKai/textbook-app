import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { useBooks } from './hooks/useBooks'
import { useProfiles } from './hooks/useProfiles'
import { LoginPage } from './pages/LoginPage'
import { SignUpPage } from './pages/SignUpPage'
import { VerifyEmailPage } from './pages/VerifyEmailPage'
import { BookListPage } from './pages/BookListPage'
import { ProfilePage } from './pages/ProfilePage'
import { ProfileEditPage } from './pages/ProfileEditPage'
import { BookUploadPage } from './pages/BookUploadPage'
import { BookDetailPage } from './pages/BookDetailPage'
import { BookEditPage } from './pages/BookEditPage'

import { useExams } from './hooks/useExams'
import { ExamListPage } from './pages/ExamListPage'
import { ExamUploadPage } from './pages/ExamUploadPage'
import { ExamDetailPage } from './pages/ExamDetailPage'

// ログイン済み かつ メール認証済みのみ通過できるガード
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth()
  if (!currentUser) return <Navigate to="/login" replace />
  if (!currentUser.emailVerified) return <Navigate to="/verify-email" replace />
  return children
}

const AppRoutes = () => {
  const { currentUser } = useAuth()
  const bookMethods = useBooks()
  const examMethods = useExams()
  const profileMethods = useProfiles()

  // ログイン済みでメール未認証 → /verify-email へ
  const isVerified = currentUser?.emailVerified
  const loginRedirect = currentUser
    ? (isVerified ? '/books' : '/verify-email')
    : null

  return (
    <Routes>
      {/* 認証画面 */}
      <Route
        path="/login"
        element={loginRedirect ? <Navigate to={loginRedirect} replace /> : <LoginPage />}
      />
      <Route
        path="/signup"
        element={loginRedirect ? <Navigate to={loginRedirect} replace /> : <SignUpPage />}
      />

      {/* メール認証待ち画面（ログイン済みだが未認証） */}
      <Route
        path="/verify-email"
        element={
          !currentUser ? <Navigate to="/login" replace /> :
          isVerified ? <Navigate to="/books" replace /> :
          <VerifyEmailPage />
        }
      />

      {/* 保護されたページ（ログイン＋メール認証済みのみ） */}
      <Route
        path="/books"
        element={
          <ProtectedRoute>
            <BookListPage {...bookMethods} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/edit"
        element={
          <ProtectedRoute>
            <ProfileEditPage {...profileMethods} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/:uid"
        element={
          <ProtectedRoute>
            <ProfilePage {...bookMethods} {...profileMethods} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/books/upload"
        element={
          <ProtectedRoute>
            <BookUploadPage addBook={bookMethods.addBook} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/books/:id/edit"
        element={
          <ProtectedRoute>
            <BookEditPage {...bookMethods} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/books/:id"
        element={
          <ProtectedRoute>
            <BookDetailPage {...bookMethods} {...profileMethods} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/exams"
        element={
          <ProtectedRoute>
            <ExamListPage {...examMethods} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/exams/upload"
        element={
          <ProtectedRoute>
            <ExamUploadPage addExam={examMethods.addExam} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/exams/:id"
        element={
          <ProtectedRoute>
            <ExamDetailPage {...examMethods} {...profileMethods} />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to={loginRedirect || '/login'} replace />}
      />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
