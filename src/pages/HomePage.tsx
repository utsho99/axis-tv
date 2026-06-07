import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Info, Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import ChannelRow from '../components/ChannelRow'

const GROUP_COLORS: Record<string,string> = {
  Bangla:'#DC143C', Sports:'#2563EB', News:'#DC143C', Movies:'#D97706',
  Entertainment:'#7C3AED', Music:'#DB2777', Kids:'#16A34A', Documentary:'#EA580C',
  Religious:'#92400E', International:'#0369A1',
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
    const t = setInterval(() => setHeroIdx(i => (i+1) % heroChannels.length), 7000)
    return () => clearInterval(t)
  }, [heroChannels.length])

  return (
    <div style={{ paddingTop: '0' }}>
      {/* ── HERO ── */}
      <div className="relative overflow-hidden" style={{ height: '92vh', minHeight: '560px' }}>

        {/* Background */}
        <AnimatePresence mode="wait">
          {hero && (
            <motion.div key={hero.id}
              initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute inset-0">
              <div className="absolute inset-0 overflow-hidden">
                <img src={hero.logo} alt="" className="w-full h-full object-cover scale-110"
                  style={{ filter: 'blur(60px) brightness(0.28) saturate(1.6)' }}
                  onError={e => { e.currentTarget.style.display = 'none' }} />
              </div>
              {/* Crimson tint overlay */}
              <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 70% 40%, rgba(220,20,60,0.18) 0%, transparent 65%)' }} />
              <div className="absolute inset-0 hero-grad" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(10,0,0,0.95) 0%, rgba(10,0,0,0.65) 40%, transparent 75%)' }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scanlines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.012]"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,1) 3px,rgba(255,255,255,1) 4px)' }} />

        {/* Hero content */}
        <div className="absolute inset-0 flex flex-col justify-end pb-20 px-[4%]">
          <AnimatePresence mode="wait">
            {hero && (
              <motion.div key={hero.id + '-text'}
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.16,1,0.3,1] }}>

                <div className="flex items-center gap-3 mb-5">
                  <span style={{
                    fontFamily: '"Barlow",sans-serif', fontSize: '12px', fontWeight: 700,
                    color: GROUP_COLORS[hero.group] || '#DC143C',
                    textTransform: 'uppercase', letterSpacing: '0.18em',
                    textShadow: `0 0 20px ${GROUP_COLORS[hero.group] || '#DC143C'}`,
                  }}>◆ {hero.group}</span>
                  <span className="live-pill"><span className="live-dot" />LIVE NOW</span>
                </div>

                <h1 className="title-hero mb-4" style={{ maxWidth: '600px' }}>{hero.name}</h1>

                <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.55)', maxWidth: '460px', lineHeight: 1.6, marginBottom: '28px' }}>
                  Watch {hero.name} live. Crystal clear stream, zero buffering. Add to favorites for instant access.
                </p>

                <div className="flex items-center gap-3 flex-wrap">
                  <button onClick={() => { play(hero); navigate('/watch/' + hero.id) }}
                    className="btn-play text-base" style={{ padding: '12px 30px', fontSize: '16px' }}>
                    <Play size={18} fill="#0a0000" /> Play
                  </button>
                  <button onClick={() => navigate('/watch/' + hero.id)} className="btn-info" style={{ padding: '12px 22px', fontSize: '15px' }}>
                    <Info size={17} /> More Info
                  </button>
                  <button onClick={() => toggleFav(hero.id)} className="icon-btn" style={{ width: '46px', height: '46px' }}>
                    <Heart size={18} fill={hero.favorite ? '#DC143C' : 'none'} style={{ color: hero.favorite ? '#DC143C' : 'white' }} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hero dots */}
          <div className="flex gap-2 mt-8">
            {heroChannels.map((_, i) => (
              <button key={i} onClick={() => setHeroIdx(i)} style={{
                height: '3px', borderRadius: '2px', transition: 'all 0.4s',
                width: i === heroIdx ? '28px' : '10px',
                background: i === heroIdx ? '#DC143C' : 'rgba(255,255,255,0.15)',
                cursor: 'pointer',
                boxShadow: i === heroIdx ? '0 0 8px rgba(220,20,60,0.6)' : 'none',
              }} />
            ))}
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32"
          style={{ background: 'linear-gradient(to top, #0a0000 0%, transparent 100%)' }} />
      </div>

      {/* ── CONTENT ROWS ── */}
      <div style={{ marginTop: '-60px', position: 'relative', zIndex: 10 }}>
        {groups.map(group => (
          <ChannelRow
            key={group} title={group} channels={byGroup(group)}
            label={group === 'Sports' ? 'LIVE SPORT' : group === 'News' ? 'BREAKING' : undefined}
            cardWidth={190} cardHeight={107}
          />
        ))}
      </div>
    </div>
  )
}
