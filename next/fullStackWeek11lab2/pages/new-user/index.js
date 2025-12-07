import NewUserForm from '../../components/users/NewUserForm'
import { useRouter } from 'next/router';
import GlobalContext from "../../pages/store/globalContext"
import { useContext, useState, useEffect } from 'react'

function NewUserPage() {
    const router = useRouter()
    const globalCtx = useContext(GlobalContext)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (globalCtx.theGlobalObject.loggedInUser) {
            setLoading(false)
            router.push('/dashboard')
        }
    }, [globalCtx.theGlobalObject.loggedInUser, router])

    async function addUserHandler(enteredUserData)  {
        setLoading(true)
        setError(null)
        try {
            await globalCtx.updateGlobals({cmd: 'addUser', newVal: enteredUserData})
        } catch (err) {
            setLoading(false)
            let errorMessage = 'Failed to create account'
            if (err.code === 'auth/email-already-in-use') {
                errorMessage = 'An account with this email already exists'
            } else if (err.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address'
            } else if (err.code === 'auth/weak-password') {
                errorMessage = 'Password should be at least 6 characters'
            }
            setError(errorMessage)
        }
    }

    return (
        <>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            <NewUserForm onAddUser={addUserHandler} loading={loading} />
        </>
    )
}

export default NewUserPage