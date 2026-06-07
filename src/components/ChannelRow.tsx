import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Channel } from '../context/AppContext'
import ChannelCard from './ChannelCard'

interface Props {
  title: string
  channels: Channel[]
  cardWidth?: number
  cardHeight?: number
  label?: string
}

export default function ChannelRow({ title, channels, cardWidth=180, cardHeight=100, label }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const scroll = (dir: number) => {
    if (ref.current) ref.current.scrollBy({ left: dir * 600, behavior: 'smooth' })
  }

  if (!channels.length) return null

  return (
    <div className="mb-8 group/row">
      {/* Row header */}
      <div className="flex items-center gap-3 mb-3 px-4 md:px-[4%]">
        {label && (
          <span style={{
            fontFamily: '"Barlow",sans-serif', fontSize: '10px', fontWeight: 700,
            color: '#DC143C', textTransform: 'uppercase', letterSpacing: '0.14em',
            background: 'rgba(220,20,60,0.12)', border: '1px solid rgba(220,20,60,0.28)',
            padding: '2px 10px', borderRadius: '100px',
            boxShadow: '0 0 12px rgba(220,20,60,0.2)',
          }}>{label}</span>
        )}
        <h2 style={{ fontFamily: '"Barlow",sans-serif', fontSize: '20px', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
          {title}
        </h2>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.28)', marginLeft: '4px' }}>
          {channels.length} channels
        </span>
      </div>

      {/* Scroll area */}
      <div className="relative">
        <button onClick={() => scroll(-1)}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover/row:opacity-100 transition-opacity"
          style={{ width: '40px', height: '100%', background: 'rgba(10,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
          <ChevronLeft size={22} color="white" />
        </button>

        <div ref={ref} className="row-scroll px-4 md:px-[4%]" style={{ gap: '8px' }}>
          {channels.map(ch => (
            <ChannelCard key={ch.id} channel={ch} width={cardWidth} height={cardHeight} />
          ))}
        </div>

        <button onClick={() => scroll(1)}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover/row:opacity-100 transition-opacity"
          style={{ width: '40px', height: '100%', background: 'rgba(10,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
          <ChevronRight size={22} color="white" />
        </button>
      </div>
    </div>
  )
}
