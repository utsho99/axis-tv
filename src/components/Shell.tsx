import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Tv2, Grid2X2, Heart, Clock, Settings, Plus, Search, User, X, Eye } from 'lucide-react'
import { useApp } from '../context/AppContext'

const NAV = [
  { to:'/',          icon:Home,     label:'Home'      },
  { to:'/watch',     icon:Tv2,      label:'Watch'     },
  { to:'/browse',    icon:Grid2X2,  label:'Browse'    },
  { to:'/favorites', icon:Heart,    label:'Favorites' },
  { to:'/recent',    icon:Clock,    label:'Recent'    },
]

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1_000)     return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
  return n.toString()
}

function useVisitCounter() {
  const [count, setCount] = useState<number | null>(null)
  useEffect(() => {
    const NAMESPACE = 'axis-tv-v7', KEY = 'pageviews'
    fetch(`https://api.counterapi.dev/v1/${NAMESPACE}/${KEY}/up`)
      .then(r => r.json())
      .then(data => { const v = data?.count ?? data?.value ?? null; if (typeof v === 'number') setCount(v) })
      .catch(() => {})
  }, [])
  return count
}

export default function Shell() {
  const [scrolled,  setScrolled]  = useState(false)
  const [search,    setSearch]    = useState('')
  const [searching, setSearching] = useState(false)
  const { current, channels } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const visits   = useVisitCounter()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const results = search.length > 1
    ? channels.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).slice(0, 8)
    : []

  return (
    <div className="min-h-screen" style={{ background: '#0a0000', position: 'relative', zIndex: 1 }}>

      {/* ── TOP NAV ── */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} style={{ gap: '32px' }}>

        {/* Logo */}
        <button onClick={() => navigate('/')} className="shrink-0 flex items-center gap-2">
          <span style={{
            fontFamily: '"Barlow",sans-serif', fontWeight: 900, fontSize: '26px',
            color: '#DC143C', letterSpacing: '0.06em',
            textShadow: '0 0 20px rgba(220,20,60,0.6)',
          }}>AXIS</span>
        </button>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-6">
          {NAV.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'}>
              {({ isActive }) => (
                <span style={{
                  fontSize: '14px', fontWeight: isActive ? 700 : 400,
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
                  transition: 'color 0.15s', cursor: 'pointer',
                  fontFamily: '"Inter",sans-serif',
                  textShadow: isActive ? '0 0 16px rgba(220,20,60,0.5)' : 'none',
                  borderBottom: isActive ? '1px solid rgba(220,20,60,0.6)' : '1px solid transparent',
                  paddingBottom: '2px',
                }}>
                  {label}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-3">

          {/* Visit counter */}
          {visits !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16,1,0.3,1] }}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '5px 12px', borderRadius: '100px',
                background: 'rgba(220,20,60,0.08)',
                border: '1px solid rgba(220,20,60,0.2)',
              }}
            >
              <Eye size={13} style={{ color: 'rgba(220,20,60,0.7)', flexShrink: 0 }} />
              <span style={{ fontFamily: '"Barlow",sans-serif', fontWeight: 700, fontSize: '13px', color: 'rgba(255,255,255,0.65)' }}>
                {formatCount(visits)}
              </span>
            </motion.div>
          )}

          {/* Search */}
          <div className="relative">
            {searching ? (
              <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 220, opacity: 1 }} className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.4)' }} />
                <input autoFocus value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search channels…" className="ax-input pl-9 py-2 text-sm"
                  style={{ width: '220px' }} />
                <button onClick={() => { setSearching(false); setSearch('') }} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X size={13} style={{ color: 'rgba(255,255,255,0.4)' }} />
                </button>
                {results.length > 0 && (
                  <div className="absolute top-full mt-2 left-0 right-0 rounded-xl overflow-hidden"
                    style={{ background: 'rgba(15,0,5,0.9)', border: '1px solid rgba(220,20,60,0.2)', backdropFilter: 'blur(24px)', zIndex: 200 }}>
                    {results.map(ch => (
                      <button key={ch.id} onClick={() => { navigate('/watch/' + ch.id); setSearch(''); setSearching(false) }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left"
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(220,20,60,0.1)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <img src={ch.logo} alt="" className="w-8 h-5 object-contain rounded shrink-0"
                          onError={e => (e.currentTarget.style.display = 'none')} />
                        <div>
                          <p style={{ fontSize: '13px', fontWeight: 500, color: '#e5e5e5' }}>{ch.name}</p>
                          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{ch.group}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <button onClick={() => setSearching(true)} className="icon-btn w-9 h-9">
                <Search size={15} />
              </button>
            )}
          </div>

          {current && (
            <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              onClick={() => navigate('/watch')}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(220,20,60,0.12)', border: '1px solid rgba(220,20,60,0.3)', fontSize: '13px', color: 'rgba(255,255,255,0.85)' }}>
              <span className="live-dot" style={{ flexShrink: 0 }} />
              <span className="max-w-28 truncate">{current.name}</span>
              <Tv2 size={12} style={{ color: '#DC143C', flexShrink: 0 }} />
            </motion.button>
          )}

          <button onClick={() => navigate('/add')} className="btn-red py-2 px-4" style={{ fontSize: '13px' }}>
            <Plus size={14} />Add
          </button>

          <NavLink to="/settings">
            <button className="icon-btn w-9 h-9"><Settings size={15} /></button>
          </NavLink>
          <NavLink to="/founder">
            <button className="icon-btn w-9 h-9"><User size={15} /></button>
          </NavLink>
        </div>
      </nav>

      {/* ── PAGE ── */}
      <motion.div key={location.pathname}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}>
        <Outlet />
      </motion.div>
    </div>
  )
}
