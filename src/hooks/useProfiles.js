import { useState, useCallback, useRef } from 'react'
import { db, storage } from '../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export const useProfiles = () => {
  // React stateはコンポーネントの再レンダリングに使用
  const [profileCache, setProfileCache] = useState({})
  // refは重複フェッチ防止に使用（stateより即時に更新される）
  const cacheRef = useRef({})

  // キャッシュから同期的に取得（未フェッチはundefined、未存在はnull）
  const getProfile = useCallback((uid) => {
    return profileCache[uid]
  }, [profileCache])

  // Firestoreから非同期フェッチ → キャッシュに保存
  // fetchProfileはstableな関数（依存配列が空）なのでuseEffectの依存に安全
  const fetchProfile = useCallback(async (uid) => {
    if (!uid) return null
    // すでにキャッシュにある場合はフェッチしない
    if (uid in cacheRef.current) return cacheRef.current[uid]

    const snap = await getDoc(doc(db, 'users', uid))
    const data = snap.exists() ? { uid, ...snap.data() } : null
    cacheRef.current[uid] = data
    setProfileCache(prev => ({ ...prev, [uid]: data }))
    return data
  }, [])

  // プロフィール更新（photoFileがある場合はStorageにアップロード）
  const upsertProfile = useCallback(async (uid, data, photoFile) => {
    let photoURL = data.photoURL || ''

    if (photoFile) {
      const storageRef = ref(storage, `profile-photos/${uid}`)
      await uploadBytes(storageRef, photoFile)
      photoURL = await getDownloadURL(storageRef)
    }

    const { uid: _uid, ...profileData } = { ...data, photoURL }
    await setDoc(doc(db, 'users', uid), profileData, { merge: true })

    const updated = { uid, ...profileData }
    cacheRef.current[uid] = updated
    setProfileCache(prev => ({ ...prev, [uid]: updated }))
    return updated
  }, [])

  return { getProfile, fetchProfile, upsertProfile }
}
