import classes from './MainNavigation.module.css'
import Link from 'next/link'
import HamMenu from "../generic/HamMenu"
import { useContext } from 'react'
import GlobalContext from "../../pages/store/globalContext"
import HamMenuContent from "./HamMenuContent"
import { useRouter } from 'next/router'

function MainNavigation() {
  const globalCtx = useContext(GlobalContext)
  const user = globalCtx.theGlobalObject.isLoggedIn
  const loggedInUser = globalCtx.theGlobalObject.loggedInUser
  const count = globalCtx.theGlobalObject.posts.length

  function toggleMenuHide() {
    globalCtx.updateGlobals({ cmd: 'hideHamMenu', newVal: false })
  }

  // const contents = []
  // globalCtx.theGlobalObject.meetings.forEach(element => {
  //   contents.push({title: element.title, webAddress: '/' + element.meetingId })
  // });

  const contents = []
  if (user && loggedInUser) {
    contents.push({ title: `Account: ${loggedInUser.name || loggedInUser.email || 'User'}` })
    contents.push({ title: 'Profile', webAddress: '/profile' })
    contents.push({ title: 'Logout', cmd: 'logout' })
  } else {
    contents.push({ title: 'Login', webAddress: '/login' })
    contents.push({ title: 'Sign up', webAddress: '/new-user' })
  }

  return (
    <header className={classes.header}>
      <HamMenuContent contents={contents} />

      <div className={classes.leftNav}>
        <Link href="/" className={classes.logo}>
          Home
        </Link>
      </div>
      <div className={classes.rightGroup}>
        <nav className={classes.nav}>
          <ul>
            {user ? (
              <>
                <li><Link href="/posts">{`Posts (${count})`}</Link></li>
                <li><span className={classes.userName}>Logged In </span></li>
                <li><Link href="/dashboard">Dashboard</Link></li>
              </>
            ) : (
              <>
                <li><Link href="/posts">Posts</Link></li>
                <li><Link href="/login">Login</Link></li>
                <li><Link href="/dashboard">Dashboard</Link></li>
              </>
            )}
          </ul>
        </nav>

        <div className={classes.hamburger}>
          <HamMenu toggleMenuHide={toggleMenuHide} user={user} loggedInUser={loggedInUser} />
        </div>
      </div>
    </header>
  );
}

export default MainNavigation
