import { useContext, useEffect, useRef, useState } from 'react'
import GlobalContext from './store/globalContext'
import styles from '../styles/Home.module.css'
import dynamic from 'next/dynamic'

// Import InteractiveCircle dynamically (client-side only)
const InteractiveCircle = dynamic(() => import('../components/InteractiveCircle'), { ssr: false })

function HomePage() {
  const globalCtx = useContext(GlobalContext)
  const user = globalCtx.theGlobalObject.loggedInUser
  const sectionRefs = useRef([])
  const [visibleSections, setVisibleSections] = useState([])

  // Fade-in animation for sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleSections((prev) => {
          const updated = [...prev]
          entries.forEach((entry) => {
            const index = Number(entry.target.getAttribute('data-index'))
            updated[index] = entry.isIntersecting
          })
          return updated
        })
      },
      { threshold: 0.2 }
    )

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  const sections = [
    {
      title: 'About This Project',
      text: 'The Post Portal is a full-stack Next.js application where users can create, view, edit and delete posts using a clean dashboard and reusable components.',
    },
    {
      title: 'Key Features',
      text: '• Login & signup with global state\n• Animated dashboard tiles\n• Create, view, and manage posts\n• Responsive design with animated accents.',
    },
    {
      title: 'How It Works',
      text: 'All data (users and posts) flows through a global context and API routes into a MongoDB backend. The UI is built with reusable Card components and smooth transitions.',
    },
  ]

  return (
    <div className={styles.fullWidthWrapper}>
      {/* === HERO SECTION === */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Welcome to the Post Portal</h1>
          <p className={styles.subtitle}>
            Create, view, and manage your posts in one place.
          </p>

          {/* === Interactive RGB Circle === */}
          <InteractiveCircle />
          <div className={styles.ctaRow}>
            {!user ? (
              <>
                <a href="/login" className={styles.primaryBtn}>Login</a>
                <a href="/new-user" className={styles.secondaryBtn}>Sign up</a>
              </>
            ) : (
              <a href="/dashboard" className={styles.primaryBtn}>
                Go to your dashboard
              </a>
            )}
          </div>
        </div>
      </div>

      {/* === SCROLL SECTIONS === */}
      <div className={styles.sectionsContainer}>
        {sections.map((section, index) => (
          <div
            key={index}
            data-index={index}
            ref={(el) => (sectionRefs.current[index] = el)}
            className={`${styles.section} ${
              visibleSections[index] ? styles.sectionVisible : ''
            }`}
          >
            <h2 className={styles.sectionTitle}>{section.title}</h2>
            {section.text.split('\n').map((line, i) => (
              <p key={i} className={styles.sectionText}>
                {line}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default HomePage
