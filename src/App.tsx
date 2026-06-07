import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Shell from './components/Shell'
import HomePage from './pages/HomePage'
import WatchPage from './pages/WatchPage'
import BrowsePage from './pages/BrowsePage'
import FavoritesPage from './pages/FavoritesPage'
import RecentPage from './pages/RecentPage'
import SettingsPage from './pages/SettingsPage'
import AddPage from './pages/AddPage'
import FounderPage from './pages/FounderPage'

function IntroScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'logo' | 'fade'>('logo')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('fade'), 1800)
    const t2 = setTimeout(() => onDone(), 2400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onDone])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#0a0000',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'opacity 0.6s ease',
      opacity: phase === 'fade' ? 0 : 1,
      pointerEvents: 'none',
      overflow: 'hidden',
    }}>
      {/* Crimson orbs in intro too */}
      <div style={{
        position: 'absolute', top: '-20%', right: '-15%',
        width: '60vw', height: '60vw', borderRadius: '50%',
        background: 'radial-gradient(circle, #DC143C 0%, #7B0000 45%, transparent 72%)',
        opacity: 0.3,
      }} />
      <div style={{
        position: 'absolute', bottom: '-25%', left: '-15%',
        width: '65vw', height: '65vw', borderRadius: '50%',
        background: 'radial-gradient(circle, #DC143C 0%, #6B0000 50%, transparent 72%)',
        opacity: 0.2,
      }} />

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          fontFamily: '"Barlow", sans-serif', fontWeight: 900,
          fontSize: 'clamp(80px, 18vw, 140px)',
          color: '#DC143C', letterSpacing: '-0.05em', lineHeight: 1,
          filter: 'drop-shadow(0 0 50px rgba(220,20,60,0.7))',
          animation: 'axisLogoIn 0.5s cubic-bezier(0.16,1,0.3,1) both',
        }}>
          AXIS
        </div>
        <div style={{
          fontFamily: '"Barlow", sans-serif', fontWeight: 700, fontSize: '12px',
          letterSpacing: '0.35em', color: 'rgba(255,255,255,0.3)',
          textTransform: 'uppercase', marginTop: '8px',
          animation: 'axisSubIn 0.5s 0.25s cubic-bezier(0.16,1,0.3,1) both',
        }}>
          TV
        </div>
        <div style={{
          position: 'absolute', bottom: '-16px', left: '50%',
          transform: 'translateX(-50%)', height: '3px',
          background: 'linear-gradient(to right, transparent, #DC143C, transparent)',
          borderRadius: '2px',
          animation: 'axisBarIn 0.6s 0.1s ease both',
        }} />
      </div>

      <style>{`
        @keyframes axisLogoIn { from{opacity:0;transform:scale(0.85)} to{opacity:1;transform:scale(1)} }
        @keyframes axisSubIn  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes axisBarIn  { from{width:0;opacity:0} to{width:200px;opacity:1} }
      `}</style>
    </div>
  )
}

export default function App() {
  const [ready, setReady] = useState(false)
  return (
    <>
      {!ready && <IntroScreen onDone={() => setReady(true)} />}
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Shell />}>
              <Route path="/"              element={<HomePage />} />
              <Route path="/watch/:id?"    element={<WatchPage />} />
              <Route path="/browse/:group?" element={<BrowsePage />} />
              <Route path="/favorites"     element={<FavoritesPage />} />
              <Route path="/recent"        element={<RecentPage />} />
              <Route path="/settings"      element={<SettingsPage />} />
              <Route path="/add"           element={<AddPage />} />
              <Route path="/founder"       element={<FounderPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </>
  )
}
