
function parseM3U(text: string): Array<{name:string;url:string;group:string;logo:string}> {
  const lines = text.split('\n'); const result = []; let cur: any = {}
  for (const line of lines) {
    const l = line.trim()
    if (l.startsWith('#EXTINF:')) {
      const n=l.match(/,(.+)$/); const g=l.match(/group-title="([^"]*)"/); const lo=l.match(/tvg-logo="([^"]*)"/);
      cur = { name: n?.[1]?.trim()||'Unknown', group: g?.[1]||'Other', logo: lo?.[1]||'' }
    } else if (l && !l.startsWith('#') && cur.name) {
      result.push({ ...cur, url: l }); cur = {}
    }
  }
  return result
}

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link2, Globe, FileText, Upload, Check, AlertCircle, Loader2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

type Tab = 'url'|'playlist'|'paste'|'file'

export default function AddPage() {
  const [tab, setTab] = useState<Tab>('url')
  const [name, setName] = useState(''); const [url, setUrl] = useState('')
  const [group, setGroup] = useState('Other')
  const [pUrl, setPUrl] = useState(''); const [pName, setPName] = useState('')
  const [m3u, setM3u] = useState(''); const [m3uName, setM3uName] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ok:boolean;msg:string}|null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const { addChannel, importChannels } = useApp()
  const navigate = useNavigate()

  const done = (ok:boolean, msg:string) => { setResult({ok,msg}); if(ok) setTimeout(()=>navigate('/'),1600) }

  const doUrl = () => {
    if(!name||!url)return
    addChannel({name,url,group,logo:''})
    done(true,`"${name}" added`)
  }

  const doPlaylist = async () => {
    if(!pUrl)return; setLoading(true)
    try {
      let text=''
      try{ const r=await fetch(pUrl,{signal:AbortSignal.timeout(12000)}); if(!r.ok)throw 0; text=await r.text() }
      catch{ const r=await fetch(`https://corsproxy.io/?${encodeURIComponent(pUrl)}`,{signal:AbortSignal.timeout(18000)}); text=await r.text() }
      if(!text.includes('#EXTINF'))throw new Error('Not a valid M3U playlist')
      let count=0
      const lines=text.split('\n'); let cur:{name?:string;logo?:string;group?:string}={}
      for(const line of lines){
        const l=line.trim()
        if(l.startsWith('#EXTINF:')){
          const n=l.match(/,(.+)$/); const g=l.match(/group-title="([^"]*)"/); const lo=l.match(/tvg-logo="([^"]*)"/);
          cur={name:n?.[1]?.trim(),group:g?.[1]||'Other',logo:lo?.[1]||''}
        } else if(l&&!l.startsWith('#')&&cur.name){
          addChannel({name:cur.name,url:l,group:cur.group||'Other',logo:cur.logo||''});count++; cur={}
        }
      }
      done(true,`Imported ${count} channels from playlist`)
    } catch(e:any){ done(false, e?.message||'Failed to fetch playlist. Try the Paste M3U tab.') }
    finally{ setLoading(false) }
  }

  const doPaste = () => {
    if(!m3u||!m3uName)return; setLoading(true)
    let count=0
    const lines=m3u.split('\n'); let cur:{name?:string;logo?:string;group?:string}={}
    for(const line of lines){
      const l=line.trim()
      if(l.startsWith('#EXTINF:')){
        const n=l.match(/,(.+)$/); const g=l.match(/group-title="([^"]*)"/); const lo=l.match(/tvg-logo="([^"]*)"/);
        cur={name:n?.[1]?.trim(),group:g?.[1]||'Other',logo:lo?.[1]||''}
      } else if(l&&!l.startsWith('#')&&cur.name){
        addChannel({name:cur.name,url:l,group:cur.group||'Other',logo:cur.logo||''});count++; cur={}
      }
    }
    setLoading(false); done(count>0,count>0?`Imported ${count} channels`:'No channels found in M3U')
  }

  const doFile = (e:React.ChangeEvent<HTMLInputElement>) => {
    const f=e.target.files?.[0]; if(!f)return
    const r=new FileReader(); r.onload=ev=>{setM3u(ev.target?.result as string);setM3uName(f.name.replace(/\.m3u8?$/,''));setTab('paste')}
    r.readAsText(f)
  }

  const TABS=[{id:'url'as Tab,icon:Link2,label:'Stream URL'},{id:'playlist'as Tab,icon:Globe,label:'Playlist URL'},{id:'paste'as Tab,icon:FileText,label:'Paste M3U'},{id:'file'as Tab,icon:Upload,label:'Import File'}]
  const GROUPS=['Bangla','Sports','News','Movies','Entertainment','Music','Kids','Documentary','Religious','International','Other']

  return (
    <div style={{paddingTop:'88px',minHeight:'100vh',display:'flex',alignItems:'flex-start',justifyContent:'center',padding:'88px 16px 40px'}}>
      <div style={{width:'100%',maxWidth:'520px'}}>
        <h1 style={{fontFamily:'"Barlow",sans-serif',fontSize:'2.2rem',fontWeight:900,color:'white',marginBottom:'8px'}}>Add Channels</h1>
        <p style={{fontSize:'14px',color:'rgba(255,255,255,0.4)',marginBottom:'28px'}}>Add a single stream or import a full playlist</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {TABS.map(({id,icon:Icon,label})=>(
            <button key={id} onClick={()=>{setTab(id);setResult(null)}}
              style={{display:'flex',alignItems:'center',gap:'6px',padding:'8px 16px',borderRadius:'4px',fontSize:'13px',fontWeight:600,cursor:'pointer',transition:'all 0.15s',
                ...(tab===id?{background:'#E50914',color:'white'}:{background:'rgba(255,255,255,0.07)',color:'rgba(255,255,255,0.6)',border:'1px solid rgba(255,255,255,0.1)'})}}>
              <Icon size={12}/>{label}
            </button>
          ))}
        </div>

        <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:'8px',padding:'24px'}}>
          <div className="space-y-4">
            {tab==='url'&&<>
              <Field label="Channel Name" value={name} onChange={setName} placeholder="e.g. CNN International"/>
              <Field label="Stream URL" value={url} onChange={setUrl} placeholder="https://stream.example.com/live.m3u8" mono/>
              <div><Label>Category</Label>
                <select value={group} onChange={e=>setGroup(e.target.value)} className="ax-input mt-1">
                  {GROUPS.map(g=><option key={g}>{g}</option>)}
                </select>
              </div>
              <button onClick={doUrl} disabled={!name||!url} className="btn-red w-full justify-center disabled:opacity-40" style={{padding:'12px',fontSize:'15px',fontWeight:700}}>
                Add Stream
              </button>
            </>}

            {tab==='playlist'&&<>
              <div style={{background:'rgba(229,9,20,0.08)',border:'1px solid rgba(229,9,20,0.2)',borderRadius:'6px',padding:'14px',fontSize:'13px',color:'rgba(255,255,255,0.7)',lineHeight:1.6}}>
                💡 Paste your M3U provider URL — AXIS fetches and imports all channels automatically. Works with IPTV subscription URLs.
              </div>
              <Field label="Playlist URL" value={pUrl} onChange={setPUrl} placeholder="http://provider.com/get.php?username=x&password=y&type=m3u" mono/>
              <Field label="Playlist Name (optional)" value={pName} onChange={setPName} placeholder="My IPTV"/>
              <button onClick={doPlaylist} disabled={!pUrl||loading} className="btn-red w-full justify-center disabled:opacity-40" style={{display:'flex',alignItems:'center',gap:'8px',padding:'12px',fontSize:'15px',fontWeight:700,justifyContent:'center'}}>
                {loading?<><Loader2 size={16} className="animate-spin"/>Importing…</>:'Import Playlist'}
              </button>
            </>}

            {tab==='paste'&&<>
              <Field label="Playlist Name" value={m3uName} onChange={setM3uName} placeholder="My Playlist"/>
              <div><Label>M3U Content</Label>
                <textarea value={m3u} onChange={e=>setM3u(e.target.value)}
                  placeholder={'#EXTM3U\n#EXTINF:-1 group-title="News",CNN\nhttps://stream.example.com/live.m3u8'}
                  className="ax-input mt-1" style={{height:'140px',resize:'none',fontFamily:'"DM Mono",monospace',fontSize:'12px'}}/>
              </div>
              <button onClick={doPaste} disabled={!m3u||!m3uName||loading} className="btn-red w-full disabled:opacity-40" style={{padding:'12px',fontSize:'15px',fontWeight:700}}>
                {loading?'Importing…':'Import Playlist'}
              </button>
            </>}

            {tab==='file'&&(
              <div onClick={()=>fileRef.current?.click()}
                style={{border:'2px dashed rgba(255,255,255,0.12)',borderRadius:'8px',padding:'48px 24px',display:'flex',flexDirection:'column',alignItems:'center',gap:'12px',cursor:'pointer',transition:'border-color 0.2s'}}
                onMouseEnter={e=>(e.currentTarget.style.borderColor='rgba(229,9,20,0.4)')}
                onMouseLeave={e=>(e.currentTarget.style.borderColor='rgba(255,255,255,0.12)')}>
                <Upload size={32} style={{color:'rgba(255,255,255,0.25)'}}/>
                <div style={{textAlign:'center'}}>
                  <p style={{fontSize:'15px',fontWeight:600,color:'rgba(255,255,255,0.7)'}}>Drop M3U file here</p>
                  <p style={{fontSize:'13px',color:'rgba(255,255,255,0.35)',marginTop:'4px'}}>.m3u and .m3u8 supported</p>
                </div>
                <input ref={fileRef} type="file" accept=".m3u,.m3u8,.txt" className="hidden" onChange={doFile}/>
              </div>
            )}

            <AnimatePresence>
              {result&&(
                <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',alignItems:'center',gap:'10px',padding:'12px 14px',borderRadius:'6px',fontSize:'14px',
                    ...(result.ok?{background:'rgba(21,128,61,0.15)',border:'1px solid rgba(21,128,61,0.3)',color:'#4ade80'}
                                 :{background:'rgba(229,9,20,0.1)',border:'1px solid rgba(229,9,20,0.25)',color:'#f87171'})}}>
                  {result.ok?<Check size={16}/>:<AlertCircle size={16}/>}
                  {result.msg}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

function Label({children}:{children:React.ReactNode}){
  return <p style={{fontSize:'11px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.14em',color:'rgba(255,255,255,0.4)',marginBottom:'6px'}}>{children}</p>
}
function Field({label,value,onChange,placeholder,mono}:{label:string;value:string;onChange:(v:string)=>void;placeholder:string;mono?:boolean}){
  return <div><Label>{label}</Label><input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} className="ax-input" style={mono?{fontFamily:'"DM Mono",monospace',fontSize:'12px'}:{}}/></div>
}
