import React, { createContext, useContext, useState, useCallback } from 'react'
import { CHANNELS, Channel } from '../channels'

export type { Channel }

interface State {
  channels: Channel[]
  current: Channel | null
  recent: Channel[]
  favorites: Channel[]
}

interface Ctx extends State {
  play: (ch: Channel) => void
  toggleFav: (id: string) => void
  addChannel: (ch: Omit<Channel, 'id'>) => void
  removeChannel: (id: string) => void
  importChannels: (list: Omit<Channel, 'id'>[]) => void
}

function loadExtra(): { custom: Channel[]; favorites: string[]; recent: Channel[] } {
  try { return JSON.parse(localStorage.getItem('axis4_extra') || '{"custom":[],"favorites":[],"recent":[]}') }
  catch { return { custom: [], favorites: [], recent: [] } }
}

function saveExtra(data: { custom: Channel[]; favorites: string[]; recent: Channel[] }) {
  try { localStorage.setItem('axis4_extra', JSON.stringify(data)) } catch {}
}

const AppCtx = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const extra = loadExtra()

  // Merge built-in + custom channels, apply saved favorites
  const [custom,    setCustom]    = useState<Channel[]>(extra.custom)
  const [favIds,    setFavIds]    = useState<Set<string>>(new Set(extra.favorites))
  const [recent,    setRecent]    = useState<Channel[]>(extra.recent)
  const [current,   setCurrent]   = useState<Channel | null>(null)

  const allChannels: Channel[] = [
    ...custom,
    ...CHANNELS,
  ].map(ch => ({ ...ch, favorite: favIds.has(ch.id) }))

  const favorites = allChannels.filter(ch => favIds.has(ch.id))

  const persist = useCallback((newCustom: Channel[], newFavIds: Set<string>, newRecent: Channel[]) => {
    saveExtra({ custom: newCustom, favorites: Array.from(newFavIds), recent: newRecent.slice(0, 30) })
  }, [])

  const play = useCallback((ch: Channel) => {
    const updated = { ...ch, lastPlayed: Date.now() }
    setCurrent(updated)
    setRecent(r => {
      const next = [updated, ...r.filter(c => c.id !== ch.id)].slice(0, 30)
      persist(custom, favIds, next)
      return next
    })
  }, [custom, favIds, persist])

  const toggleFav = useCallback((id: string) => {
    setFavIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      persist(custom, next, recent)
      return next
    })
  }, [custom, recent, persist])

  const addChannel = useCallback((ch: Omit<Channel, 'id'>) => {
    const newCh = { ...ch, id: `custom_${Date.now()}` }
    setCustom(prev => {
      const next = [newCh, ...prev]
      persist(next, favIds, recent)
      return next
    })
  }, [favIds, recent, persist])

  const removeChannel = useCallback((id: string) => {
    setCustom(prev => { const next = prev.filter(c => c.id !== id); persist(next, favIds, recent); return next })
    setRecent(r => { const next = r.filter(c => c.id !== id); persist(custom, favIds, next); return next })
  }, [custom, favIds, recent, persist])

  const importChannels = useCallback((list: Omit<Channel, 'id'>[]) => {
    const mapped: Channel[] = list.map((ch, i) => ({ ...ch, id: `import_${Date.now()}_${i}` }))
    setCustom(prev => { const next = [...mapped, ...prev]; persist(next, favIds, recent); return next })
  }, [favIds, recent, persist])

  return (
    <AppCtx.Provider value={{
      channels: allChannels, current, recent, favorites,
      play, toggleFav, addChannel, removeChannel, importChannels,
    }}>
      {children}
    </AppCtx.Provider>
  )
}

export function useApp() {
  const c = useContext(AppCtx)
  if (!c) throw new Error('useApp outside provider')
  return c
}
