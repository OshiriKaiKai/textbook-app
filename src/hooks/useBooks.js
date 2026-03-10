import { useState, useEffect, useCallback } from 'react'
import { db } from '../firebase'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  query
} from 'firebase/firestore'
import { useAuth } from '../contexts/AuthContext'

export const useBooks = () => {
  const { currentUser } = useAuth()
  const [books, setBooks] = useState([])
  const [booksLoading, setBooksLoading] = useState(true)
  const [booksError, setBooksError] = useState(null)

  // currentUser全体ではなくuidを依存値にする
  // （fetchAndSetUserが呼ばれるたびに新しいオブジェクトが生成されるため、
  //   uid文字列を使わないとリスナーが起動→即キャンセル→再起動を繰り返す）
  const uid = currentUser?.uid || null

  useEffect(() => {
    if (!uid) {
      setBooks([])
      setBooksLoading(false)
      return
    }

    const q = query(collection(db, 'books'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const booksData = snapshot.docs
        .map(d => ({
          id: d.id,
          ...d.data(),
          createdAt: d.data().createdAt?.toDate().toISOString() || new Date().toISOString()
        }))
        // serverTimestamp()の保留中状態でも正しく並ぶようクライアント側でソート
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setBooks(booksData)
      setBooksLoading(false)
    }, (error) => {
      // 読み取りエラー（権限不足・ルール未設定など）を表示
      setBooksError(error.message)
      setBooksLoading(false)
    })

    return unsubscribe
  }, [uid])

  const addBook = useCallback(async (bookData) => {
    const docRef = await addDoc(collection(db, 'books'), {
      ...bookData,
      createdAt: serverTimestamp()
    })
    return docRef.id
  }, [])

  const updateBook = useCallback(async (id, updates) => {
    await updateDoc(doc(db, 'books', id), updates)
  }, [])

  const deleteBook = useCallback(async (id) => {
    await deleteDoc(doc(db, 'books', id))
  }, [])

  const getBook = useCallback((id) => {
    return books.find(b => b.id === id) || null
  }, [books])

  const getBooksByUser = useCallback((uid) => {
    return books.filter(b => b.uploaderId === uid)
  }, [books])

  return { books, booksLoading, booksError, addBook, updateBook, deleteBook, getBook, getBooksByUser }
}
