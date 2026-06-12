'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function PredictModal({ match, onClose, onSave }) {
  const [score1, setScore1] = useState(0)
  const [score2, setScore2] = useState(0)
  const supabase = createClient()
  
  useEffect(() => {
    if (match?.userPrediction) {
      setScore1(match.userPrediction.predicted_team1_score)
      setScore2(match.userPrediction.predicted_team2_score)
    } else {
      setScore1(0)
      setScore2(0)
    }
  }, [match])
  
  async function handleSave() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      alert('Войдите в аккаунт')
      return
    }
    
    const { error } = await supabase
      .from('predictions')
      .upsert({
        user_id: user.id,
        match_id: match.id,
        predicted_team1_score: score1,
        predicted_team2_score: score2,
        updated_at: new Date()
      })
    
    if (!error) {
      onSave?.()
      onClose()
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-[#131929] border border-[#2a3550] rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold text-center mb-4">
          {match?.team1?.name} — {match?.team2?.name}
        </h3>
        
        <div className="flex items-center justify-center gap-4 mb-6">
          <input
            type="number"
            min="0"
            max="20"
            value={score1}
            onChange={(e) => setScore1(Number(e.target.value))}
            className="w-20 h-12 text-2xl text-center bg-[#1a2236] border border-[#2a3550] rounded text-[#F5C518] font-bold"
          />
          <span className="text-2xl text-gray-400">:</span>
          <input
            type="number"
            min="0"
            max="20"
            value={score2}
            onChange={(e) => setScore2(Number(e.target.value))}
            className="w-20 h-12 text-2xl text-center bg-[#1a2236] border border-[#2a3550] rounded text-[#F5C518] font-bold"
          />
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-[#2a3550] rounded hover:bg-[#1a2236] transition"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2 bg-[#F5C518] text-black rounded font-semibold hover:bg-[#e6b800] transition"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  )
}
