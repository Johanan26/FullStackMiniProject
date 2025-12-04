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

  useEffect(() => {
    if (!postId || !globalCtx.theGlobalObject.dataLoaded) return;

    const foundPost = globalCtx.theGlobalObject.posts.find((p) => p.postId === postId);
    if (foundPost) setLoadedPost(foundPost);
  }, [postId, globalCtx.theGlobalObject]);

  async function updatePostHandler(updatedPost) {
    await globalCtx.updateGlobals({ cmd: 'updatePost', newVal: updatedPost });
    router.push('/posts');
  }

  if (!loadedPost) {
    return <p style={{ textAlign: 'center' }}>Loading post...</p>;
  }

  return <NewPostForm onAddPost={updatePostHandler} initialData={loadedPost} />;
}

export default EditPostPage;
