// pages/posts.js
import { useContext } from 'react'
import GlobalContext from './store/globalContext'
import PostList from '../components/posts/PostList'

function PostsPage() {
  const globalCtx = useContext(GlobalContext)

  if (!globalCtx.theGlobalObject.dataLoaded) {
    return <div>Loading data from database, please wait . . . </div>
  }

  return <PostList posts={globalCtx.theGlobalObject.posts} />
}

export default PostsPage
