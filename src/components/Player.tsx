import { useEffect, useRef, useState, useCallback } from 'react'
import Hls from 'hls.js'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, RotateCcw, Loader2, AlertCircle, Settings } from 'lucide-react'

interface Props { url:string; name:string; autoPlay?:boolean; className?:string }

// CORS proxy for streams that need it
const CORS_PROXY = 'https://corsproxy.io/?url='

function proxyUrl(url: string): string {
  // Don't proxy URLs that are known to work directly or already proxied
  if (url.includes('corsproxy') || url.includes('hlsjs.video-dev')) return url
  return url
}

export default function Player({ url, name, autoPlay=true, className='' }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef   = useRef<Hls|null>(null)
  const contRef  = useRef<HTMLDivElement>(null)
  const hideRef  = useRef<ReturnType<typeof setTimeout>>()
  const retries  = useRef(0)
  const urlRef   = useRef(url)

  const [playing,  setPlaying]  = useState(false)
  const [muted,    setMuted]    = useState(false)
  const [vol,      setVol]      = useState(1)
  const [fs,       setFs]       = useState(false)
  const [ctrl,     setCtrl]     = useState(true)
  const [status,   setStatus]   = useState<'loading'|'ready'|'buffering'|'error'>('loading')
  const [errMsg,   setErrMsg]   = useState('')

  const destroy = useCallback(() => {
    if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null }
    clearTimeout(hideRef.current)
  }, [])

  const init = useCallback((targetUrl?: string) => {
    const v = videoRef.current; if (!v) return
    const streamUrl = targetUrl || urlRef.current
    destroy()
    setStatus('loading')
    setErrMsg('')
    retries.current = 0

    const go = () => {
      if (autoPlay) {
        v.play().catch(() => {
          // Try muted autoplay as fallback
          v.muted = true
          setMuted(true)
          v.play().catch(() => {})
        })
      }
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        // More aggressive buffering for live streams
        backBufferLength: 30,
        maxBufferLength: 20,
        maxMaxBufferLength: 40,
        maxBufferSize: 60 * 1000 * 1000,
        maxBufferHole: 0.5,
        // Faster recovery on stalls
        highBufferWatchdogPeriod: 3,
        nudgeOffset: 0.2,
        nudgeMaxRetry: 5,
        // Retry config
        manifestLoadingMaxRetry: 8,
        levelLoadingMaxRetry: 8,
        fragLoadingMaxRetry: 8,
        manifestLoadingRetryDelay: 1000,
        fragLoadingRetryDelay: 1000,
        levelLoadingRetryDelay: 1000,
        manifestLoadingMaxRetryTimeout: 16000,
        // Start from live edge
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 10,
        // CORS
        xhrSetup: (xhr) => {
          xhr.withCredentials = false
        },
      })
      hlsRef.current = hls
      hls.loadSource(streamUrl)
      hls.attachMedia(v)

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        retries.current = 0
        setStatus('ready')
        go()
      })

      hls.on(Hls.Events.FRAG_BUFFERED, () => {
        if (status !== 'ready') setStatus('ready')
      })

      hls.on(Hls.Events.ERROR, (_, d) => {
        if (!d.fatal) return

        if (d.type === Hls.ErrorTypes.NETWORK_ERROR && retries.current < 3) {
          retries.current++
          setStatus('loading')
          setTimeout(() => {
            hls.startLoad()
            go()
          }, 1500 * retries.current)
          return
        }

        if (retries.current < 5) {
          retries.current++
          setStatus('loading')
          // Try with CORS proxy on repeated failure
          const proxyStream = CORS_PROXY + encodeURIComponent(streamUrl)
          setTimeout(() => {
            destroy()
            init(proxyStream)
          }, 2000)
        } else {
          setStatus('error')
          setErrMsg('Stream unavailable. The channel may be offline or geo-restricted.')
        }
      })

    } else if (v.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS (iOS Safari)
      v.src = streamUrl
      v.onloadedmetadata = () => { setStatus('ready'); go() }
      v.onerror = () => {
        setStatus('error')
        setErrMsg('Stream unavailable on this device.')
      }
    } else {
      v.src = streamUrl
      setStatus('ready')
      go()
    }
  }, [autoPlay, destroy])

  useEffect(() => {
    urlRef.current = url
    retries.current = 0
    init(url)
    return destroy
  }, [url]) // eslint-disable-line

  useEffect(() => {
    const v = videoRef.current; if (!v) return
    const handlers = {
      play:    () => setPlaying(true),
      pause:   () => setPlaying(false),
      waiting: () => setStatus(s => s === 'ready' ? 'buffering' : s),
      playing: () => { setStatus('ready'); setPlaying(true) },
      stalled: () => {
        // Auto-recover from stall
        setTimeout(() => {
          if (v.paused && hlsRef.current) {
            hlsRef.current.startLoad()
            v.play().catch(() => {})
          }
        }, 3000)
      },
    } as Record<string, EventListener>
    Object.entries(handlers).forEach(([e, fn]) => v.addEventListener(e, fn))
    return () => { Object.entries(handlers).forEach(([e, fn]) => v.removeEventListener(e, fn)) }
  }, [])

  const nudge = () => {
    setCtrl(true); clearTimeout(hideRef.current)
    hideRef.current = setTimeout(() => { if (playing) setCtrl(false) }, 3500)
  }

  const togglePlay = () => { const v=videoRef.current; if(!v)return; playing?v.pause():v.play().catch(()=>{}) }
  const toggleMute = () => { const v=videoRef.current; if(!v)return; v.muted=!muted; setMuted(!muted) }
  const changeVol  = (e:React.ChangeEvent<HTMLInputElement>) => {
    const n = parseFloat(e.target.value)
    if(videoRef.current) videoRef.current.volume=n
    setVol(n); setMuted(n===0)
  }
  const toggleFs = async () => {
    if(!document.fullscreenElement){await contRef.current?.requestFullscreen();setFs(true)}
    else{await document.exitFullscreen();setFs(false)}
  }

  const isLoading = status==='loading'||status==='buffering'

  return (
    <div ref={contRef} className={`relative bg-black overflow-hidden ${className}`}
      onMouseMove={nudge} onMouseEnter={()=>setCtrl(true)}
      onMouseLeave={()=>{if(playing)setCtrl(false)}}
      style={{cursor:ctrl||!playing?'default':'none'}}>

      <video ref={videoRef} className="w-full h-full object-contain" playsInline onClick={togglePlay}/>

      {/* Loader */}
      <AnimatePresence>
        {isLoading && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            style={{background:'rgba(0,0,0,0.7)'}}>
            <Loader2 size={32} style={{color:'#E50914'}} className="animate-spin"/>
            <p style={{fontSize:'13px',color:'rgba(255,255,255,0.5)'}}>
              {status==='loading'?'Connecting to stream…':'Buffering…'}
            </p>
            {retries.current > 0 && (
              <p style={{fontSize:'11px',color:'rgba(255,255,255,0.3)'}}>
                Retry {retries.current}/5…
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {status==='error' && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="absolute inset-0 flex flex-col items-center justify-center gap-4"
            style={{background:'rgba(0,0,0,0.85)'}}>
            <AlertCircle size={40} style={{color:'rgba(255,255,255,0.2)'}} strokeWidth={1}/>
            <p style={{fontSize:'14px',color:'rgba(255,255,255,0.5)',textAlign:'center',maxWidth:'280px',lineHeight:1.6}}>{errMsg}</p>
            <button onClick={()=>{retries.current=0;init(url)}} className="btn-ghost-sm gap-2 text-sm">
              <RotateCcw size={14}/> Retry
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <AnimatePresence>
        {(ctrl||!playing) && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.18}}
            className="absolute inset-0 flex flex-col justify-between pointer-events-none"
            style={{background:'linear-gradient(to top,rgba(0,0,0,0.88) 0%,transparent 40%,rgba(0,0,0,0.25) 100%)'}}>

            {/* Top */}
            <div className="p-5 flex items-center gap-3 pointer-events-auto">
              {playing && <span className="live-pill"><span className="live-dot"/>LIVE</span>}
              <span style={{fontSize:'15px',fontWeight:700,color:'white',fontFamily:'"Barlow",sans-serif',letterSpacing:'0.02em'}}>{name}</span>
            </div>

            {/* Bottom */}
            <div className="p-5 pointer-events-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={togglePlay}
                  className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                  style={{background:'white', boxShadow:'0 0 0 2px rgba(255,255,255,0.3)'}}>
                  {playing
                    ? <Pause size={18} fill="#141414" style={{color:'#141414'}}/>
                    : <Play  size={18} fill="#141414" style={{color:'#141414',marginLeft:'2px'}}/>}
                </button>
                <div className="flex items-center gap-2 group/vol">
                  <button onClick={toggleMute} style={{color:'rgba(255,255,255,0.8)'}}>
                    {muted||vol===0?<VolumeX size={18}/>:<Volume2 size={18}/>}
                  </button>
                  <div style={{width:0,overflow:'hidden',transition:'width 0.2s'}}
                    className="group-hover/vol:!w-20">
                    <input type="range" min="0" max="1" step="0.05" value={muted?0:vol} onChange={changeVol}/>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button style={{color:'rgba(255,255,255,0.5)',padding:'8px'}}><Settings size={15}/></button>
                <button onClick={toggleFs} style={{color:'rgba(255,255,255,0.5)',padding:'8px'}}>
                  {fs?<Minimize size={15}/>:<Maximize size={15}/>}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
