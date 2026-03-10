
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDOk-6XeZF9c3ncEjHHtiW9h0SxLe11dTE",
  authDomain: "textbookexchanging.firebaseapp.com",
  projectId: "textbookexchanging",
  storageBucket: "textbookexchanging.firebasestorage.app",
  messagingSenderId: "831439127181",
  appId: "1:831439127181:web:61c6b7450bd9b7f95658c4"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export { firebaseConfig }
