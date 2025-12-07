import PostDetail from '../../components/posts/PostDetail'
import { useRouter } from 'next/router'
import GlobalContext from "../store/globalContext"
import { useContext } from 'react'

export default function () {
    const globalCtx = useContext(GlobalContext)
    const router = useRouter();
    const { postId } = router.query;

    if (!globalCtx.theGlobalObject.dataLoaded) {
        return <div style={{ color: '#e0e0e0', padding: '2rem', textAlign: 'center' }}>Loading...</div>
    }

    if (!postId) {
        return <div style={{ color: '#e0e0e0', padding: '2rem', textAlign: 'center' }}>No post ID provided</div>
    }

    // Find post by _id (MongoDB ObjectId) or postId
    const foundPost = globalCtx.theGlobalObject.posts.find(post => {
        // Check if postId matches _id (MongoDB ObjectId)
        if (post._id === postId) return true;
        // Check if postId matches postId field
        if (post.postId && post.postId.trim() === postId.trim()) return true;
        return false;
    });

    if (!foundPost) {
        return (
            <div style={{ color: '#e0e0e0', padding: '2rem', textAlign: 'center' }}>
                <h1>Post not found</h1>
                <p>The post you're looking for doesn't exist.</p>
            </div>
        )
    }

    const loggedInUser = globalCtx.theGlobalObject.loggedInUser;
    
    // Check ownership - compare userId with logged in user's uid
    // Handle both string and direct comparison
    const postUserId = foundPost.userId?.toString() || foundPost.userId;
    const userUid = loggedInUser?.uid?.toString() || loggedInUser?.uid;
    
    // Primary check: userId match
    let isOwnPost = loggedInUser && postUserId && userUid && postUserId === userUid;
    
    // Fallback check: if userId is null but authorName matches, consider it owned
    // This handles posts created before userId was added
    if (!isOwnPost && loggedInUser && !postUserId && foundPost.authorName) {
        const userDisplayName = loggedInUser.displayName || loggedInUser.name || loggedInUser.email?.split('@')[0];
        isOwnPost = foundPost.authorName === userDisplayName;
    }

    return (
        <PostDetail 
            image={foundPost.image} 
            title={foundPost.title} 
            description={foundPost.description}
            address={foundPost.address}
            authorName={foundPost.authorName}
            postId={foundPost._id || foundPost.postId}
            userId={foundPost.userId}
            isOwnPost={isOwnPost}
        />
    )
}
