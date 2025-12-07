import classes from "./HamMenu.module.css"
import { IoIosMenu } from 'react-icons/io';

export default function HamMenu(props) {
  const { user, loggedInUser } = props

  // Show profile picture if user is logged in and has an avatar
  if (user && loggedInUser && loggedInUser.avatar) {
    return (
      <div className={classes.profileButton} onClick={() => props.toggleMenuHide()}>
        <img 
          src={loggedInUser.avatar} 
          alt="Profile" 
          className={classes.profileImage}
          onError={(e) => {
            // Fallback to icon if image fails to load
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'flex'
          }}
        />
        <div className={classes.profilePlaceholder} style={{ display: 'none' }}>
          <IoIosMenu />
        </div>
      </div>
    )
  }

  // Show profile picture with initials if user is logged in but no avatar
  if (user && loggedInUser) {
    const initials = (loggedInUser.name || loggedInUser.email || 'U').charAt(0).toUpperCase()
    return (
      <div className={classes.profileButton} onClick={() => props.toggleMenuHide()}>
        <div className={classes.profileInitials}>
          {initials}
        </div>
      </div>
    )
  }

  // Show hamburger icon if not logged in
  return (
    <div className={classes.mainDiv} onClick={() => props.toggleMenuHide()}>
      <span className={classes.mainSpan}><IoIosMenu /></span>
    </div>
  )
}
