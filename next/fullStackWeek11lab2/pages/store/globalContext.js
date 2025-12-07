import { createContext, useState, useEffect } from 'react'
import { auth } from '../../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { executeCommand, getUserProfile } from './commands'

const GlobalContext = createContext()

export function GlobalContextProvider(props) {
    const [globals, setGlobals] = useState({ hideHamMenu: true, posts: [], users: [], dataLoaded: false, isLoggedIn: false, loggedInUser: null })

    useEffect(() => {
        checkMongoConnection()
        initData()
        
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const profileData = await getUserProfile(user.uid)
                
                setGlobals(prev => {
                    const newGlobals = JSON.parse(JSON.stringify(prev))
                    newGlobals.loggedInUser = {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName || user.email?.split('@')[0] || 'User',
                        name: user.displayName || user.email?.split('@')[0] || 'User',
                        avatar: profileData?.avatar || null,
                        age: profileData?.age || null
                    }
                    newGlobals.isLoggedIn = true
                    return newGlobals
                })
            } else {
                // User is signed out
                setGlobals(prev => {
                    const newGlobals = JSON.parse(JSON.stringify(prev))
                    newGlobals.loggedInUser = null
                    newGlobals.isLoggedIn = false
                    return newGlobals
                })
            }
        })

        return () => unsubscribe()
    }, [])

    async function checkMongoConnection() {
        try {
            const response = await fetch('/api/health-check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            })
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }
            
            const data = await response.json()
            
            if (data.connected) {
                console.log('MongoDB connection verified:', data.message)
            } else {
                console.warn('MongoDB connection issue:', data.message)
            }
        } catch (error) {
            console.error('Failed to check MongoDB connection:', error)
        }
    }

    async function initData() {
        const postsResponse = await fetch('/api/get-posts', {
            method: 'POST',
            body: JSON.stringify({ posts: 'all' }),
            headers: { 'Content-Type': 'application/json' },
        })
        const postsData = await postsResponse.json()

        const usersResponse = await fetch('/api/get-user', {
            method: 'POST',
            body: JSON.stringify({ cmd: 'all' }),
            headers: { 'Content-Type': 'application/json' },
        })
        const usersData = await usersResponse.json()

        setGlobals(prev => {
            const newGlobals = JSON.parse(JSON.stringify(prev))
            newGlobals.posts = postsData.posts || []
            newGlobals.users = usersData.users || []
            newGlobals.dataLoaded = true
            return newGlobals
        })
    }

    /**
     * Execute a command by routing it to the appropriate handler
     * @param {Object} command - { cmd: string, newVal: any }
     * @returns {Promise<Object>} Result of the command execution
     */
    async function editGlobalData(command) {
        return await executeCommand(command, setGlobals)
    }

    const context = {
        updateGlobals: editGlobalData,
        theGlobalObject: globals
    }

    return <GlobalContext.Provider value={context}>
        {props.children}
    </GlobalContext.Provider>
}


export default GlobalContext
