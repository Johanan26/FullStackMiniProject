import PostDetail from '../../components/posts/PostDetail'
import { useRouter } from 'next/router'
import GlobalContext from "../store/globalContext"
import { useContext } from 'react'

export default function () {
    const globalCtx = useContext(GlobalContext)
    const router = useRouter();

    // Back to basics, a simple for loop. Also trim() comes into play as it usually does!
    let returnVal = null
    for (let ii = 0; ii < globalCtx.theGlobalObject.posts.length; ii++) {
        let temp = globalCtx.theGlobalObject.posts[ii]
        if (temp.postId.trim() == router.query.postId.trim()) {
            returnVal = <PostDetail image={temp.image} title={temp.title} description={temp.description} />
        }
    }
    // In the real world, we'd put the code above in the store context module. 
    return returnVal
}
