// components/InteractiveCircle.js
import { motion, useAnimation } from 'framer-motion'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'

export default function InteractiveCircle() {
  const controls = useAnimation()

  // Track window height so the circle knows where to stop
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => setScreenHeight(window.innerHeight)
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <motion.div
    className={styles.pulseCircle}
    drag
    dragMomentum
    dragConstraints={{
        top: -window.innerHeight/2+1,
        left: -window.innerWidth/2,
        right: window.innerWidth/2-135, 
        bottom: window.innerHeight/2-135,
    }}
    whileTap={{ scale: 1.1 }}
    animate={controls}
    />
  )
}
