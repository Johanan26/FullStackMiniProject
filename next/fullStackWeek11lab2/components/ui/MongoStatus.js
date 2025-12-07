import { useContext, useEffect, useState } from 'react'
import GlobalContext from '../../pages/store/globalContext'
import classes from './MongoStatus.module.css'

function MongoStatus() {
    const globalCtx = useContext(GlobalContext)
    const { mongoConnected, mongoStatus, mongoMessage } = globalCtx.theGlobalObject
    const [showSuccess, setShowSuccess] = useState(true)

    // Hide success message after 3 seconds
    useEffect(() => {
        if (mongoConnected && mongoStatus === 'connected') {
            const timer = setTimeout(() => {
                setShowSuccess(false)
            }, 3000)
            return () => clearTimeout(timer)
        } else {
            setShowSuccess(true)
        }
    }, [mongoConnected, mongoStatus])

    if (mongoStatus === 'checking') {
        return (
            <div className={classes.statusContainer}>
                <div className={classes.statusChecking}>
                    <span className={classes.spinner}>⏳</span>
                    <span>Checking MongoDB connection...</span>
                </div>
            </div>
        )
    }

    if (!mongoConnected) {
        return (
            <div className={classes.statusContainer}>
                <div className={classes.statusError}>
                    <span className={classes.icon}>❌</span>
                    <div className={classes.message}>
                        <strong>MongoDB Connection Issue</strong>
                        <p>{mongoMessage || 'MongoDB is not connected'}</p>
                        <small>
                            MongoDB: localhost:27017 | Backend Server: localhost:8000
                            {mongoMessage?.includes('404') && ' - Please restart the backend server'}
                        </small>
                    </div>
                </div>
            </div>
        )
    }

    // Only show success message briefly
    if (!showSuccess) {
        return null
    }

    return (
        <div className={classes.statusContainer}>
            <div className={classes.statusSuccess}>
                <span className={classes.icon}>✅</span>
                <span>MongoDB Connected</span>
            </div>
        </div>
    )
}

export default MongoStatus

