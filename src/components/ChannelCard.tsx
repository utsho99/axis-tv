import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Heart } from 'lucide-react'
import { Channel, useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const GROUP_COLORS: Record<string, string> = {
  Bangla: '#DC143C', Sports: '#2563EB', News: '#DC143C', Movies: '#D97706',
  Entertainment: '#7C3AED', Music: '#DB2777', Kids: '#16A34A',
  Documentary: '#EA580C', Religious: '#92400E', International: '#0369A1', Other: '#6B7280',
}

interface Props {
  channel: Channel
  width?: number | string
  height?: number
  showGroup?: boolean
}

export default function ChannelCard({ channel, width = 170, height = 100, showGroup = true }: Props) {
  const { play, toggleFav, current } = useApp()
  const navigate = useNavigate()
  const [imgErr, setImgErr] = useState(false)
  const [hovered, setHovered] = useState(false)
  const isPlaying = current?.id === channel.id
  const accent = GROUP_COLORS[channel.group] || '#DC143C'
  const initials = channel.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    play(channel)
    navigate('/watch/' + channel.id)
  }

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.06, y: -4, zIndex: 20 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
      style={{
        position: 'relative', flexShrink: 0, cursor: 'pointer',
        width: typeof width === 'number' ? `${width}px` : width,
        minWidth: typeof width === 'number' ? `${width}px` : undefined,
        borderRadius: '14px', overflow: 'hidden',
        // ── THE GLASS EFFECT ──
        background: `linear-gradient(135deg, rgba(255,255,255,0.09) 0%, ${accent}14 50%, rgba(255,255,255,0.04) 100%)`,
        border: `1px solid ${hovered ? accent + '50' : 'rgba(255,255,255,0.1)'}`,
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        boxShadow: hovered
          ? `0 16px 48px rgba(0,0,0,0.7), 0 0 0 1px ${accent}40, 0 0 32px ${accent}18`
          : '0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      onClick={handlePlay}
    >
      {/* Thumbnail area */}
      <div style={{ position: 'relative', height, overflow: 'hidden' }}>

        {/* Top shimmer line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px', zIndex: 2,
          background: `linear-gradient(to right, transparent, ${accent}80, transparent)`,
        }} />

        {channel.logo && !imgErr ? (
          <img src={channel.logo} alt={channel.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={() => setImgErr(true)} loading="lazy" />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: `linear-gradient(135deg, ${accent}20 0%, rgba(8,0,10,0.9) 100%)`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px',
          }}>
            <span style={{
              fontFamily: '"Barlow", sans-serif', fontSize: '30px', fontWeight: 900,
              color: accent, textShadow: `0 0 24px ${accent}80`, letterSpacing: '-0.02em',
            }}>{initials}</span>
            <span style={{ fontSize: '9px', color: `${accent}70`, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.12em' }}>{channel.group}</span>
          </div>
        )}

        {/* Glass hover overlay */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.18 }}
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(8,0,10,0.95) 0%, rgba(8,0,10,0.4) 55%, transparent 100%)',
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '10px',
          }}>
          <div style={{ display: 'flex', gap: '7px', marginBottom: '6px' }}>
            <button onClick={handlePlay}
              style={{
                width: '32px', height: '32px', borderRadius: '50%', border: 'none',
                background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.6)',
                flexShrink: 0,
              }}>
              <Play size={13} fill="#08000a" style={{ color: '#08000a', marginLeft: '1px' }} />
            </button>
            <button onClick={e => { e.stopPropagation(); toggleFav(channel.id) }}
              style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)',
                border: `1px solid ${channel.favorite ? '#DC143C' : 'rgba(255,255,255,0.2)'}`,
                backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0,
              }}>
              <Heart size={12} fill={channel.favorite ? '#DC143C' : 'none'}
                style={{ color: channel.favorite ? '#DC143C' : 'white' }} />
            </button>
          </div>
          <p style={{ fontSize: '12px', fontWeight: 700, color: 'white',
            lineHeight: 1.2, textShadow: '0 1px 6px rgba(0,0,0,0.9)' }}>
            {channel.name}
          </p>
        </motion.div>

        {/* Live playing badge */}
        {isPlaying && (
          <div style={{
            position: 'absolute', top: '8px', right: '8px',
            display: 'flex', alignItems: 'center', gap: '4px',
            background: 'rgba(220,20,60,0.2)', border: '1px solid rgba(220,20,60,0.45)',
            borderRadius: '100px', padding: '2px 8px',
            fontSize: '9px', fontWeight: 700, color: '#ff6b7a',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 0 12px rgba(220,20,60,0.4)',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#DC143C',
              animation: 'blink 1.6s ease-in-out infinite' }} />
            LIVE
          </div>
        )}
      </div>

      {/* ── Glass label bar ── */}
      <div style={{
        padding: '9px 12px',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(220,20,60,0.04) 100%)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
      }}>
        <p style={{
          fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.88)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          marginBottom: '2px',
        }}>{channel.name}</p>
        {showGroup && (
          <p style={{ fontSize: '10px', fontWeight: 600, color: accent,
            textTransform: 'uppercase', letterSpacing: '0.08em' }}>{channel.group}</p>
        )}
      </div>

      {/* Bottom accent glow line */}
      <div style={{
        position: 'absolute', bottom: 0, left: '10%', right: '10%', height: '1px',
        background: `linear-gradient(to right, transparent, ${accent}60, transparent)`,
      }} />
    </motion.div>
  )
}
