import { createContext, useContext, useState, useEffect } from 'react'
import { auth, db } from '../firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  reload
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // FirebaseユーザーにFirestoreのisAdmin等を付加してstateにセット
  const fetchAndSetUser = async (firebaseUser) => {
    if (!firebaseUser) {
      setCurrentUser(null)
      setLoading(false)
      return
    }
    const snap = await getDoc(doc(db, 'users', firebaseUser.uid))
    const firestoreData = snap.exists() ? snap.data() : {}
    setCurrentUser({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      emailVerified: firebaseUser.emailVerified,
      isAdmin: firestoreData.isAdmin || false,
      ...firestoreData
    })
    setLoading(false)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, fetchAndSetUser)
    return unsubscribe
  }, [])

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password)

  const register = async (email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    // 確認メールを送信
    await sendEmailVerification(result.user)
    // Firestoreドキュメントを作成
    await setDoc(doc(db, 'users', result.user.uid), {
      email,
      isAdmin: false,
      name: '',
      department: '',
      hobbies: '',
      lineLink: '',
      bio: '',
      photoURL: ''
    })
    return result.user
  }

  const logout = () => signOut(auth)

  // 確認メールを再送信
  const resendVerificationEmail = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser)
    }
  }

  // メール認証の完了を確認（リロードしてemailVerifiedを更新）
  const checkEmailVerified = async () => {
    if (auth.currentUser) {
      await reload(auth.currentUser)
      await fetchAndSetUser(auth.currentUser)
      return auth.currentUser.emailVerified
    }
    return false
  }

  const refreshCurrentUser = async () => {
    if (auth.currentUser) {
      await fetchAndSetUser(auth.currentUser)
    }
  }

  return (
    <AuthContext.Provider value={{
      currentUser,
      login,
      logout,
      register,
      refreshCurrentUser,
      resendVerificationEmail,
      checkEmailVerified,
      loading
    }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
