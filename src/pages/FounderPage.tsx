import { motion } from 'framer-motion'
import { ExternalLink, Instagram, Facebook, Linkedin, Github, Phone, ArrowUpRight, Code2, Palette, Camera, Video, Globe, MapPin } from 'lucide-react'

const SOCIALS = [
  { icon: Instagram, label: 'Instagram',      href: 'https://www.instagram.com/utshhho',               color: '#E1306C' },
  { icon: Facebook,  label: 'Facebook',       href: 'https://www.facebook.com/aditya.barma.133889',    color: '#1877F2' },
  { icon: Linkedin,  label: 'LinkedIn',       href: 'https://www.linkedin.com/in/aditya-barma-805a46253', color: '#0A66C2' },
  { icon: Github,    label: 'GitHub',         href: 'https://github.com/utsho99',                       color: '#e5e5e5' },
  { icon: Phone,     label: '+880 1777-206392', href: 'tel:+8801777206392',                             color: '#DC143C' },
]

const VENTURES = [
  { name:'AXIS TV',       tag:'Streaming Platform', color:'#DC143C', desc:'Premium IPTV streaming — built around the experience of watching beautifully.' },
  { name:'Aether Works',  tag:'Digital Studio',     color:'#7C3AED', desc:'A studio crafting purposeful web experiences and products built to last.' },
  { name:'Vidraze Studio',tag:'Creative Design',    color:'#DB2777', desc:'Visual identity, motion, and graphic design that makes things extraordinary.' },
]

const SKILLS = [
  { icon: Code2,   label: 'Full-Stack Dev' },
  { icon: Palette, label: 'UI/UX Design'   },
  { icon: Camera,  label: 'Photography'    },
  { icon: Video,   label: 'Video Editing'  },
  { icon: Globe,   label: 'Graphic Design' },
]

