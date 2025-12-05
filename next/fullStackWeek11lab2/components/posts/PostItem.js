import Card from '../ui/Card';
import { useContext } from 'react';
import classes from './PostItem.module.css';
import { useRouter } from 'next/router';
import GlobalContext from '../../pages/store/globalContext';

function PostItem(props) {
  const globalCtx = useContext(GlobalContext);
  const router = useRouter();
  const user = globalCtx.theGlobalObject.isLoggedIn;

  function showDetailsHandler() {
    router.push('/' + props.id);
  }

  function editDetailsHandler() {
    router.push('/posts/edit/' + props.id);
  }

  async function deleteDetailsHandler() {
    if (!confirm('Are you sure you want to delete this post?')) return;

    // 🪵 Debug info
    console.log('🪵 PostItem Debug Info:');
    console.log('props.id:', props.id);
    console.log('props.postId:', props.postId);
    console.log('props._id:', props._id);

    // ✅ Detect if the ID looks like a valid MongoDB ObjectId (24 hex characters)
    const id = props.id;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

    // 🪵 Show which field we're using for deletion
    console.log('Deleting post using', isObjectId ? '_id' : 'postId', '→', id);

    // ✅ Send correct field to backend via global context
    await globalCtx.updateGlobals({
      cmd: 'deletePost',
      newVal: isObjectId ? { _id: id } : { postId: id },
    });

    alert('Post deleted!');
  }

  return (
    <li className={classes.item}>
      <Card>
        <div className={classes.image}>
          <img src={props.image} alt={props.title} />
        </div>
        <div className={classes.content}>
          <h3>{props.title}</h3>
          <address>{props.address}</address>
        </div>
        <div className={classes.actions}>
          <button onClick={showDetailsHandler}>Show Details</button>
          <button
            onClick={editDetailsHandler}
            disabled={!user}
            className={!user ? classes.disabled : ''}
          >
            Edit Details
          </button>
          <button
            onClick={deleteDetailsHandler}
            disabled={!user}
            className={!user ? classes.disabled : ''}
          >
            Delete Post
          </button>
        </div>
      </Card>
    </li>
  );
}

export default PostItem;
