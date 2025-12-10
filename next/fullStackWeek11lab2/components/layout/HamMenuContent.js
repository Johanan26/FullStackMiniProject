import classes from './HamMenuContent.module.css'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import GlobalContext from "../../pages/store/globalContext"

export default function HamMenuContent(props) {
    const globalCtx = useContext(GlobalContext)
    const router = useRouter()

    if (globalCtx.theGlobalObject.hideHamMenu) {
        return null
    }

    async function handleItemClick(item) {
        globalCtx.updateGlobals({ cmd: 'hideHamMenu', newVal: true })
        
        if (item.cmd === 'logout') {
            try {
                await globalCtx.updateGlobals({ cmd: 'logout' })
                router.push('/')
            } catch (error) {
                console.error('Error logging out:', error)
            }
        } else if (item.webAddress) {
            router.push(item.webAddress)
        }
    }

    function closeMe() {
        globalCtx.updateGlobals({ cmd: 'hideHamMenu', newVal: true })
    }

    let contentJsx = props.contents.map((item, index) => (
        <div className={classes.menuItem} key={index} onClick={() => handleItemClick(item)} >{item.title} </div>
    ))

    return (
        <div className={classes.background} onClick={() => closeMe()} >
            <div className={classes.mainContent} >
                {contentJsx}
            </div>
        </div>
    );
}
