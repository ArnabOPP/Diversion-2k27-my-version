import { useEffect, useState } from 'react'
import Menu from './Menu'
import './Header.css'

const asset = (name: string) => encodeURI(`/${name}`)

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  // The IEM / UEM / ACM logos belong to the hero only: they fade out as it scrolls away (and back in on return)
  useEffect(() => {
    const update = () => {
      const fade = 1 - Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.5)))
      document.documentElement.style.setProperty('--hero-fade', String(fade))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <>
      <img className={`site-header__logo${menuOpen ? ' is-hidden' : ''}`} src={asset('diversion logo.png')} alt="Diversion 2K27" />

      <div className={`site-header__partners${menuOpen ? ' is-hidden' : ''}`}>
        <img src={asset('iem-logo.png')} alt="IEM" />
        <img src={asset('uem-logo.png')} alt="UEM" />
      </div>

      <img className={`site-header__acm${menuOpen ? ' is-hidden' : ''}`} src={asset('acm-logo.png')} alt="ACM" />

      <button className={`site-header__menu${menuOpen ? ' is-hidden' : ''}`} type="button" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
        <span />
        <span />
      </button>

      <Menu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
