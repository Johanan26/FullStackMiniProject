import { auth } from '../../../lib/firebase'
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut,
    updateProfile
} from 'firebase/auth'


export async function handleLoginUser(command, setGlobals) {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            command.newVal.email,
            command.newVal.password
        )

        return { success: true, user: userCredential.user }
    } catch (error) {
        console.error('Error signing in:', error)
        throw error
    }
}

export async function handleAddUser(command, setGlobals) {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth, 
            command.newVal.email, 
            command.newVal.password
        )
        
        // Update Firebase Auth display name if provided
        if (command.newVal.name && userCredential.user) {
            await updateProfile(userCredential.user, {
                displayName: command.newVal.name
            })
        }
        
        // Create/update user in MongoDB with Firebase UID link
        try {
            const mongoUserData = {
                firebaseUid: userCredential.user.uid,
                email: command.newVal.email,
                name: command.newVal.name || '',
            }
            
            if (command.newVal.age) {
                mongoUserData.age = command.newVal.age
            }
            
            // Create/update user in MongoDB (upsert will create if doesn't exist)
            await fetch('/api/update-user-profile', {
                method: 'POST',
                body: JSON.stringify(mongoUserData),
                headers: { 'Content-Type': 'application/json' },
            })
        } catch (mongoError) {
            console.error('Error saving user to MongoDB:', mongoError)
            // Don't throw - MongoDB save is secondary, Firebase Auth is primary
        }
        
        // The onAuthStateChanged listener will automatically update loggedInUser
        // No need to manually update state here
        
        return { success: true, user: userCredential.user }
    } catch (error) {
        console.error('Error creating user:', error)
        throw error
    }
}

export async function handleLogout(command, setGlobals) {
    try {
        await signOut(auth)
        return { success: true }
    } catch (error) {
        console.error('Error signing out:', error)
        throw error
    }
}

