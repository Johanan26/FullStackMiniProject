import Card from '../ui/Card';
import { useContext } from 'react';
import classes from './PostItem.module.css';
import { useRouter } from 'next/router';
import GlobalContext from '../../pages/store/globalContext';

function PostItem(props) {
  const globalCtx = useContext(GlobalContext);
  const router = useRouter();
  const isLoggedIn = globalCtx.theGlobalObject.isLoggedIn;
  const loggedInUser = globalCtx.theGlobalObject.loggedInUser;
  
  // Check if this post belongs to the logged-in user
  const isOwnPost = isLoggedIn && loggedInUser && props.userId === loggedInUser.uid;

  function showDetailsHandler(e) {
    // Don't navigate if clicking on action buttons
    if (e.target.closest('button')) {
      return;
    }
    router.push('/' + props.id);
  }

  function editDetailsHandler(e) {
    e.stopPropagation();
    router.push('/posts/edit/' + props.id);
  }

  async function deleteDetailsHandler(e) {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this post?')) return;

    // ✅ Detect if the ID looks like a valid MongoDB ObjectId (24 hex characters)
    const id = props.id;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

    // ✅ Send correct field to backend via global context with userId for ownership verification
    await globalCtx.updateGlobals({
      cmd: 'deletePost',
      newVal: {
        ...(isObjectId ? { _id: id } : { postId: id }),
        userId: loggedInUser?.uid || null
      },
    });

    alert('Post deleted!');
  }

  return (
    <li className={classes.item}>
      <Card noWrapper onClick={showDetailsHandler}>
        {/* Author at the top */}
        {props.authorName && (
          <div className={classes.authorInfo}>
            <span className={classes.authorName}>@{props.authorName}</span>
          </div>
        )}
        <div className={classes.image}>
          <img src={props.image} alt={props.title} />
        </div>
        <div className={classes.content}>
          <h3>{props.title}</h3>
          <address>{props.address}</address>
        </div>
        <div className={classes.actions} onClick={(e) => e.stopPropagation()}>
          {isOwnPost && (
            <>
              <button onClick={editDetailsHandler}>
                Edit
              </button>
              <button onClick={deleteDetailsHandler}>
                Delete
              </button>
            </>
          )}
        </div>
      </Card>
    </li>
  );
}

export default PostItem;
