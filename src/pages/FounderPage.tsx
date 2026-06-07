import { motion } from 'framer-motion'
import { ExternalLink, Instagram, Facebook, Linkedin, Github, Phone, ArrowUpRight, Code2, Palette, Camera, Video, Globe } from 'lucide-react'

const SOCIALS = [
  { icon: Instagram,  label: 'Instagram',  href: 'https://www.instagram.com/utshhho',          color: '#E1306C' },
  { icon: Facebook,   label: 'Facebook',   href: 'https://www.facebook.com/aditya.barma.133889', color: '#1877F2' },
  { icon: Linkedin,   label: 'LinkedIn',   href: 'https://www.linkedin.com/in/aditya-barma-805a46253', color: '#0A66C2' },
  { icon: Github,     label: 'GitHub',     href: 'https://github.com/utsho99',                   color: '#fff' },
  { icon: Phone,      label: '+880 1777-206392', href: 'tel:+8801777206392',                     color: '#DC143C' },
]

const VENTURES = [
  { name:'AXIS',          tag:'Streaming Platform', color:'#DC143C', desc:'A premium streaming workspace built around the experience of watching beautifully.' },
  { name:'Aether Works',  tag:'Digital Studio',     color:'#7C3AED', desc:'A digital studio crafting purposeful web experiences and products built to last.' },
  { name:'Vidraze Studio',tag:'Creative Design',    color:'#DC143C', desc:'A creative practice focused on visual identity, motion, and making things extraordinary.' },
]

const SKILLS = [
  { icon: Code2,   label: 'Full-Stack Dev' },
  { icon: Palette, label: 'UI/UX Design' },
  { icon: Camera,  label: 'Photography' },
  { icon: Video,   label: 'Video Editing' },
  { icon: Globe,   label: 'Graphic Design' },
]

