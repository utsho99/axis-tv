import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Info, Heart, ChevronRight, Flame, Zap, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import ChannelCard from '../components/ChannelCard'
import ChannelRow from '../components/ChannelRow'

const GROUP_COLORS: Record<string, string> = {
  Bangla: '#DC143C', Sports: '#2563EB', News: '#DC143C', Movies: '#D97706',
  Entertainment: '#7C3AED', Music: '#DB2777', Kids: '#16A34A',
  Documentary: '#EA580C', Religious: '#92400E', International: '#0369A1',
}

const GROUP_ICONS: Record<string, typeof Flame> = {
  Sports: Zap, News: Flame, Movies: Star,
}

export default function HomePage() {
  const { channels, play, toggleFav } = useApp()
  const navigate = useNavigate()
  const [heroIdx, setHeroIdx] = useState(0)

  const groups = [...new Set(channels.map(c => c.group))].filter(g => g !== 'Imported')
  const byGroup = (g: string) => channels.filter(c => c.group === g)
  const heroChannels = channels.filter(c => c.logo && c.group !== 'Imported').slice(0, 8)
  const hero = heroChannels[heroIdx]

  useEffect(() => {
    if (!heroChannels.length) return
    const t = setInterval(() => setHeroIdx(i => (i + 1) % heroChannels.length), 7000)
    return () => clearInterval(t)
  }, [heroChannels.length])

  const accent = hero ? (GROUP_COLORS[hero.group] || '#DC143C') : '#DC143C'

  return (
    <div style={{ minHeight: '100vh', background: '#08000a' }}>

      {/* ══ HERO SECTION ══ */}
      <div style={{ position: 'relative', height: '88vh', minHeight: '520px', overflow: 'hidden' }}>

        {/* Blurred bg image */}
        <AnimatePresence mode="wait">
          {hero && (
            <motion.div key={hero.id} className="absolute inset-0"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 1.0 }}>
              <img src={hero.logo} alt=""
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                  objectFit: 'cover', filter: 'blur(80px) saturate(1.8) brightness(0.25)', transform: 'scale(1.1)' }}
                onError={e => { e.currentTarget.style.display = 'none' }} />
              {/* Accent color flood */}
              <div style={{ position: 'absolute', inset: 0,
                background: `radial-gradient(ellipse 80% 60% at 60% 30%, ${accent}22 0%, transparent 70%)` }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gradient overlays */}
        <div style={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(8,0,10,0.97) 0%, rgba(8,0,10,0.7) 38%, rgba(8,0,10,0.15) 70%, transparent 100%)' }} />
        <div style={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, #08000a 0%, transparent 40%)' }} />
        <div style={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(8,0,10,0.5) 0%, transparent 20%)' }} />

        {/* Hero content */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-end', padding: 'clamp(20px,4%,60px)', paddingBottom: 'clamp(40px,6%,80px)' }}>
          <AnimatePresence mode="wait">
            {hero && (
              <motion.div key={hero.id + 'txt'}
                initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                style={{ maxWidth: '580px' }}>

                {/* Category + Live badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '11px', fontWeight: 800, textTransform: 'uppercase',
                    letterSpacing: '0.2em', color: accent,
                    textShadow: `0 0 24px ${accent}`,
                  }}>◆ {hero.group}</span>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    background: 'rgba(220,20,60,0.18)', border: '1px solid rgba(220,20,60,0.4)',
                    borderRadius: '100px', padding: '3px 10px', fontSize: '10px', fontWeight: 700,
                    color: '#ff6b7a', letterSpacing: '0.08em',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 0 16px rgba(220,20,60,0.3)',
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#DC143C',
                      animation: 'blink 1.6s ease-in-out infinite', flexShrink: 0 }} />
                    LIVE NOW
                  </span>
                </div>

                {/* Title */}
                <h1 style={{
                  fontFamily: '"Barlow", sans-serif', fontWeight: 900, lineHeight: 0.9,
                  fontSize: 'clamp(2.4rem, 6vw, 5rem)', letterSpacing: '-0.02em',
                  color: 'white', marginBottom: '14px',
                  textShadow: '0 4px 32px rgba(0,0,0,0.8)',
                }}>{hero.name}</h1>

                <p style={{ fontSize: 'clamp(13px,1.8vw,16px)', color: 'rgba(255,255,255,0.5)',
                  lineHeight: 1.65, marginBottom: '28px', maxWidth: '420px' }}>
                  Streaming live — crystal clear, zero buffering. Tap play to watch instantly.
                </p>

                {/* CTA buttons */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <button onClick={() => { play(hero); navigate('/watch/' + hero.id) }}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      background: 'white', color: '#08000a',
                      fontWeight: 800, fontSize: 'clamp(14px,2vw,16px)',
                      padding: 'clamp(10px,2vw,13px) clamp(20px,3vw,28px)',
                      borderRadius: '100px', border: 'none', cursor: 'pointer',
                      boxShadow: '0 4px 24px rgba(255,255,255,0.2)',
                      transition: 'transform 0.15s, box-shadow 0.15s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}>
                    <Play size={16} fill="#08000a" /> Play
                  </button>
                  <button onClick={() => navigate('/watch/' + hero.id)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                      color: 'rgba(255,255,255,0.85)', fontWeight: 600,
                      fontSize: 'clamp(13px,2vw,15px)',
                      padding: 'clamp(10px,2vw,13px) clamp(18px,3vw,24px)',
                      borderRadius: '100px', cursor: 'pointer',
                    }}>
                    <Info size={15} /> More Info
                  </button>
                  <button onClick={() => toggleFav(hero.id)}
                    style={{
                      width: '44px', height: '44px', borderRadius: '50%',
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.14)',
                      backdropFilter: 'blur(12px)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer',
                    }}>
                    <Heart size={17} fill={hero.favorite ? '#DC143C' : 'none'}
                      style={{ color: hero.favorite ? '#DC143C' : 'white' }} />
                  </button>
                </div>

                {/* Dots */}
                <div style={{ display: 'flex', gap: '6px', marginTop: '28px', alignItems: 'center' }}>
                  {heroChannels.map((_, i) => (
                    <button key={i} onClick={() => setHeroIdx(i)} style={{
                      height: '3px', borderRadius: '2px', border: 'none',
                      cursor: 'pointer', transition: 'all 0.35s',
                      width: i === heroIdx ? '28px' : '8px',
                      background: i === heroIdx ? '#DC143C' : 'rgba(255,255,255,0.2)',
                      boxShadow: i === heroIdx ? '0 0 10px rgba(220,20,60,0.7)' : 'none',
                    }} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hero thumbnail — right side, desktop only */}
        {hero && (
          <div className="hidden lg:block" style={{
            position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)',
            width: '340px',
          }}>
            <motion.div key={hero.id + 'thumb'}
              initial={{ opacity: 0, x: 40, rotateY: -8 }} animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{
                borderRadius: '20px', overflow: 'hidden',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)',
                boxShadow: `0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px ${accent}30, 0 0 60px ${accent}15`,
              }}>
              <img src={hero.logo} alt={hero.name}
                style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
                onError={e => { e.currentTarget.style.display = 'none' }} />
              <div style={{ padding: '16px 18px',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(220,20,60,0.06) 100%)' }}>
                <p style={{ fontFamily: '"Barlow",sans-serif', fontWeight: 800, fontSize: '16px', color: 'white', marginBottom: '4px' }}>
                  {hero.name}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', color: accent, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {hero.group}
                  </span>
                  <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>Live</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* ══ GLASSY CONTENT AREA ══ */}
      <div style={{ marginTop: '-48px', position: 'relative', zIndex: 10, padding: '0 clamp(12px,4%,48px)' }}>

        {groups.map((group, gi) => {
          const chs = byGroup(group)
          if (!chs.length) return null
          const color = GROUP_COLORS[group] || '#DC143C'
          const Icon = GROUP_ICONS[group] || null
          const isHot = group === 'Sports' || group === 'News'

          return (
            <motion.div key={group}
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: gi * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ marginBottom: '32px' }}>

              {/* ── Section glass header ── */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '14px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '14px', padding: '12px 18px',
                backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 1px ${color}12`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* Color dot */}
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%', background: color,
                    boxShadow: `0 0 10px ${color}`,
                    animation: isHot ? 'blink 2s ease-in-out infinite' : 'none',
                  }} />
                  <span style={{
                    fontFamily: '"Barlow", sans-serif', fontSize: 'clamp(16px,2.5vw,22px)',
                    fontWeight: 800, color: 'white', letterSpacing: '-0.01em',
                  }}>{group}</span>
                  {isHot && (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      background: `${color}18`, border: `1px solid ${color}35`,
                      borderRadius: '100px', padding: '2px 9px',
                      fontSize: '9px', fontWeight: 800, color,
                      textTransform: 'uppercase', letterSpacing: '0.14em',
                      boxShadow: `0 0 12px ${color}20`,
                    }}>
                      {Icon && <Icon size={9} />}
                      {group === 'Sports' ? 'LIVE SPORT' : 'BREAKING'}
                    </span>
                  )}
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', fontWeight: 400 }}>
                    {chs.length}
                  </span>
                </div>
                <button onClick={() => navigate('/browse/' + group)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    fontSize: '12px', fontWeight: 600, color: color,
                    background: `${color}10`, border: `1px solid ${color}25`,
                    borderRadius: '100px', padding: '5px 12px', cursor: 'pointer',
                    backdropFilter: 'blur(8px)',
                  }}>
                  See all <ChevronRight size={13} />
                </button>
              </div>

              {/* ── Glassy channel cards scroll ── */}
              <div style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '18px', padding: '16px',
                backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${color}08`,
              }}>
                <div style={{
                  display: 'flex', gap: '10px', overflowX: 'auto',
                  paddingBottom: '4px', scrollbarWidth: 'none',
                }}>
                  {chs.map(ch => (
                    <ChannelCard key={ch.id} channel={ch} width={170} height={100} />
                  ))}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div style={{ height: '40px' }} />
    </div>
  )
}
