import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Lightbox } from './About'
import './Schedule.css'

const asset = (name: string) => encodeURI(`/${name}`)

// Placeholder gallery. Layout is generated from a repeating set of "groups" (a group is one column of the gallery):
// x/w/h are in vh, y is % of the screen height, dx is the tile's offset inside its group, gap is the space after the group.
type Tile = { dx: number; y: number; w: number; h: number }
type Group = { tiles: Tile[]; width: number; gap: number }

const GROUPS: Record<string, Group> = {
  // a large tile with a smaller one above its right edge (cards 2, 10 and 18)
  pair: { tiles: [{ dx: 0, y: 44, w: 66, h: 52 }, { dx: 26, y: 0, w: 40, h: 40 }], width: 66, gap: 3 },
  tall: { tiles: [{ dx: 0, y: 12, w: 43, h: 76 }], width: 43, gap: 13 },
  bleed: { tiles: [{ dx: 0, y: 0, w: 57, h: 100 }], width: 57, gap: 3 },
  square: { tiles: [{ dx: 0, y: 17, w: 66, h: 66 }], width: 66, gap: 13 },
  narrow: { tiles: [{ dx: 0, y: 6, w: 50, h: 88 }], width: 50, gap: 5 }, // cards 6 and 14 (gap after = space left of cards 7 and 15)
  medium: { tiles: [{ dx: 0, y: 28, w: 70, h: 70 }], width: 70, gap: 5 }, // cards 7 and 15: bigger and lower (gap after = space right of them)
  wide: { tiles: [{ dx: 0, y: 0, w: 102, h: 100 }], width: 102, gap: 0 },
}

// 22 cards: pair(2) + tall + bleed + square + narrow + medium + wide = 8, twice, then pair + tall + bleed + square + wide
const SEQUENCE = [
  ...['pair', 'tall', 'bleed', 'square', 'narrow', 'medium', 'wide'],
  ...['pair', 'tall', 'bleed', 'square', 'narrow', 'medium', 'wide'],
  ...['pair', 'tall', 'bleed', 'square', 'wide'],
]

const FILES = [
  'Scroll Down (12).png',
  'Scroll Down (14).png',
  'Scroll Down (13).png',
  'about 2.png',
  'about 1.png',
  'about 3.png',
  'Scroll Down (15).png',
  'hero bg.png',
]

// Cards with their own, final image (by card number). The rest cycle through FILES as placeholders.
// `caption` is optional text laid over the bottom-left corner of the card (`scale` shrinks it for long titles).
const OWN_IMAGES: Record<number, { file: string; alt: string; caption?: { title: string; sub: string; scale?: number } }> = {
  1: {
    file: 'Untitled design (46).png',
    alt: 'Three participants working together on a laptop',
    caption: { title: 'Check In', sub: 'TBD' },
  },
  2: {
    file: 'Untitled design (47).png',
    alt: 'Three students at a podium with a laptop',
    caption: { title: 'Opening Ceremony', sub: 'TBD', scale: 0.78 }, // long title on a small card, so a bit smaller
  },
  3: {
    file: 'Untitled design (48).png',
    alt: 'Participants typing at their laptops during the hackathon',
    caption: { title: 'Hacking Time', sub: 'TBD' },
  },
  4: {
    file: 'Untitled design (49).png',
    alt: 'Participants focused on their screens in a computer lab',
    caption: { title: 'Building Begins', sub: 'TBD' },
  },
  5: {
    file: 'Untitled design (50).png',
    alt: 'A speaker raising a hand at the microphone on stage',
    caption: { title: 'Speaker Session', sub: 'TBD' },
  },
}

const GALLERY_GAP = 13 // space (vh) between the last gap-less group and the next, and before the end

const { PHOTOS, GALLERY_VH } = (() => {
  const photos: {
    num: number
    file: string
    alt: string
    caption?: { title: string; sub: string; scale?: number }
    x: number
    y: number
    w: number
    h: number
  }[] = []
  let x = -36 // the first card starts left of the gallery origin, so a sliver of it shows at the screen's right edge
  SEQUENCE.forEach((name) => {
    const group = GROUPS[name]
    group.tiles.forEach((tile) => {
      const num = photos.length + 1
      photos.push({
        num,
        file: OWN_IMAGES[num]?.file ?? FILES[(num - 1) % FILES.length],
        alt: OWN_IMAGES[num]?.alt ?? `Placeholder photo ${num}`,
        caption: OWN_IMAGES[num]?.caption,
        x: x + tile.dx,
        y: tile.y,
        w: tile.w,
        h: tile.h,
      })
    })
    x += group.width + (name === 'wide' ? GALLERY_GAP : group.gap)
  })
  // the gallery's last card should end flush with the screen's right edge
  return { PHOTOS: photos, GALLERY_VH: x - GALLERY_GAP }
})()

