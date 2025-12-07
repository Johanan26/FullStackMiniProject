import { useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import GlobalContext from './store/globalContext'
import ProfileForm from '../components/users/ProfileForm'
import styles from '../styles/Profile.module.css'

function ProfilePage() {
    const globalCtx = useContext(GlobalContext)
    const router = useRouter()
    const user = globalCtx.theGlobalObject.isLoggedIn
    const loggedInUser = globalCtx.theGlobalObject.loggedInUser
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!user) {
            router.push('/login')
        }
    }, [user, router])

    async function updateProfileHandler(profileData) {
        setLoading(true)
        setError(null)
        setSuccess(null)
        
        try {
            await globalCtx.updateGlobals({
                cmd: 'updateProfile',
                newVal: profileData
            })
            setSuccess('Profile updated successfully!')
            setTimeout(() => setSuccess(null), 3000)
        } catch (err) {
            setError('Failed to update profile. Please try again.')
            console.error('Profile update error:', err)
        } finally {
            setLoading(false)
        }
    }

    if (!user || !loggedInUser) {
        return null // Will redirect
    }

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <ProfileForm
                    initialName={loggedInUser.name || loggedInUser.displayName || ''}
                    initialAge={loggedInUser.age || ''}
                    initialAvatar={loggedInUser.avatar || ''}
                    onUpdateProfile={updateProfileHandler}
                    loading={loading}
                />
            </div>
            {error && (
                <div className={styles.toastContainer}>
                    <div className={styles.errorMessage}>
                        {error}
                    </div>
                </div>
            )}
            {success && (
                <div className={styles.toastContainer}>
                    <div className={styles.successMessage}>
                        {success}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProfilePage

