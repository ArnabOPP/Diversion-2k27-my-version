import { useState } from 'react'
import './About.css' // shares the section background and the heading styles
import './Prizes.css'

const RUPEE = '₹'

// The podium: first place stands tallest in the middle (the order on screen is set in Prizes.css)
const PODIUM = [
  { place: 'first', rank: '1ST', title: 'Grand Winner', amount: `${RUPEE}25,000` },
  { place: 'second', rank: '2ND', title: 'First Runner-up', amount: `${RUPEE}15,000` },
  { place: 'third', rank: '3RD', title: 'Second Runner-up', amount: `${RUPEE}10,000` },
]

// Light, base and dark shades of each metal, used to shade the trophy
const METALS: Record<string, [string, string, string]> = {
  first: ['#fff1b8', '#f3c969', '#b8871f'],
  second: ['#ffffff', '#cfd3de', '#8b92a3'],
  third: ['#f6c9a0', '#e0a070', '#9a5a2b'],
}

// Trophy images go in public/ with these names. Until a file exists, the drawn trophy below is shown instead.
const TROPHY_IMAGES: Record<string, string> = {
  first: '/trophy-gold.png',
  second: '/trophy-silver.png',
  third: '/trophy-bronze.png',
}

function Trophy({ place }: { place: string }) {
  const [missing, setMissing] = useState(false)
  if (!missing) {
    return (
      <img
        className="prizes__trophy prizes__trophy--image"
        src={TROPHY_IMAGES[place]}
        alt={`${place} place trophy`}
        onError={() => setMissing(true)}
      />
    )
  }
  return <TrophyDrawing place={place} />
}

// A simple trophy cup, drawn in SVG and shaded in the metal of its place (the fallback)
function TrophyDrawing({ place }: { place: string }) {
  const [light, base, dark] = METALS[place]
  const body = `trophy-body-${place}`
  const foot = `trophy-foot-${place}`
  return (
    <svg className="prizes__trophy" viewBox="0 0 100 112" role="img" aria-label={`${place} place trophy`}>
      <defs>
        <linearGradient id={body} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={light} />
          <stop offset="0.5" stopColor={base} />
          <stop offset="1" stopColor={dark} />
        </linearGradient>
        <linearGradient id={foot} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={base} />
          <stop offset="1" stopColor={dark} />
        </linearGradient>
      </defs>
      {/* handles */}
      <path d="M27 18H13c0 17 6 27 19 30" fill="none" stroke={`url(#${body})`} strokeWidth="6" strokeLinecap="round" />
      <path d="M73 18h14c0 17-6 27-19 30" fill="none" stroke={`url(#${body})`} strokeWidth="6" strokeLinecap="round" />
      {/* cup */}
      <path d="M26 8h48v30c0 19-10 31-24 31S26 57 26 38z" fill={`url(#${body})`} />
      {/* shine and star */}
      <path d="M33 14v24c0 11 4 19 9 24-8-4-13-13-13-26V14z" fill={light} opacity="0.55" />
      <path d="M50 24l3.5 7.2 7.9 1.1-5.7 5.6 1.4 7.9L50 42l-7.1 3.8 1.4-7.9-5.7-5.6 7.9-1.1z" fill={dark} opacity="0.55" />
      {/* stem and base */}
      <rect x="43" y="68" width="14" height="16" fill={`url(#${foot})`} />
      <rect x="30" y="84" width="40" height="8" rx="2" fill={`url(#${foot})`} />
      <rect x="23" y="92" width="54" height="12" rx="3" fill={`url(#${foot})`} />
    </svg>
  )
}

interface PrizesProps {
  id?: string
}

export default function Prizes({ id = 'prizes' }: PrizesProps) {
  return (
    <section id={id} className="about about--last prizes">
      <div className="prizes__inner">
        {/* the "WIN PRIZES" lock-up and blurb from the earlier prizes card (its styles live in Visit.css) */}
        <header className="visit__header prizes__header">
          <div className="visit__logo" aria-label="Win Prizes">
            <span className="visit__logo-visit">WIN</span>
            <span className="visit__logo-name">PRIZES</span>
            <img src="/Scroll%20Down%20(18).png" alt="" aria-hidden="true" />
          </div>
          <p className="visit__blurb">Rewards, goodies and swag for the teams that build the boldest ideas.</p>
        </header>

        <ul className="prizes__podium">
          {PODIUM.map((p) => (
            <li key={p.place} className={`prizes__card prizes__card--${p.place}`}>
              <Trophy place={p.place} />
              <span className="prizes__rank">{p.rank}</span>
              <span className="prizes__title">{p.title}</span>
              <span className="prizes__amount">{p.amount}</span>
            </li>
          ))}
        </ul>

        <div className="prizes__tracks">
          <div>
            <span className="prizes__tracks-label">TRACK WINNERS</span>
            <p>Every track has its own winner, and every track winner takes home a prize.</p>
          </div>
          <span className="prizes__tracks-amount">Prizes to be announced</span>
        </div>
      </div>
    </section>
  )
}
