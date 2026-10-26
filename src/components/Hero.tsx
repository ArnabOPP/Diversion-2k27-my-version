import { useEffect } from 'react'
import './Hero.css'

// Devfolio hackathon slug (the part after .devfolio.co/ in the hackathon's page address) - replace with the real one
const DEVFOLIO_SLUG = 'diversion-2k27'

const asset = (name: string) => encodeURI(`/${name}`)

export default function Hero() {
  // Devfolio's script turns the .apply-button element below into the "Apply with Devfolio" button
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://apply.devfolio.co/v2/sdk.js'
    script.async = true
    script.defer = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
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
          <span className="hero__coming-top">COMING</span>
          <span className="hero__coming-sub">SOON TO KOLKATA</span>
        </p>

        <p className="hero__coming hero__coming--venue">
          <span className="hero__coming-top">VENUE</span>
          <span className="hero__coming-sub">IEM GURUKUL CAMPUS</span>
        </p>

        <div className="hero__apply">
          <div
            className="apply-button"
            data-hackathon-slug={DEVFOLIO_SLUG}
            data-button-theme="dark"
            style={{ height: '44px', width: '312px' }}
          />
        </div>
      </div>
    </section>
  )
}
