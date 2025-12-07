import { useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import GlobalContext from './store/globalContext'
import LoginForm from '../components/users/LoginForm'

function LoginPage() {
  const globalCtx = useContext(GlobalContext)
  const router = useRouter()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (globalCtx.theGlobalObject.loggedInUser) {
      setLoading(false)
      router.push('/dashboard')
    }
  }, [globalCtx.theGlobalObject.loggedInUser, router])

  async function loginUser(userData) {
    setLoading(true)
    setError(null)
    try {
      await globalCtx.updateGlobals({ cmd: 'loginUser', newVal: userData })
    } catch (err) {
      setLoading(false)
      let errorMessage = 'Invalid email or password'
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email'
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password'
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address'
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later'
      }
      setError(errorMessage)
    }
  }

  return (
    <>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <LoginForm loginUser={loginUser} loading={loading} />
    </>
  )
}

export default LoginPage