export default function FounderPage() {
  return (
    <div style={{ paddingTop: '88px', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>

      {/* ── Crimson atmospheric blobs (like reference image) ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {/* Top-right large orb */}
        <div style={{
          position: 'absolute', top: '-15%', right: '-10%',
          width: '55vw', height: '55vw', borderRadius: '50%',
          background: 'radial-gradient(circle, #DC143C 0%, #8B0000 45%, transparent 75%)',
          opacity: 0.35, filter: 'blur(2px)',
        }} />
        {/* Bottom-left orb */}
        <div style={{
          position: 'absolute', bottom: '-20%', left: '-15%',
          width: '60vw', height: '60vw', borderRadius: '50%',
          background: 'radial-gradient(circle, #DC143C 0%, #6B0000 50%, transparent 75%)',
          opacity: 0.28, filter: 'blur(4px)',
        }} />
        {/* Center soft glow */}
        <div style={{
          position: 'absolute', top: '30%', left: '20%',
          width: '40vw', height: '30vw', borderRadius: '50%',
          background: 'radial-gradient(circle, #B22222 0%, transparent 70%)',
          opacity: 0.12,
        }} />
        {/* Dark overlay to preserve readability */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(10,0,0,0.55) 0%, rgba(5,0,0,0.8) 100%)',
        }} />
      </div>

      {/* ── Main content ── */}
      <div className="px-[4%] pb-24" style={{ maxWidth: '860px', position: 'relative', zIndex: 1 }}>

        {/* ── GLASS HERO CARD — inspired by reference image ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(180,0,20,0.08) 50%, rgba(255,255,255,0.03) 100%)',
            border: '1px solid rgba(255,255,255,0.13)',
            borderRadius: '24px',
            padding: 'clamp(28px, 5vw, 52px)',
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
            boxShadow: '0 8px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.1)',
            marginBottom: '24px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Card inner glow */}
          <div style={{
            position: 'absolute', top: 0, right: 0, width: '60%', height: '100%',
            background: 'radial-gradient(ellipse at top right, rgba(220,20,60,0.18) 0%, transparent 65%)',
            pointerEvents: 'none',
          }} />

          {/* Top bar like reference image */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.04em', lineHeight: 1.3 }}>Dev / Founder</p>
              <p style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.04em' }}>Sylhet, Bangladesh</p>
            </div>
            <p style={{ fontSize: '11px', fontStyle: 'italic', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em' }}>Let's create</p>
          </div>

          {/* Name */}
          <h1 style={{
            fontFamily: '"Barlow", sans-serif',
            fontSize: 'clamp(2.6rem, 8vw, 5.5rem)',
            fontWeight: 900, lineHeight: 0.92,
            letterSpacing: '-0.02em',
            marginBottom: '16px', position: 'relative',
          }}>
            <span style={{ color: 'white' }}>Hello,<br />I'm </span>
            <span style={{ color: '#DC143C' }}>Aditya</span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}> Barma.</span>
          </h1>

          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.45)', marginBottom: '28px', fontWeight: 300, letterSpacing: '0.02em' }}>
            Designer. Developer. Founder.
          </p>

          {/* Skill tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
            {SKILLS.map(({ icon: Icon, label }) => (
              <span key={label} style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: 'rgba(220,20,60,0.12)',
                border: '1px solid rgba(220,20,60,0.25)',
                borderRadius: '100px', padding: '6px 14px',
                fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(8px)',
              }}>
                <Icon size={11} style={{ color: '#DC143C' }} />
                {label}
              </span>
            ))}
          </div>

          {/* CTA row */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a href="https://adityabarma.netlify.app/" target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#DC143C', color: 'white',
                fontWeight: 700, fontSize: '14px', padding: '11px 24px',
                borderRadius: '100px', textDecoration: 'none',
                boxShadow: '0 4px 24px rgba(220,20,60,0.5)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#B91031'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#DC143C'; (e.currentTarget as HTMLElement).style.transform = 'none' }}
            >
              Portfolio <ExternalLink size={13} />
            </a>
            <a href="mailto:hello@aditya.design"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.75)',
                fontWeight: 600, fontSize: '14px', padding: '11px 24px',
                borderRadius: '100px', textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(8px)',
              }}
            >
              Get in touch
            </a>
          </div>

          {/* Handle watermark */}
          <p style={{ position: 'absolute', bottom: '20px', right: '24px', fontSize: '11px', color: 'rgba(255,255,255,0.15)', fontWeight: 500, letterSpacing: '0.04em' }}>
            @utshhho
          </p>
        </motion.div>

        {/* ── SOCIALS GLASS STRIP ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '20px 24px',
            backdropFilter: 'blur(24px)',
            display: 'flex', flexWrap: 'wrap', gap: '10px',
            marginBottom: '24px',
          }}
        >
          <p style={{ width: '100%', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)', marginBottom: '4px' }}>Connect</p>
          {SOCIALS.map(({ icon: Icon, label, href, color }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: '100px', padding: '8px 16px',
                fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.6)',
                textDecoration: 'none', transition: 'all 0.2s',
                backdropFilter: 'blur(8px)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = color + '60'
                el.style.color = 'white'
                el.style.background = color + '18'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'rgba(255,255,255,0.09)'
                el.style.color = 'rgba(255,255,255,0.6)'
                el.style.background = 'rgba(255,255,255,0.05)'
              }}
            >
              <Icon size={13} style={{ color }} />
              {label}
            </a>
          ))}
        </motion.div>

        {/* ── VENTURES ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)', marginBottom: '14px' }}>Ventures</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {VENTURES.map(({ name, tag, color, desc }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(220,20,60,0.04) 100%)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '14px', padding: '22px 24px',
                  backdropFilter: 'blur(20px)',
                  cursor: 'pointer', transition: 'border-color 0.2s, transform 0.2s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = color + '45'
                  ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'
                  ;(e.currentTarget as HTMLElement).style.transform = 'none'
                }}
              >
                <div style={{ height: '2px', background: `linear-gradient(to right, ${color}, transparent)`, borderRadius: '2px', marginBottom: '14px', width: '48px' }} />
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontFamily: '"Barlow", sans-serif', fontSize: '20px', fontWeight: 800, color: 'white', marginBottom: '6px' }}>{name}</h3>
                    <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color, background: `${color}18`, padding: '3px 10px', borderRadius: '100px', border: `1px solid ${color}30` }}>{tag}</span>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '10px', lineHeight: 1.65 }}>{desc}</p>
                  </div>
                  <ArrowUpRight size={16} style={{ color: 'rgba(255,255,255,0.18)', flexShrink: 0, marginTop: '4px' }} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── PHILOSOPHY GLASS CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: 'linear-gradient(135deg, rgba(220,20,60,0.1) 0%, rgba(255,255,255,0.04) 100%)',
            border: '1px solid rgba(220,20,60,0.2)',
            borderRadius: '20px',
            padding: 'clamp(24px, 4vw, 40px)',
            backdropFilter: 'blur(28px)',
            boxShadow: '0 0 60px rgba(220,20,60,0.08), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(220,20,60,0.6)', marginBottom: '20px' }}>Philosophy</p>
          <blockquote style={{
            fontFamily: '"Barlow", sans-serif',
            fontSize: 'clamp(1.4rem, 3vw, 2rem)',
            fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: '20px',
          }}>
            "Most things are designed to be good enough.{' '}
            <span style={{ color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>I build things to be remarkable."</span>
          </blockquote>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.8, maxWidth: '520px' }}>
            Every project starts with one question: what would make this truly unforgettable?
            AXIS is built because I wanted a streaming tool that respects the viewer — one that feels
            as considered as the content it presents.
          </p>
        </motion.div>

      </div>
    </div>
  )
}
