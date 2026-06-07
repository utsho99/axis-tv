import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { useApp } from '../context/AppContext'
import ChannelCard from '../components/ChannelCard'

export default function BrowsePage() {
  const { group } = useParams()
  const { channels } = useApp()
  const [query, setQuery] = useState('')
  const [activeGroup, setActiveGroup] = useState(group || 'All')

  const groups = ['All', ...new Set(channels.map(c => c.group))]
  const filtered = channels
    .filter(c => activeGroup === 'All' || c.group === activeGroup)
    .filter(c => !query || c.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <div style={{paddingTop:'88px', minHeight:'100vh'}}>
      <div className="px-[4%] pb-12">
        <h1 style={{fontFamily:'"Barlow",sans-serif', fontSize:'2.5rem', fontWeight:900, color:'white', marginBottom:'24px'}}>
          Browse
        </h1>
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{color:'rgba(255,255,255,0.3)'}}/>
            <input value={query} onChange={e=>setQuery(e.target.value)}
              placeholder="Search channels…" className="ax-input pl-9" style={{width:'240px'}}/>
          </div>
          <div className="flex gap-2 flex-wrap">
            {groups.map(g => (
              <button key={g} onClick={() => setActiveGroup(g)}
                style={{padding:'7px 16px', borderRadius:'4px', fontSize:'13px', fontWeight:600, cursor:'pointer', transition:'all 0.15s',
                  ...(activeGroup===g
                    ? {background:'#E50914', color:'white'}
                    : {background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.6)', border:'1px solid rgba(255,255,255,0.1)'})}}>
                {g}
              </button>
            ))}
          </div>
        </div>
        <p style={{fontSize:'13px', color:'rgba(255,255,255,0.35)', marginBottom:'16px'}}>{filtered.length} channels</p>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(178px,1fr))', gap:'4px'}}>
          {filtered.map((ch,i) => (
            <motion.div key={ch.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:Math.min(i*0.01,0.3)}}>
              <ChannelCard channel={ch} width={undefined as any} height={100}/>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
