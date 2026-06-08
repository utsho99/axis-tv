import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Tv2, Grid2X2, Heart, Clock, Settings, Plus, Search, User, X, Eye } from 'lucide-react'
import { useApp } from '../context/AppContext'

const NAV = [
  { to:'/',          icon:Home,     label:'Home'      },
  { to:'/watch',     icon:Tv2,      label:'Watch'     },
  { to:'/browse',    icon:Grid2X2,  label:'Browse'    },
  { to:'/favorites', icon:Heart,    label:'Favs'      },
  { to:'/founder',   icon:User,     label:'Dev'       },
]

function formatCount(n: number) {
  if (n >= 1_000_000) return (n/1_000_000).toFixed(1).replace(/\.0$/,'')+'M'
  if (n >= 1_000)     return (n/1_000).toFixed(1).replace(/\.0$/,'')+'K'
  return n.toString()
}

function useVisitCounter() {
  const [count, setCount] = useState<number|null>(null)
  useEffect(() => {
    fetch('https://api.counterapi.dev/v1/axis-tv-v7/pageviews/up')
      .then(r=>r.json())
      .then(d=>{ const v=d?.count??d?.value??null; if(typeof v==='number') setCount(v) })
      .catch(()=>{})
  },[])
  return count
}

export default function Shell() {
  const [scrolled,  setScrolled]  = useState(false)
  const [search,    setSearch]    = useState('')
  const [searching, setSearching] = useState(false)
  const { current, channels } = useApp()
  const navigate  = useNavigate()
  const location  = useLocation()
  const visits    = useVisitCounter()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const results = search.length > 1
    ? channels.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).slice(0, 8)
    : []

  return (
    <div style={{ minHeight:'100vh', background:'#0a0000', position:'relative' }}>

      {/* ── DESKTOP TOP NAV ── */}
      <nav className={`navbar ${scrolled?'scrolled':''}`} style={{ gap:'28px' }}>
        {/* Logo */}
        <button onClick={()=>navigate('/')} className="shrink-0 flex items-center gap-2">
          <span style={{
            fontFamily:'"Barlow",sans-serif', fontWeight:900, fontSize:'26px',
            color:'#DC143C', letterSpacing:'0.06em',
            textShadow:'0 0 20px rgba(220,20,60,0.6)',
          }}>AXIS <span style={{fontSize:'13px',color:'rgba(255,255,255,0.35)',fontWeight:500,letterSpacing:'0.2em'}}>TV</span></span>
        </button>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6">
          {[
            {to:'/',label:'Home'},{to:'/watch',label:'Watch'},
            {to:'/browse',label:'Browse'},{to:'/favorites',label:'Favorites'},
            {to:'/recent',label:'Recent'},
          ].map(({to,label})=>(
            <NavLink key={to} to={to} end={to==='/'}>
              {({isActive})=>(
                <span style={{
                  fontSize:'14px', fontWeight:isActive?700:400,
                  color:isActive?'#fff':'rgba(255,255,255,0.5)',
                  transition:'color 0.15s', cursor:'pointer',
                  borderBottom:isActive?'1px solid rgba(220,20,60,0.6)':'1px solid transparent',
                  paddingBottom:'2px',
                }}>{label}</span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Right */}
        <div className="ml-auto flex items-center gap-2">
          {visits!==null && (
            <div style={{
              display:'flex',alignItems:'center',gap:'5px',
              padding:'4px 10px',borderRadius:'100px',
              background:'rgba(220,20,60,0.08)',border:'1px solid rgba(220,20,60,0.2)',
            }}>
              <Eye size={12} style={{color:'rgba(220,20,60,0.7)'}}/>
              <span style={{fontFamily:'"Barlow",sans-serif',fontWeight:700,fontSize:'12px',color:'rgba(255,255,255,0.6)'}}>
                {formatCount(visits)}
              </span>
            </div>
          )}

          {/* Search */}
          <div className="relative">
            {searching ? (
              <motion.div initial={{width:0,opacity:0}} animate={{width:200,opacity:1}} className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{color:'rgba(255,255,255,0.35)'}}/>
                <input autoFocus value={search} onChange={e=>setSearch(e.target.value)}
                  placeholder="Search…" className="ax-input pl-8 py-1.5 text-sm" style={{width:'200px'}}/>
                <button onClick={()=>{setSearching(false);setSearch('')}} className="absolute right-2.5 top-1/2 -translate-y-1/2">
                  <X size={12} style={{color:'rgba(255,255,255,0.35)'}}/>
                </button>
                {results.length>0 && (
                  <div className="absolute top-full mt-2 left-0 right-0 rounded-xl overflow-hidden"
                    style={{background:'rgba(12,0,4,0.95)',border:'1px solid rgba(220,20,60,0.2)',backdropFilter:'blur(24px)',zIndex:200}}>
                    {results.map(ch=>(
                      <button key={ch.id} onClick={()=>{navigate('/watch/'+ch.id);setSearch('');setSearching(false)}}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left"
                        style={{borderBottom:'1px solid rgba(255,255,255,0.04)'}}
                        onMouseEnter={e=>(e.currentTarget.style.background='rgba(220,20,60,0.1)')}
                        onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                        <img src={ch.logo} alt="" className="w-8 h-5 object-contain rounded shrink-0"
                          onError={e=>(e.currentTarget.style.display='none')}/>
                        <div>
                          <p style={{fontSize:'13px',fontWeight:500,color:'#e5e5e5'}}>{ch.name}</p>
                          <p style={{fontSize:'11px',color:'rgba(255,255,255,0.35)'}}>{ch.group}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <button onClick={()=>setSearching(true)} className="icon-btn"><Search size={15}/></button>
            )}
          </div>

          {current && (
            <button onClick={()=>navigate('/watch')}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{background:'rgba(220,20,60,0.12)',border:'1px solid rgba(220,20,60,0.3)',fontSize:'12px',color:'rgba(255,255,255,0.8)'}}>
              <span className="live-dot" style={{flexShrink:0}}/>
              <span className="max-w-24 truncate">{current.name}</span>
            </button>
          )}

          <button onClick={()=>navigate('/add')} className="btn-red" style={{fontSize:'13px',padding:'7px 14px'}}>
            <Plus size={13}/>Add
          </button>
          <NavLink to="/settings" className="hidden md:block">
            <button className="icon-btn"><Settings size={15}/></button>
          </NavLink>
          <NavLink to="/founder" className="hidden md:block">
            <button className="icon-btn"><User size={15}/></button>
          </NavLink>
        </div>
      </nav>

      {/* ── PAGE CONTENT ── */}
      <motion.div key={location.pathname}
        initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.2}}
        style={{paddingBottom:'80px'}} /* space for mobile bottom nav */
      >
        <Outlet/>
      </motion.div>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="md:hidden" style={{
        position:'fixed', bottom:0, left:0, right:0, zIndex:200,
        background:'rgba(8,0,2,0.92)',
        borderTop:'1px solid rgba(220,20,60,0.18)',
        backdropFilter:'blur(24px)',
        WebkitBackdropFilter:'blur(24px)',
        display:'flex', alignItems:'stretch',
        paddingBottom:'env(safe-area-inset-bottom)',
      }}>
        {NAV.map(({to, icon:Icon, label})=>(
          <NavLink key={to} to={to} end={to==='/'} style={{flex:1}}>
            {({isActive})=>(
              <div style={{
                display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                gap:'4px', padding:'10px 4px',
                color: isActive ? '#DC143C' : 'rgba(255,255,255,0.38)',
                transition:'color 0.15s',
                position:'relative',
              }}>
                {isActive && (
                  <div style={{
                    position:'absolute', top:0, left:'25%', right:'25%',
                    height:'2px', background:'#DC143C', borderRadius:'0 0 2px 2px',
                    boxShadow:'0 0 8px rgba(220,20,60,0.8)',
                  }}/>
                )}
                <Icon size={20} strokeWidth={isActive?2.5:1.8}/>
                <span style={{fontSize:'10px', fontWeight:isActive?700:400, letterSpacing:'0.02em'}}>{label}</span>
              </div>
            )}
          </NavLink>
        ))}
        {/* Settings in mobile bottom nav too */}
        <NavLink to="/settings" style={{flex:1}}>
          {({isActive})=>(
            <div style={{
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
              gap:'4px', padding:'10px 4px',
              color: isActive ? '#DC143C' : 'rgba(255,255,255,0.38)',
              transition:'color 0.15s', position:'relative',
            }}>
              {isActive && (
                <div style={{
                  position:'absolute', top:0, left:'25%', right:'25%',
                  height:'2px', background:'#DC143C', borderRadius:'0 0 2px 2px',
                  boxShadow:'0 0 8px rgba(220,20,60,0.8)',
                }}/>
              )}
              <Settings size={20} strokeWidth={isActive?2.5:1.8}/>
              <span style={{fontSize:'10px', fontWeight:isActive?700:400}}>Settings</span>
            </div>
          )}
        </NavLink>
      </nav>
    </div>
  )
}
