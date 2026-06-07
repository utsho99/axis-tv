import { Clock } from 'lucide-react'
import { useApp } from '../context/AppContext'
import ChannelCard from '../components/ChannelCard'

function ago(ts:number) {
  const m = Math.floor((Date.now()-ts)/60000)
  if(m<1)return'just now';if(m<60)return`${m}m ago`
  const h=Math.floor(m/60);if(h<24)return`${h}h ago`
  return`${Math.floor(h/24)}d ago`
}

export default function RecentPage() {
  const { recent } = useApp()
  return (
    <div style={{paddingTop:'88px', minHeight:'100vh'}}>
      <div className="px-[4%] pb-12">
        <div className="flex items-center gap-3 mb-8">
          <Clock size={28} style={{color:'#E50914'}}/>
          <h1 style={{fontFamily:'"Barlow",sans-serif',fontSize:'2.5rem',fontWeight:900,color:'white'}}>Recently Watched</h1>
        </div>
        {recent.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <Clock size={60} style={{color:'rgba(255,255,255,0.1)'}} strokeWidth={1}/>
            <p style={{fontSize:'18px',fontWeight:600,color:'rgba(255,255,255,0.4)'}}>Nothing watched yet</p>
          </div>
        ) : (
          <div className="space-y-1" style={{maxWidth:'700px'}}>
            {recent.map(ch => (
              <div key={ch.id} className="flex items-center gap-4 px-4 py-3 rounded transition-all"
                style={{border:'1px solid transparent'}}
                onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.05)')}
                onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                <div className="w-14 h-8 rounded overflow-hidden shrink-0 flex items-center justify-center"
                  style={{background:'rgba(255,255,255,0.06)'}}>
                  {ch.logo && <img src={ch.logo} alt="" className="w-full h-full object-contain" onError={e=>(e.currentTarget.style.display='none')}/>}
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{fontSize:'15px',fontWeight:600,color:'white',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{ch.name}</p>
                  <p style={{fontSize:'12px',color:'rgba(255,255,255,0.35)'}}>{ch.group}</p>
                </div>
                {ch.lastPlayed && <p style={{fontSize:'12px',color:'rgba(255,255,255,0.3)',flexShrink:0}}>{ago(ch.lastPlayed)}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
