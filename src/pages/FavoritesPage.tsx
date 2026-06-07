import { useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useApp } from '../context/AppContext'
import ChannelCard from '../components/ChannelCard'

export default function FavoritesPage() {
  const { favorites } = useApp()
  return (
    <div style={{paddingTop:'88px', minHeight:'100vh'}}>
      <div className="px-[4%] pb-12">
        <div className="flex items-center gap-3 mb-8">
          <Heart size={28} fill="#E50914" style={{color:'#E50914'}}/>
          <h1 style={{fontFamily:'"Barlow",sans-serif',fontSize:'2.5rem',fontWeight:900,color:'white'}}>My List</h1>
        </div>
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Heart size={60} style={{color:'rgba(255,255,255,0.1)'}} strokeWidth={1}/>
            <p style={{fontSize:'18px',fontWeight:600,color:'rgba(255,255,255,0.4)'}}>Your list is empty</p>
            <p style={{fontSize:'14px',color:'rgba(255,255,255,0.25)'}}>Hover a channel and click the heart to save it here.</p>
          </div>
        ) : (
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(178px,1fr))', gap:'4px'}}>
            {favorites.map(ch => <ChannelCard key={ch.id} channel={ch} height={100}/>)}
          </div>
        )}
      </div>
    </div>
  )
}
