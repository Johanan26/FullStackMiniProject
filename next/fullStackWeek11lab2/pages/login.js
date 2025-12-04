// pages/login.js
import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import GlobalContext from './store/globalContext'
import LoginForm from '../components/users/LoginForm'

function LoginPage() {
  const globalCtx = useContext(GlobalContext)
  const router = useRouter()
  const [error, setError] = useState(null)

  async function loginUser(userData) {
    await globalCtx.updateGlobals({ cmd: 'loginUser', newVal: userData })

    if (globalCtx.theGlobalObject.loggedInUser) {
      setError('Invalid email or password')
      alert("Invalid email or password")
    } else {
      
      setError(null)
      router.push('/dashboard')
    }
  }

  return (
    <>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <LoginForm loginUser={loginUser} />
    </>
  )
}

export default LoginPage
