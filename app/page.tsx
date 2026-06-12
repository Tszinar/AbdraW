'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/Navbar'
import MatchCard from '@/components/MatchCard'
import Leaderboard from '@/components/Leaderboard'
import PredictModal from '@/components/PredictModal'

export default function Home() {
  const [matches, setMatches] = useState([])
  const [user, setUser] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    // Получаем текущего пользователя
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    // Загружаем матчи
    loadMatches()

    // Real-time подписка на изменения матчей
    const channel = supabase
      .channel('matches_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'matches' },
        () => loadMatches()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function loadMatches() {
    const { data } = await supabase
      .from('matches')
      .select(`
        *,
        team1:team1_id (name, flag),
        team2:team2_id (name, flag),
        predictions(user_id, predicted_team1_score, predicted_team2_score)
      `)
      .order('match_date', { ascending: true })
    
    if (data) setMatches(data)
  }

  return (
    <main className="min-h-screen bg-[#0A0E1A]">
      <Navbar user={user} />
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Матчи */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-[#F5C518]">
              Расписание матчей
            </h2>
            {matches.map(match => (
              <MatchCard 
                key={match.id} 
                match={match} 
                userId={user?.id}
                onPredict={() => {}} 
              />
            ))}
          </div>
          
          {/* Таблица лидеров */}
          <div>
            <Leaderboard />
          </div>
        </div>
      </div>
      
      <PredictModal match={selectedMatch} onClose={() => {}} />
    </main>
  )
}
