import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Heart, Tv2 } from 'lucide-react'
import { Channel, useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const GROUP_COLORS: Record<string,string> = {
  Bangla:'#E50914', Sports:'#0071EB', News:'#B91C1C', Movies:'#CA8A04',
  Entertainment:'#7C3AED', Music:'#BE185D', Kids:'#15803D', Documentary:'#C2410C',
  Religious:'#92400E', International:'#0369A1', Other:'#4B5563',
}

interface Props {
  channel: Channel
  width?: number | string
  height?: number
  showGroup?: boolean
}

export default function ChannelCard({ channel, width = 190, height = 107, showGroup = true }: Props) {
  const { play, toggleFav, current } = useApp()
  const navigate = useNavigate()
  const [imgErr, setImgErr] = useState(false)
  const isPlaying = current?.id === channel.id
  const accent = GROUP_COLORS[channel.group] || '#E50914'

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    play(channel)
    navigate('/watch/' + channel.id)
  }

  const initials = channel.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <motion.div
      className="channel-card"
      style={{ width: width === undefined ? '100%' : width, minWidth: typeof width === 'number' ? width : undefined, flexShrink: 0 }}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      transition={{ duration: 0.22, ease: [0.2,0,0,1] }}
    >
      {/* Thumbnail */}
      <div className="relative flex items-center justify-center overflow-hidden"
        style={{ height, background: `linear-gradient(135deg, ${accent}22 0%, #1a1a1a 100%)` }}>

        {channel.logo && !imgErr ? (
          <img
            src={channel.logo} alt={channel.name}
            className="w-full h-full object-cover"
            onError={() => setImgErr(true)}
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-1 w-full h-full"
            style={{ background: `linear-gradient(135deg, ${accent}25, #111)` }}>
            <span style={{
              fontFamily: '"Barlow", sans-serif',
              fontSize: '28px', fontWeight: 900,
              color: accent, textShadow: `0 0 20px ${accent}60`,
              letterSpacing: '-0.02em'
            }}>{initials}</span>
            <span style={{ fontSize: '9px', color: `${accent}80`, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{channel.group}</span>
          </div>
        )}

        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: accent }} />

        {/* Playing badge */}
        {isPlaying && (
          <div className="absolute top-2 right-2 live-pill" style={{ fontSize: '10px', padding: '2px 7px', gap: '4px' }}>
            <span className="live-dot" style={{ width: '5px', height: '5px' }} />LIVE
          </div>
        )}

        {/* Hover overlay */}
        <div className="card-overlay">
          <div className="flex items-center gap-2 mb-2">
            <button onClick={handlePlay}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
              style={{ background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>
              <Play size={14} fill="#141414" style={{ color: '#141414', marginLeft: '1px' }} />
            </button>
            <button
              onClick={e => { e.stopPropagation(); toggleFav(channel.id) }}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: 'rgba(30,30,30,0.9)', border: `2px solid ${channel.favorite ? '#E50914' : 'rgba(255,255,255,0.4)'}` }}>
              <Heart size={13} fill={channel.favorite ? '#E50914' : 'none'} style={{ color: channel.favorite ? '#E50914' : 'white' }} />
            </button>
          </div>
          <p style={{ fontSize: '12px', fontWeight: 700, color: 'white', lineHeight: 1.2, textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}>
            {channel.name}
          </p>
          {showGroup && (
            <p style={{ fontSize: '10px', color: accent, marginTop: '2px', fontWeight: 600 }}>{channel.group}</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