// The schedule is not announced yet: its cards are kept in the code but not shown, and "TBA" is written instead
const HIDE_SCHEDULE_CARDS = true

const TBA_LEN = 28 // vw of scroll after the intro while "TBA" is shown (its box is 20vw wide, so it stops at 72-92vw: near the right edge, beside the intro text)
const TBA_LEAD = '-2vw' // gap between the intro text and the word

const SMOOTHING = 0.12 // 0-1: how quickly the gallery catches up with the scroll position
const SPEED = 1.5 // sideways pixels moved per pixel of vertical scroll (1 = same speed; higher = shorter scroll)

// Contact variant: four cards instead of photos (details are placeholders until the real ones are known)
const CONTACTS = [
  { kind: 'call', title: 'Call us', detail: '+91 00000 00000', action: 'Call now' },
  { kind: 'mail', title: 'Mail us', detail: 'team@example.com', action: 'Send a mail' },
  { kind: 'discord', title: 'Discord', detail: 'discord.gg/your-invite', action: 'Join the server' },
]
const CONTACT_W = 52 // card size in vh
const CONTACT_H = 64
const CONTACT_GAP = 8
const CONTACT_START = -20 // the first card starts left of the gallery origin so a sliver shows at the right edge
const CONTACT_END_PAD = 10 // space (vh) left to the right of the last card at the end of the scroll
const CONTACT_GALLERY_VH =
  CONTACT_START + CONTACTS.length * CONTACT_W + (CONTACTS.length - 1) * CONTACT_GAP + CONTACT_END_PAD

// Text around the gallery for each use of this section
const COPY = {
  schedule: {
    script: 'Schedule',
    title: ['THE FULL', 'SCHEDULE'],
    subtitle: 'TWO DAYS, ONE CAMPUS, ENDLESS IDEAS.',
    body: 'The full schedule for Diversion 2K27, from the opening ceremony and hacking hours to mentor rounds, demos and the closing ceremony, will be announced soon. Stay tuned.',
    brand: ['VISIT', 'DIVERSION'],
    photo: { file: 'Untitled design (45).png', alt: 'Metcalfe Hall in Kolkata' },
    backTo: 'visit-3', // the organizers card, which comes just before the schedule
  },
  contact: {
    script: 'Say Hello',
    title: ['GET IN', 'TOUCH'],
    subtitle: 'WE WOULD LOVE TO HEAR FROM YOU.',
    body: 'Questions, ideas or want to partner with us? Reach out through any of the channels that follow and the team will get back to you.',
    brand: ['CONTACT', 'DIVERSION'],
    photo: { file: 'c247c6c7a3efe66c120e71b882d64d370317c7ba-1920x1080.jpg', alt: 'Say hello' },
    backTo: 'about-4', // the partners section, which comes just before the contact section
  },
}

// The logos in the middle of the contact cards, in their own colours (a phone, Gmail and Discord)
const LOGOS: Record<string, { color: string; path: string }> = {
  call: {
    color: '#34c759',
    path: 'M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z',
  },
  mail: {
    color: '#ea4335',
    path: 'M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z',
  },
  discord: {
    color: '#5865f2',
    path: 'M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z',
  },
}

function ContactIcon({ kind }: { kind: string }) {
  const logo = LOGOS[kind]
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill={logo.color} aria-hidden>
      <path d={logo.path} />
    </svg>
  )
}

interface ScheduleProps {
  id?: string
  variant?: 'schedule' | 'contact'
}

