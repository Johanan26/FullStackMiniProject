// our-dimain.com/new-user
import NewUserForm from '../../components/users/NewUserForm'
import { useRouter } from 'next/router';
import GlobalContext from "../../pages/store/globalContext"
import { useContext } from 'react'

function NewUserPage() {
    const router = useRouter()
    const globalCtx = useContext(GlobalContext)

    async function addUserHandler(enteredUserData)  {
        await globalCtx.updateGlobals({cmd: 'addUser', newVal: enteredUserData})
        router.push('/');
    }

    return <NewUserForm onAddUser={addUserHandler} />
}

export default NewUserPage