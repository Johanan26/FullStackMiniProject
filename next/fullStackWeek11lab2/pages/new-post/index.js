// our-dimain.com/new-Post
import NewPostForm from '../../components/posts/NewPostForm'
import { useRouter } from 'next/router';
import GlobalContext from "../store/globalContext"
import { useContext } from 'react'

function NewPostPage() {
    const router = useRouter()
    const globalCtx = useContext(GlobalContext)

    async function addPostHandler(enteredPostData)  {
        await globalCtx.updateGlobals({cmd: 'addPost', newVal: enteredPostData})
        router.push('/posts');
    }

    return <NewPostForm onAddPost={addPostHandler} />
}

export default NewPostPage