import { useState } from 'react'
import { Settings, Download, Trash2, Zap, Shield } from 'lucide-react'
import { useApp } from '../context/AppContext'

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div onClick={() => onChange(!on)} className={`toggle-wrap ${on ? 'on' : 'off'}`}>
      <div className="toggle-knob" />
    </div>
  )
}

export default function SettingsPage() {
  const { channels, favorites } = useApp()
  const [autoplay, setAutoplay] = useState(true)
  const [history,  setHistory]  = useState(true)
  const [quality,  setQuality]  = useState('auto')

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ channels, favorites, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'axis-channels.json'; a.click()
  }

  const clearAll = () => {
    if (confirm('Clear all data? This removes all channels and history.')) {
      localStorage.clear(); window.location.reload()
    }
  }

  const SectionTitle = ({ icon: Icon, title }: { icon: any; title: string }) => (
    <div className="flex items-center gap-2.5 px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
      <Icon size={15} style={{ color: 'rgba(255,255,255,0.4)' }} strokeWidth={1.5} />
      <h2 style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{title}</h2>
    </div>
  )

  const Row = ({ label, desc, ctrl }: { label: string; desc: string; ctrl: React.ReactNode }) => (
    <div className="flex items-center justify-between px-5 py-4 gap-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div>
        <p style={{ fontSize: '14px', fontWeight: 500, color: '#e5e5e5' }}>{label}</p>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{desc}</p>
      </div>
      <div style={{ flexShrink: 0 }}>{ctrl}</div>
    </div>
  )

  return (
    <div style={{ paddingTop: '88px', minHeight: '100vh' }}>
      <div className="px-[4%] pb-12" style={{ maxWidth: '680px' }}>
        <div className="flex items-center gap-3 mb-8">
          <Settings size={26} style={{ color: '#E50914' }} />
          <h1 style={{ fontFamily: '"Barlow",sans-serif', fontSize: '2.2rem', fontWeight: 900, color: 'white' }}>Settings</h1>
        </div>

        {/* Playback */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px' }}>
          <SectionTitle icon={Zap} title="Playback" />
          <Row label="Autoplay on selection" desc="Start playing immediately when a channel is selected"
            ctrl={<Toggle on={autoplay} onChange={setAutoplay} />} />
          <Row label="Save watch history" desc="Track recently watched channels"
            ctrl={<Toggle on={history} onChange={setHistory} />} />
          <Row label="Stream quality" desc="Preferred quality for adaptive streams"
            ctrl={
              <select value={quality} onChange={e => setQuality(e.target.value)}
                className="ax-input py-2 px-3" style={{ width: '110px', fontSize: '13px' }}>
                {['auto', '1080p', '720p', '480p', '360p'].map(q => <option key={q}>{q}</option>)}
              </select>
            } />
        </div>

        {/* Privacy */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px' }}>
          <SectionTitle icon={Shield} title="Privacy" />
          <Row label="Local storage only" desc="All your data stays on your device — no servers, no telemetry, ever."
            ctrl={<span style={{ fontSize: '12px', fontWeight: 700, color: '#4ade80', background: 'rgba(21,128,61,0.12)', border: '1px solid rgba(21,128,61,0.25)', padding: '4px 12px', borderRadius: '4px' }}>Active</span>} />
        </div>

        {/* Data */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', overflow: 'hidden' }}>
          <SectionTitle icon={Download} title="Data" />
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="flex items-center justify-between p-4 rounded" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 500, color: '#e5e5e5' }}>Export data</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{channels.length} channels · {favorites.length} favorites</p>
              </div>
              <button onClick={exportData} className="btn-ghost-sm gap-2"><Download size={13} />Export</button>
            </div>
            <button onClick={clearAll}
              className="flex items-center justify-between p-4 rounded w-full text-left transition-all"
              style={{ background: 'rgba(229,9,20,0.06)', border: '1px solid rgba(229,9,20,0.15)' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(229,9,20,0.4)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(229,9,20,0.15)')}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#E50914' }}>Clear all data</p>
                <p style={{ fontSize: '12px', color: 'rgba(229,9,20,0.5)', marginTop: '2px' }}>Removes all channels, history and settings</p>
              </div>
              <Trash2 size={16} style={{ color: 'rgba(229,9,20,0.4)', flexShrink: 0 }} />
            </button>
          </div>
        </div>

        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: '32px' }}>
          AXIS · React 18 · TypeScript · HLS.js · Framer Motion
        </p>
      </div>
    </div>
  )
}