export default function FounderPage() {
  return (
    <div style={{ paddingTop:'80px', minHeight:'100vh', position:'relative', overflow:'hidden' }}>

      {/* Crimson orbs */}
      <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-20%',right:'-15%',width:'70vw',height:'70vw',borderRadius:'50%',
          background:'radial-gradient(circle,#DC143C 0%,#7B0000 45%,transparent 72%)',opacity:0.3,filter:'blur(4px)'}}/>
        <div style={{position:'absolute',bottom:'-25%',left:'-20%',width:'75vw',height:'75vw',borderRadius:'50%',
          background:'radial-gradient(circle,#DC143C 0%,#6B0000 50%,transparent 72%)',opacity:0.2,filter:'blur(6px)'}}/>
        <div style={{position:'absolute',inset:0,
          background:'radial-gradient(ellipse at center,rgba(10,0,0,0.6) 0%,rgba(5,0,0,0.85) 100%)'}}/>
      </div>

      <div style={{maxWidth:'680px',margin:'0 auto',padding:'0 16px 120px',position:'relative',zIndex:1}}>

        {/* ── HERO GLASS CARD ── */}
        <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.6,ease:[0.16,1,0.3,1]}}
          style={{
            background:'linear-gradient(135deg,rgba(255,255,255,0.07) 0%,rgba(180,0,20,0.08) 100%)',
            border:'1px solid rgba(255,255,255,0.12)',
            borderRadius:'20px', padding:'clamp(20px,5vw,40px)',
            backdropFilter:'blur(28px)', WebkitBackdropFilter:'blur(28px)',
            boxShadow:'0 8px 48px rgba(0,0,0,0.7),inset 0 1px 0 rgba(255,255,255,0.09)',
            marginBottom:'16px', position:'relative', overflow:'hidden',
          }}>
          <div style={{position:'absolute',top:0,right:0,width:'55%',height:'100%',
            background:'radial-gradient(ellipse at top right,rgba(220,20,60,0.16) 0%,transparent 65%)',
            pointerEvents:'none'}}/>

          {/* Top meta */}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'24px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
              <MapPin size={11} style={{color:'rgba(220,20,60,0.6)'}}/>
              <span style={{fontSize:'11px',color:'rgba(255,255,255,0.35)',letterSpacing:'0.04em'}}>Sylhet, Bangladesh</span>
            </div>
            <span style={{fontSize:'10px',fontStyle:'italic',color:'rgba(255,255,255,0.3)',letterSpacing:'0.06em'}}>Let's create</span>
          </div>

          {/* Role badge */}
          <div style={{display:'inline-flex',alignItems:'center',gap:'6px',
            background:'rgba(220,20,60,0.12)',border:'1px solid rgba(220,20,60,0.25)',
            borderRadius:'100px',padding:'4px 12px',marginBottom:'16px'}}>
            <span style={{fontSize:'10px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.14em',color:'rgba(220,20,60,0.8)'}}>
              Dev / Founder
            </span>
          </div>

          {/* Name */}
          <h1 style={{
            fontFamily:'"Barlow",sans-serif',
            fontSize:'clamp(2.2rem,8vw,4.5rem)',
            fontWeight:900,lineHeight:0.92,letterSpacing:'-0.02em',marginBottom:'14px',
          }}>
            <span style={{color:'white'}}>Hello,<br/>I'm </span>
            <span style={{color:'#DC143C'}}>Aditya</span>
            <br/>
            <span style={{color:'rgba(255,255,255,0.25)',fontStyle:'italic',fontSize:'0.85em'}}>Barma Utsho.</span>
          </h1>

          <p style={{fontSize:'clamp(14px,3.5vw,17px)',color:'rgba(255,255,255,0.4)',marginBottom:'20px',fontWeight:300,lineHeight:1.5}}>
            Designer. Developer. Founder.
          </p>

          {/* Skills */}
          <div style={{display:'flex',flexWrap:'wrap',gap:'7px',marginBottom:'24px'}}>
            {SKILLS.map(({icon:Icon,label})=>(
              <span key={label} style={{
                display:'inline-flex',alignItems:'center',gap:'5px',
                background:'rgba(220,20,60,0.1)',border:'1px solid rgba(220,20,60,0.22)',
                borderRadius:'100px',padding:'5px 12px',
                fontSize:'11px',fontWeight:600,color:'rgba(255,255,255,0.65)',
              }}>
                <Icon size={10} style={{color:'#DC143C'}}/>{label}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
            <a href="https://adityabarma.netlify.app/" target="_blank" rel="noopener noreferrer"
              style={{
                display:'inline-flex',alignItems:'center',gap:'7px',
                background:'#DC143C',color:'white',fontWeight:700,
                fontSize:'clamp(13px,3.5vw,15px)',padding:'10px 22px',
                borderRadius:'100px',textDecoration:'none',
                boxShadow:'0 4px 20px rgba(220,20,60,0.45)',
              }}>
              Portfolio <ExternalLink size={12}/>
            </a>
            <a href="tel:+8801777206392"
              style={{
                display:'inline-flex',alignItems:'center',gap:'7px',
                background:'rgba(255,255,255,0.07)',color:'rgba(255,255,255,0.7)',
                fontWeight:600,fontSize:'clamp(13px,3.5vw,15px)',padding:'10px 20px',
                borderRadius:'100px',textDecoration:'none',
                border:'1px solid rgba(255,255,255,0.12)',
              }}>
              Contact
            </a>
          </div>

          <p style={{position:'absolute',bottom:'14px',right:'18px',fontSize:'10px',color:'rgba(255,255,255,0.12)',letterSpacing:'0.04em'}}>
            @utshhho
          </p>
        </motion.div>

        {/* ── SOCIALS ── */}
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.12,duration:0.5}}
          style={{
            background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',
            borderRadius:'16px',padding:'18px 20px',backdropFilter:'blur(20px)',
            marginBottom:'16px',
          }}>
          <p style={{fontSize:'9px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.22em',color:'rgba(255,255,255,0.22)',marginBottom:'12px'}}>Connect</p>
          {/* Grid on mobile so they're bigger to tap */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
            {SOCIALS.map(({icon:Icon,label,href,color})=>(
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                style={{
                  display:'flex',alignItems:'center',gap:'9px',
                  background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',
                  borderRadius:'12px',padding:'10px 14px',
                  fontSize:'12px',fontWeight:500,color:'rgba(255,255,255,0.65)',
                  textDecoration:'none',
                }}>
                <Icon size={15} style={{color,flexShrink:0}}/>{label}
              </a>
            ))}
          </div>
        </motion.div>

        {/* ── VENTURES ── */}
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2}}>
          <p style={{fontSize:'9px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.22em',color:'rgba(255,255,255,0.22)',marginBottom:'12px',paddingLeft:'2px'}}>Ventures</p>
          <div style={{display:'flex',flexDirection:'column',gap:'10px',marginBottom:'16px'}}>
            {VENTURES.map(({name,tag,color,desc},i)=>(
              <motion.div key={name}
                initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}}
                transition={{delay:0.25+i*0.08,duration:0.45,ease:[0.16,1,0.3,1]}}
                style={{
                  background:'linear-gradient(135deg,rgba(255,255,255,0.05) 0%,rgba(220,20,60,0.03) 100%)',
                  border:'1px solid rgba(255,255,255,0.07)',
                  borderRadius:'14px',padding:'18px 20px',backdropFilter:'blur(16px)',
                }}>
                <div style={{height:'2px',background:`linear-gradient(to right,${color},transparent)`,borderRadius:'2px',marginBottom:'12px',width:'40px'}}/>
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'12px'}}>
                  <div style={{flex:1,minWidth:0}}>
                    <h3 style={{fontFamily:'"Barlow",sans-serif',fontSize:'18px',fontWeight:800,color:'white',marginBottom:'6px'}}>{name}</h3>
                    <span style={{fontSize:'9px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.12em',
                      color,background:`${color}18`,padding:'3px 9px',borderRadius:'100px',border:`1px solid ${color}30`}}>{tag}</span>
                    <p style={{fontSize:'12px',color:'rgba(255,255,255,0.38)',marginTop:'10px',lineHeight:1.6}}>{desc}</p>
                  </div>
                  <ArrowUpRight size={15} style={{color:'rgba(255,255,255,0.15)',flexShrink:0,marginTop:'2px'}}/>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── PHILOSOPHY ── */}
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.5,duration:0.6}}
          style={{
            background:'linear-gradient(135deg,rgba(220,20,60,0.09) 0%,rgba(255,255,255,0.04) 100%)',
            border:'1px solid rgba(220,20,60,0.18)',borderRadius:'16px',
            padding:'clamp(18px,4vw,32px)',backdropFilter:'blur(24px)',
          }}>
          <p style={{fontSize:'9px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.22em',color:'rgba(220,20,60,0.55)',marginBottom:'16px'}}>Philosophy</p>
          <blockquote style={{
            fontFamily:'"Barlow",sans-serif',
            fontSize:'clamp(1.2rem,4.5vw,1.8rem)',
            fontWeight:800,color:'white',lineHeight:1.2,marginBottom:'14px',
          }}>
            "Most things are designed to be good enough.{' '}
            <span style={{color:'rgba(255,255,255,0.28)',fontStyle:'italic'}}>I build things to be remarkable."</span>
          </blockquote>
          <p style={{fontSize:'13px',color:'rgba(255,255,255,0.35)',lineHeight:1.75}}>
            Every project starts with one question: what would make this truly unforgettable?
            AXIS is built because I wanted a streaming tool that respects the viewer.
          </p>
        </motion.div>

      </div>
    </div>
  )
}
