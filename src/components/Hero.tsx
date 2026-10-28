import { useEffect } from 'react'
import './Hero.css'

// Devfolio hackathon slug (the part before .devfolio.co in the hackathon's page address)
const DEVFOLIO_SLUG = 'diversion2k27'
const DEVFOLIO_URL = `https://${DEVFOLIO_SLUG}.devfolio.co`

// Devfolio's embedded button only draws itself on websites Devfolio has approved (elsewhere its data request is
// blocked and the button stays a blank white box). Until this site is approved, our own button links to the same page.
// Set this to true to use the official embed instead.
const USE_DEVFOLIO_EMBED = false

const asset = (name: string) => encodeURI(`/${name}`)

export default function Hero() {
  // Devfolio's script turns the .apply-button element below into the "Apply with Devfolio" button.
  // It is added once and left in place: adding and removing it again (as React's dev double-mount does) makes the
  // script run twice and the button sometimes stay blank
  useEffect(() => {
    if (!USE_DEVFOLIO_EMBED) return
    const src = 'https://apply.devfolio.co/v2/sdk.js'
    if (document.querySelector(`script[src="${src}"]`)) return
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.defer = true
    document.body.appendChild(script)
  }, [])

  return (
    <section className="hero">
      <img className="hero__bg" src={asset('hero bg.png')} alt="" />

      <div className="hero__content">
        <h1 className="hero__text" aria-label="Kolkata. Get ready for Diversion">
          <span className="hero__line hero__line--kolkata">KOLKATA</span>
          <span className="hero__line hero__line--ready">GET READY FOR</span>
          <span className="hero__line hero__line--diversion">DIVERSION</span>
        </h1>

        <img className="hero__chars" src={asset('boygirl.png')} alt="" />

        <p className="hero__coming">
          <span className="hero__coming-top">DATES</span>
          <span className="hero__coming-sub">6-7 MARCH 2027</span>
        </p>

        <p className="hero__coming hero__coming--venue">
          <span className="hero__coming-top">VENUE</span>
          <span className="hero__coming-sub">IEM GURUKUL CAMPUS</span>
        </p>

        <div className="hero__apply">
          {USE_DEVFOLIO_EMBED ? (
            <div
              className="apply-button"
              data-hackathon-slug={DEVFOLIO_SLUG}
              data-button-theme="dark"
              style={{ height: '44px', width: '312px' }}
            />
          ) : (
            <a className="hero__apply-link" href={DEVFOLIO_URL} target="_blank" rel="noopener noreferrer">
              {/* Devfolio's logo, as used in their own button */}
              <svg width="20" height="21" viewBox="0 0 115.46 123.46" fill="#fff" aria-hidden="true">
                <path d="M115.46 68a55.43 55.43 0 0 1-50.85 55.11S28.12 124 16 123a12.6 12.6 0 0 1-10.09-7.5 15.85 15.85 0 0 0 5.36 1.5c4 .34 10.72.51 20.13.51 13.82 0 28.84-.38 29-.38h.26a60.14 60.14 0 0 0 54.72-52.47c.05 1.05.08 2.18.08 3.34z" />
                <path d="M110.93 55.87A55.43 55.43 0 0 1 60.08 111s-36.48.92-48.58-.12C5 110.29.15 104.22 0 97.52l.2-83.84C.38 7 5.26.94 11.76.41c12.11-1 48.59.12 48.59.12a55.41 55.41 0 0 1 50.58 55.34z" />
              </svg>
              Apply with Devfolio
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
