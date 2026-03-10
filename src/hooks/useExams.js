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

export const useExams = () => {
  const { currentUser } = useAuth()
  const [exams, setExams] = useState([])
  const [examsLoading, setExamsLoading] = useState(true)
  const [examsError, setExamsError] = useState(null)

  const uid = currentUser?.uid || null

  useEffect(() => {
    if (!uid) {
      setExams([])
      setExamsLoading(false)
      return
    }

    const q = query(collection(db, 'exams'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const examsData = snapshot.docs
        .map(d => ({
          id: d.id,
          ...d.data(),
          createdAt: d.data().createdAt?.toDate().toISOString() || new Date().toISOString()
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setExams(examsData)
      setExamsLoading(false)
    }, (error) => {
      setExamsError(error.message)
      setExamsLoading(false)
    })

    return unsubscribe
  }, [uid])

  const addExam = useCallback(async (examData) => {
    const docRef = await addDoc(collection(db, 'exams'), {
      ...examData,
      createdAt: serverTimestamp()
    })
    return docRef.id
  }, [])

  const updateExam = useCallback(async (id, updates) => {
    await updateDoc(doc(db, 'exams', id), updates)
  }, [])

  const deleteExam = useCallback(async (id) => {
    await deleteDoc(doc(db, 'exams', id))
  }, [])

  const getExam = useCallback((id) => {
    return exams.find(e => e.id === id) || null
  }, [exams])

  const getExamsByUser = useCallback((uid) => {
    return exams.filter(e => e.uploaderId === uid)
  }, [exams])

  return { exams, examsLoading, examsError, addExam, updateExam, deleteExam, getExam, getExamsByUser }
}
