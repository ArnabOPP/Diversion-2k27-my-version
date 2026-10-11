import './Hero.css'

const asset = (name: string) => encodeURI(`/${name}`)

export default function Hero() {
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

        <div className="hero__scroll">
          <span>Scroll Down</span>
        </div>
      </div>
    </section>
  )
}
