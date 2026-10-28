import { useEffect, useState } from 'react'
import About from '@/components/About'
import Coming from '@/components/Coming'
import Faq from '@/components/Faq'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Partners from '@/components/Partners'
import Prizes from '@/components/Prizes'
import Schedule from '@/components/Schedule'
import ScrubVideo from '@/components/ScrubVideo'
import Visit from '@/components/Visit'
import ScrollVideo from '@/components/ScrollVideo'
import Start from '@/components/Start'

const START_HOLD_MS = 5000
const FADE_MS = 2000

type Screen = 'start' | 'startOut' | 'hero'

// After each timed screen: how long it stays, then which screen follows
const NEXT: Partial<Record<Screen, [number, Screen]>> = {
  start: [START_HOLD_MS, 'startOut'],
  startOut: [FADE_MS, 'hero'],
}

// Dev shortcut: /?screen=hero jumps straight to a screen
const startScreen = (): Screen => {
  const requested = import.meta.env.DEV && new URLSearchParams(location.search).get('screen')
  return requested && ['hero'].includes(requested) ? (requested as Screen) : 'start'
}

export default function App() {
  const [screen, setScreen] = useState<Screen>(startScreen)

  useEffect(() => {
    const step = NEXT[screen]
    if (!step) return
    const id = setTimeout(() => setScreen(step[1]), step[0])
    return () => clearTimeout(id)
  }, [screen])

  // The incoming screen starts scaled up, which would add scrollbars mid-transition; lock scrolling until it ends
  useEffect(() => {
    if (screen !== 'startOut') return
    document.documentElement.classList.add('no-scroll')
    const id = setTimeout(() => document.documentElement.classList.remove('no-scroll'), FADE_MS)
    return () => {
      clearTimeout(id)
      document.documentElement.classList.remove('no-scroll')
    }
  }, [screen])

  // Hero stays mounted (hidden) behind the start page so its images are loaded before the transition
  const isStart = screen === 'start'
  return (
    <>
      <div className={isStart ? 'hero-wait' : 'zoom-in'}>
        <ScrollVideo>
          <Hero />
        </ScrollVideo>
        {/* 2 About */}
        <About />
        <ScrubVideo src="/video%203%20scrub.mp4" />
        {/* 3 Venue */}
        <About id="about-2" last />
        {/* 4 Hacker's guide */}
        <Visit id="visit-2" content="schedule" videoNext />
        <ScrubVideo src="/video%209%20scrub.mp4" />
        {/* 5 Achievements */}
        <About id="about-3" last content="hall" />
        <div className="video-gap video-gap--dark" aria-hidden="true" />
        <ScrubVideo src="/video%208%20scrub.mp4" />
        {/* 6 Prizes */}
        <Prizes />
        {/* 7 Organizers */}
        <Visit id="visit-3" content="team" videoNext />
        <ScrubVideo src="/video%2015%20scrub.mp4" />
        {/* 8 Schedule */}
        <Schedule />
        {/* 9 Community partners */}
        <div className="video-gap" aria-hidden="true" />
        <ScrubVideo src="/video%2012%20scrub.mp4" />
        <Partners id="about-4" />
        {/* 10 Contact */}
        <Schedule id="contact" variant="contact" />
        <div className="video-gap" aria-hidden="true" />
        <ScrubVideo src="/video%2013%20scrub.mp4" />
        {/* 11 FAQ */}
        <Faq id="faq" />
        <div className="video-gap video-gap--dark" aria-hidden="true" />
        <ScrubVideo src="/video%2014%20scrub.mp4" />
        {/* 12 Closing screen and footer */}
        <Coming />
        <Header />
      </div>
      {isStart ? (
        <Start />
      ) : screen === 'startOut' ? (
        <div className="zoom-out">
          <Start />
        </div>
      ) : null}
    </>
  )
}
