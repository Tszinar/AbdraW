'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function MatchCard({ match, userId, onPredict }) {
  const [showModal, setShowModal] = useState(false)
  const userPrediction = match.predictions?.find(p => p.user_id === userId)
  
  const isMatchOpen = new Date(match.match_date) > new Date()
  const isCompleted = match.status === 'completed'
  
  return (
    <div className="bg-[#131929] border border-[#2a3550] rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 text-center">
          <div className="text-3xl">{match.team1?.flag}</div>
          <div className="text-sm font-medium">{match.team1?.name}</div>
        </div>
        
        <div className="px-4">
          {isCompleted ? (
            <div className="text-xl font-bold text-[#F5C518]">
              {match.team1_score} : {match.team2_score}
            </div>
          ) : (
            <div className="text-sm text-gray-400">vs</div>
          )}
        </div>
        
        <div className="flex-1 text-center">
          <div className="text-3xl">{match.team2?.flag}</div>
          <div className="text-sm font-medium">{match.team2?.name}</div>
        </div>
      </div>
      
      <div className="mt-3 flex items-center justify-between text-xs">
        <div className="text-gray-400">
          {new Date(match.match_date).toLocaleString('ru-RU')}
        </div>
        
        {userPrediction && !isCompleted && (
          <div className="bg-[#1a2236] px-2 py-1 rounded">
            Ваш прогноз: {userPrediction.predicted_team1_score} : {userPrediction.predicted_team2_score}
          </div>
        )}
        
        {isMatchOpen && !isCompleted && userId && (
          <button
            onClick={() => onPredict(match)}
            className="bg-[#F5C518] text-black px-3 py-1 rounded text-xs font-semibold hover:bg-[#e6b800] transition"
          >
            {userPrediction ? 'Изменить' : 'Прогноз'}
          </button>
        )}
      </div>
    </div>
  )
}
