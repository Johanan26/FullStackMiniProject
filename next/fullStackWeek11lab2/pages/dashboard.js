import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import GlobalContext from './store/globalContext'
import DashboardCard from '../components/ui/DashboardCard'
import styles from '../styles/Dashboard.module.css'

function DashboardPage() {
  const globalCtx = useContext(GlobalContext)
  const router = useRouter()
  const user = globalCtx.theGlobalObject.isLoggedIn

  useEffect(() => {
  }, [user, router])

  function goCreate() {
    if(!user) return;
    router.push('/new-post')
  }

  function goViewAll() {
    router.push('/posts')
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <DashboardCard>
          <div className={user ? styles.tile: styles.disabledTile} onClick={goCreate}>
            <h2>Create Post</h2>
            <p>Create a brand new post.</p>
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className={styles.tile} onClick={goViewAll}>
            <h2>View All Posts</h2>
            <p>See all posts in the system.</p>
          </div>
        </DashboardCard>
      </div>
    </div>
  )
}

export default DashboardPage
