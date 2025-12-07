// pages/posts.js
import { useContext } from 'react'
import GlobalContext from './store/globalContext'
import PostList from '../components/posts/PostList'
import SimplePostCreator from '../components/posts/SimplePostCreator'
import classes from '../styles/Posts.module.css'

function PostsPage() {
  const globalCtx = useContext(GlobalContext)

  async function addPostHandler(enteredPostData) {
    await globalCtx.updateGlobals({cmd: 'addPost', newVal: enteredPostData})
    // Posts will be refreshed automatically in handleAddPost
  }

  if (!globalCtx.theGlobalObject.dataLoaded) {
    return <div style={{ color: '#e0e0e0', padding: '2rem' }}>Loading data from database, please wait . . . </div>
  }

  return (
    <div className={classes.postsPage}>
      <div className={classes.postsContainer}>
        {/* Simplified post creation at the top */}
        {globalCtx.theGlobalObject.isLoggedIn && (
          <div className={classes.newPostSection}>
            <SimplePostCreator onAddPost={addPostHandler} />
          </div>
        )}
        
        {/* Posts feed below */}
        <div className={classes.postsFeed}>
          {globalCtx.theGlobalObject.posts.length > 0 && (
            <h2 className={classes.sectionTitle}>All Posts</h2>
          )}
          <PostList posts={globalCtx.theGlobalObject.posts} />
        </div>
      </div>
    </div>
  )
}

export default PostsPage
