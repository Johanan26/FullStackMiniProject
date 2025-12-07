import { useContext } from 'react';
import { useRouter } from 'next/router';
import GlobalContext from '../../pages/store/globalContext';
import classes from './PostDetail.module.css'

function PostDetail(props) {
    const globalCtx = useContext(GlobalContext);
    const router = useRouter();
    const loggedInUser = globalCtx.theGlobalObject.loggedInUser;

    // Double-check ownership here as well - handle string conversion
    const postUserId = props.userId?.toString() || props.userId;
    const userUid = loggedInUser?.uid?.toString() || loggedInUser?.uid;
    
    // Primary check: userId match
    let isOwnPost = props.isOwnPost || 
        (loggedInUser && postUserId && userUid && postUserId === userUid);
    
    // Fallback check: if userId is null but authorName matches, consider it owned
    if (!isOwnPost && loggedInUser && !postUserId && props.authorName) {
        const userDisplayName = loggedInUser.displayName || loggedInUser.name || loggedInUser.email?.split('@')[0];
        isOwnPost = props.authorName === userDisplayName;
    }

    async function handleDelete() {
        if (!confirm('Are you sure you want to delete this post?')) return;

        const id = props.postId;
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

        await globalCtx.updateGlobals({
            cmd: 'deletePost',
            newVal: {
                ...(isObjectId ? { _id: id } : { postId: id }),
                userId: loggedInUser?.uid || null
            },
        });

        alert('Post deleted!');
        router.push('/posts');
    }

    function handleEdit() {
        router.push('/posts/edit/' + props.postId);
    }

    return (
        <section className={classes.detail}>
            {props.authorName && (
                <div className={classes.authorInfo}>
                    <span className={classes.authorName}>@{props.authorName}</span>
                </div>
            )}
            {props.image && (
                <div className={classes.imageContainer}>
                    <img src={props.image} alt={props.title} />
                </div>
            )}
            <div className={classes.content}>
                <h1>{props.title}</h1>
                {props.address && <address>{props.address}</address>}
                {props.description && <p>{props.description}</p>}
            </div>
            {/* Show buttons if user owns the post */}
            {isOwnPost ? (
                <div className={classes.actions}>
                    <button onClick={handleEdit} className={classes.editButton}>
                        Edit Post
                    </button>
                    <button onClick={handleDelete} className={classes.deleteButton}>
                        Delete Post
                    </button>
                </div>
            ) : null}
        </section>
    )
}

export default PostDetail