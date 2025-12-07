export async function handleAddPost(command, setGlobals) {
    const response = await fetch('/api/new-post', {
        method: 'POST',
        body: JSON.stringify(command.newVal),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    
    const data = await response.json()
    
    // Reload posts from the database to get the complete post data including _id
    const postsResponse = await fetch('/api/get-posts', {
        method: 'POST',
        body: JSON.stringify({ posts: 'all' }),
        headers: { 'Content-Type': 'application/json' },
    })
    const postsData = await postsResponse.json()
    
    setGlobals((previousGlobals) => {
        const newGlobals = JSON.parse(JSON.stringify(previousGlobals))
        newGlobals.posts = postsData.posts || []
        return newGlobals
    })
    
    return { success: true, data }
}

export async function handleUpdatePost(command, setGlobals) {
    const response = await fetch('/api/update-post', {
        method: 'POST',
        body: JSON.stringify(command.newVal),
        headers: { 'Content-Type': 'application/json' },
    })

    const data = await response.json()
    
    if (data.response === 'success') {
        setGlobals(prev => {
            const newGlobals = JSON.parse(JSON.stringify(prev))
            const index = newGlobals.posts.findIndex(p => p._id === command.newVal._id)
            if (index > -1) {
                newGlobals.posts[index] = command.newVal
            }
            return newGlobals
        })
    }
    
    return { success: data.response === 'success', data }
}

export async function handleDeletePost(command, setGlobals) {
    const deletePayload = { 
        _id: command.newVal._id,
        userId: command.newVal.userId || null
    }
    
    const response = await fetch('/api/delete-post', {
        method: 'POST',
        body: JSON.stringify(deletePayload),
        headers: { 'Content-Type': 'application/json' },
    })

    const data = await response.json()
    
    if (data.response === 'success') {
        setGlobals(prev => {
            const newGlobals = JSON.parse(JSON.stringify(prev))
            newGlobals.posts = newGlobals.posts.filter(p => p._id !== command.newVal._id)
            return newGlobals
        })
    }
    
    return { success: data.response === 'success', data }
}

