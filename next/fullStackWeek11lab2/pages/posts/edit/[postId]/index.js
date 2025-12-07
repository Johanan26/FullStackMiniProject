// /pages/posts/edit/[postId].js
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import GlobalContext from '../../../store/globalContext';
import NewPostForm from '../../../../components/posts/NewPostForm';

function EditPostPage() {
  const router = useRouter();
  const { postId } = router.query;
  const globalCtx = useContext(GlobalContext);
  const [loadedPost, setLoadedPost] = useState(null);
  const loggedInUser = globalCtx.theGlobalObject.loggedInUser;

  useEffect(() => {
    if (!postId || !globalCtx.theGlobalObject.dataLoaded) return;

    // Try to find by _id first, then by postId
    const foundPost = globalCtx.theGlobalObject.posts.find(
      (p) => p._id === postId || p.postId === postId
    );
    
    if (foundPost) {
      // Check ownership
      if (foundPost.userId && loggedInUser && foundPost.userId !== loggedInUser.uid) {
        alert('You can only edit your own posts!');
        router.push('/posts');
        return;
      }
      setLoadedPost(foundPost);
    }
  }, [postId, globalCtx.theGlobalObject, loggedInUser, router]);

  async function updatePostHandler(updatedPost) {
    // Preserve userId and authorName when updating
    const updatedPostWithUser = {
      ...updatedPost,
      userId: loadedPost?.userId || loggedInUser?.uid || null,
      authorName: loadedPost?.authorName || loggedInUser?.displayName || loggedInUser?.name || 'Anonymous',
    };
    
    await globalCtx.updateGlobals({ cmd: 'updatePost', newVal: updatedPostWithUser });
    router.push('/posts');
  }

  if (!globalCtx.theGlobalObject.dataLoaded) {
    return <p style={{ textAlign: 'center' }}>Loading...</p>;
  }

  if (!loadedPost) {
    return <p style={{ textAlign: 'center' }}>Post not found or you don't have permission to edit it.</p>;
  }

  return <NewPostForm onAddPost={updatePostHandler} initialData={loadedPost} />;
}

export default EditPostPage;