export default function Schedule({ id = 'schedule', variant = 'schedule' }: ScheduleProps) {
  const contact = variant === 'contact'
  const copy = COPY[variant]
  const galleryVh = contact ? CONTACT_GALLERY_VH : GALLERY_VH
  const tba = !contact && HIDE_SCHEDULE_CARDS
  // length of the gallery: normally set by its cards; with "TBA" it is just the word's box, sized so it ends up centred
  const galleryLen = tba ? `(${TBA_LEN}vw)` : `(${galleryVh} * var(--u))`
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)

  // Vertical scroll through the tall section slides the track sideways (1px of scroll = 1px of travel)
  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const movers = track.querySelectorAll<HTMLElement>('.schedule__intro, .schedule__photo, .schedule__contact, .schedule__tba')
    let current: number | null = null
    let frame = 0

    const tick = () => {
      const range = section.offsetHeight - window.innerHeight
      const target = Math.min(range, Math.max(0, -section.getBoundingClientRect().top))
      current = current === null ? target : current + (target - current) * SMOOTHING
      // Move each piece on its own instead of one very wide track: a single layer that wide can exceed the
      // browser's maximum texture size, and everything past that point stops being drawn
      const shift = `translate3d(${-current * SPEED}px, 0, 0)`
      movers.forEach((el) => (el.style.transform = shift))
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  const goBack = () => document.getElementById(copy.backTo)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`schedule${contact ? ' schedule--contact' : ''}`}
      style={{ ...(tba ? ({ '--lead': TBA_LEAD } as CSSProperties) : {}), height: `calc(100vh + (var(--lead) + ${galleryLen}) / ${SPEED})` }}
    >
      <div className="schedule__stage">
        <button className="schedule__back" type="button" onClick={goBack}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path d="M15 9H3M8.5 3.5L3 9l5.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>

        <div ref={trackRef} className="schedule__track" style={{ width: `calc(100vw + var(--lead) + ${galleryLen})` }}>
          <div className="schedule__intro">
            <figure className="schedule__card">
              <img src={asset(copy.photo.file)} alt={copy.photo.alt} />
              <p className="schedule__script">{copy.script}</p>
              <div className="schedule__brand">
                <span>{copy.brand[0]}</span>
                <span>{copy.brand[1]}</span>
              </div>
            </figure>

            <div className="schedule__text">
              <h2>
                {copy.title[0]}
                <br />
                {copy.title[1]}
              </h2>
              <h3>{copy.subtitle}</h3>
              <p>{copy.body}</p>
            </div>
          </div>

          <div className="schedule__gallery">
            {tba && <span className="schedule__tba">TBA</span>}
            {contact
              ? CONTACTS.map((c, i) => (
                  <div
                    key={c.kind}
                    className="schedule__contact"
                    style={
                      {
                        '--x': CONTACT_START + i * (CONTACT_W + CONTACT_GAP),
                        '--y': 18,
                        '--w': CONTACT_W,
                        '--h': CONTACT_H,
                      } as CSSProperties
                    }
                  >
                    <span className="schedule__num" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="schedule__contact-icon">
                      <ContactIcon kind={c.kind} />
                    </div>
                    <h4>{c.title}</h4>
                    <div className="schedule__contact-row">
                      <button type="button">{c.action}</button>
                      <p>{c.detail}</p>
                    </div>
                  </div>
                ))
              : (tba ? [] : PHOTOS).map((p) => (
                  <div
                    key={p.file}
                    className="schedule__photo"
                    style={{ '--x': p.x, '--y': p.y, '--w': p.w, '--h': p.h } as CSSProperties}
                    onClick={() => setLightbox({ src: asset(p.file), alt: p.alt })}
                  >
                    <img src={asset(p.file)} alt={p.alt} />
                    <span className="schedule__num" aria-hidden="true">
                      {String(p.num).padStart(2, '0')}
                    </span>
                    {p.caption && (
                      <div className="schedule__caption" style={{ '--cap': p.caption.scale ?? 1 } as CSSProperties}>
                        <strong>{p.caption.title}</strong>
                        <span>{p.caption.sub}</span>
                      </div>
                    )}
                    <button className="schedule__open" type="button" aria-label={`Open photo: ${p.alt}`}>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                        <path
                          d="M10.5 2H16v5.5M7.5 16H2v-5.5M16 2l-5.5 5.5M2 16l5.5-5.5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
          </div>
        </div>
      </div>

      {lightbox && <Lightbox {...lightbox} onClose={() => setLightbox(null)} />}
    </section>
  )
}
