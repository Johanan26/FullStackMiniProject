import { auth } from '../../../lib/firebase'
import { updateProfile } from 'firebase/auth'

export async function getUserProfile(uid) {
    try {
        const response = await fetch('/api/get-user-by-firebase-uid', {
            method: 'POST',
            body: JSON.stringify({ firebaseUid: uid }),
            headers: { 'Content-Type': 'application/json' },
        })
        const data = await response.json()
        
        if (data.user) {
            return {
                age: data.user.age || null,
                avatar: data.user.avatar || null
            }
        }
        return null
    } catch (error) {
        console.error('Error getting user profile:', error)
        return null
    }
}

export async function handleUpdateProfile(command, setGlobals) {
    try {
        const user = auth.currentUser
        if (!user) {
            throw new Error('User not authenticated')
        }

        // Update Firebase Auth display name if name is provided
        if (command.newVal.name) {
            await updateProfile(user, {
                displayName: command.newVal.name
            })
        }

        // Update MongoDB user profile
        const updateData = {
            firebaseUid: user.uid
        }
        
        if (command.newVal.name) {
            updateData.name = command.newVal.name
        }
        if (command.newVal.age !== undefined) {
            updateData.age = command.newVal.age
        }
        if (command.newVal.avatar !== undefined) {
            updateData.avatar = command.newVal.avatar
        }

        const response = await fetch('/api/update-user-profile', {
            method: 'POST',
            body: JSON.stringify(updateData),
            headers: { 'Content-Type': 'application/json' },
        })
        
        const data = await response.json()
        
        if (data.response !== 'success') {
            throw new Error('Failed to update profile in database')
        }

        // Update local state
        setGlobals(prev => {
            const newGlobals = JSON.parse(JSON.stringify(prev))
            if (newGlobals.loggedInUser) {
                if (command.newVal.name) {
                    newGlobals.loggedInUser.name = command.newVal.name
                    newGlobals.loggedInUser.displayName = command.newVal.name
                }
                if (command.newVal.age !== undefined) {
                    newGlobals.loggedInUser.age = command.newVal.age
                }
                if (command.newVal.avatar !== undefined) {
                    newGlobals.loggedInUser.avatar = command.newVal.avatar
                }
            }
            return newGlobals
        })

        return { success: true }
    } catch (error) {
        console.error('Error updating profile:', error)
        throw error
    }
}

