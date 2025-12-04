import Card from '../ui/Card';
import { useContext} from 'react'
import classes from './PostItem.module.css';
import { useRouter } from 'next/router';
import GlobalContext from '../../pages/store/globalContext';

function PostItem(props) {
  const globalCtx = useContext(GlobalContext)
  const router = useRouter()
  const user = globalCtx.theGlobalObject.isLoggedIn

  function showDetailsHandler() {
    router.push('/' + props.id);
  }

  function editDetailsHandler() {
    router.push('/posts/edit/' + props.id);
  }

  async function deleteDetailsHandler() {
    if (!confirm('Are you sure you want to delete this post?')) return;

    await globalCtx.updateGlobals({cmd: 'deletePost',newVal: { _id: props.id },});
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
          <button onClick={editDetailsHandler} disabled={!user} className={!user ? classes.disabled : ''}>Edit Details </button>
          <button onClick={deleteDetailsHandler} disabled={!user} className={!user ? classes.disabled : ''}>Delete Post</button>
        </div>
      </Card>
    </li>
  );
}

export default PostItem;
