import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Share2, ChevronRight, Tv2, Clock, ArrowLeft } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Player from '../components/Player'
import ChannelCard from '../components/ChannelCard'

const GROUP_COLORS: Record<string,string> = {
  Bangla:'#E50914', Sports:'#0071EB', News:'#B91C1C', Movies:'#CA8A04',
  Entertainment:'#7C3AED', Music:'#BE185D', Kids:'#15803D', Documentary:'#C2410C',
  Religious:'#92400E', International:'#0369A1', Other:'#6B7280'
}

export default function WatchPage() {
  const { id } = useParams()
  const { channels, current, play, recent, toggleFav } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    if (id) { const ch = channels.find(c => c.id === id); if (ch) play(ch) }
    else if (!current && channels.length) play(channels[0])
  }, [id, channels.length])

  const ch = current || channels[0]
  if (!ch) return (
    <div className="flex items-center justify-center h-screen">
      <p style={{color:'rgba(255,255,255,0.4)'}}>Loading channels…</p>
    </div>
  )

  const accent  = GROUP_COLORS[ch.group] || '#E50914'
  const related = channels.filter(c => c.id !== ch.id && c.group === ch.group).slice(0, 12)
  const isFav   = ch.favorite

  return (
    <div style={{minHeight:'100vh', background:'#0A0A0A'}}>
      {/* Dynamic color accent at top */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{background:accent, zIndex:200}}/>

      {/* Ambient backdrop */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background:`radial-gradient(ellipse 70% 50% at 50% 0%, ${accent}18 0%, transparent 55%)`,
        zIndex:0
      }}/>

      <div className="relative" style={{zIndex:1}}>
        {/* Top bar */}
        <div className="flex items-center gap-4 px-6 py-4" style={{paddingTop:'80px'}}>
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-2 transition-colors"
            style={{color:'rgba(255,255,255,0.5)', fontSize:'14px', fontWeight:500}}
            onMouseEnter={e=>(e.currentTarget.style.color='white')}
            onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,0.5)')}>
            <ArrowLeft size={18}/> Back
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-0">
          {/* ── PLAYER COLUMN ── */}
          <div className="flex-1 min-w-0">
            {/* Player */}
            <div style={{background:'black', maxHeight:'65vh', aspectRatio:'16/9', position:'relative'}}>
              <Player url={ch.url} name={ch.name} className="w-full h-full" key={ch.id}/>
            </div>

            {/* Channel info below player */}
            <div className="px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Group + live */}
                  <div className="flex items-center gap-3 mb-3">
                    <span style={{
                      fontFamily:'"Barlow",sans-serif', fontSize:'11px', fontWeight:700,
                      color: accent, textTransform:'uppercase', letterSpacing:'0.14em',
                      background:`${accent}18`, border:`1px solid ${accent}30`,
                      padding:'3px 10px', borderRadius:'3px'
                    }}>{ch.group}</span>
                    <span className="live-pill"><span className="live-dot"/>LIVE</span>
                  </div>

                  <h1 style={{fontFamily:'"Barlow",sans-serif', fontSize:'clamp(1.8rem,4vw,3rem)',
                    fontWeight:900, color:'white', lineHeight:1.0, letterSpacing:'-0.01em', marginBottom:'8px'}}>
                    {ch.name}
                  </h1>

                  <p style={{fontSize:'13px', color:'rgba(255,255,255,0.35)', fontFamily:'"DM Mono",monospace',
                    overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'500px'}}>
                    {ch.url}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 mt-1">
                  <button onClick={() => toggleFav(ch.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded transition-all"
                    style={isFav
                      ? {background:'rgba(229,9,20,0.15)', border:'1px solid rgba(229,9,20,0.3)', color:'#E50914', fontSize:'13px', fontWeight:600}
                      : {background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', color:'rgba(255,255,255,0.7)', fontSize:'13px', fontWeight:500}}>
                    <Heart size={14} fill={isFav?'currentColor':'none'}/>{isFav?'Saved':'Save'}
                  </button>
                  <button className="icon-btn" style={{width:'38px',height:'38px'}}><Share2 size={14}/></button>
                </div>
              </div>
            </div>

            {/* Related channels — shown below on mobile */}
            {related.length > 0 && (
              <div className="px-6 pb-8 lg:hidden">
                <h3 style={{fontFamily:'"Barlow",sans-serif', fontSize:'16px', fontWeight:700, color:'white', marginBottom:'12px'}}>
                  More {ch.group}
                </h3>
                <div className="row-scroll" style={{gap:'4px'}}>
                  {related.map(c => (
                    <ChannelCard key={c.id} channel={c} width={150} height={85}/>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── SIDEBAR ── */}
          <div className="hidden lg:flex flex-col w-80 xl:w-96 border-l overflow-y-auto"
            style={{borderColor:'rgba(255,255,255,0.06)', background:'rgba(0,0,0,0.4)', backdropFilter:'blur(20px)', height:'calc(100vh - 68px)', position:'sticky', top:'68px'}}>

            {/* Related */}
            {related.length > 0 && (
              <div className="p-5 border-b" style={{borderColor:'rgba(255,255,255,0.06)'}}>
                <h3 style={{fontFamily:'"Barlow",sans-serif', fontSize:'14px', fontWeight:700, color:'rgba(255,255,255,0.7)',
                  textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:'12px'}}>
                  More {ch.group}
                </h3>
                <div className="space-y-1">
                  {related.map(c => {
                    const a = GROUP_COLORS[c.group]||'#E50914'
                    return (
                      <button key={c.id} onClick={() => play(c)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded transition-all text-left group"
                        style={current?.id===c.id
                          ? {background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)'}
                          : {border:'1px solid transparent'}}
                        onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.06)')}
                        onMouseLeave={e=>(e.currentTarget.style.background=current?.id===c.id?'rgba(255,255,255,0.08)':'transparent')}>
                        <div className="w-10 h-6 rounded flex items-center justify-center shrink-0 overflow-hidden"
                          style={{background:`${a}18`}}>
                          {c.logo
                            ? <img src={c.logo} alt="" className="w-full h-full object-contain"
                                onError={e=>(e.currentTarget.style.display='none')}/>
                            : <Tv2 size={12} style={{color:a}}/>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p style={{fontSize:'13px', fontWeight:600, color:'white', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{c.name}</p>
                          <p style={{fontSize:'11px', color:'rgba(255,255,255,0.35)'}}>{c.group}</p>
                        </div>
                        {current?.id===c.id && <span className="live-dot shrink-0" style={{background:'#E50914'}}/>}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Recently watched */}
            {recent.filter(c=>c.id!==ch.id).length > 0 && (
              <div className="p-5 flex-1">
                <h3 style={{fontFamily:'"Barlow",sans-serif', fontSize:'14px', fontWeight:700, color:'rgba(255,255,255,0.7)',
                  textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:'12px'}}>
                  Recently Watched
                </h3>
                <div className="space-y-1">
                  {recent.filter(c=>c.id!==ch.id).slice(0,15).map(c => {
                    const a = GROUP_COLORS[c.group]||'#E50914'
                    return (
                      <button key={c.id} onClick={() => play(c)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded transition-all text-left"
                        style={{border:'1px solid transparent'}}
                        onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.06)')}
                        onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                        <div className="w-10 h-6 rounded flex items-center justify-center shrink-0 overflow-hidden"
                          style={{background:`${a}18`}}>
                          {c.logo
                            ? <img src={c.logo} alt="" className="w-full h-full object-contain"
                                onError={e=>(e.currentTarget.style.display='none')}/>
                            : <Tv2 size={12} style={{color:a}}/>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p style={{fontSize:'13px', fontWeight:600, color:'rgba(255,255,255,0.8)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{c.name}</p>
                          <p style={{fontSize:'11px', color:'rgba(255,255,255,0.3)'}}>{c.group}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
