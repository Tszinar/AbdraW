'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([])
  const supabase = createClient()

  useEffect(() => {
    loadLeaders()
  }, [])

  async function loadLeaders() {
    const { data } = await supabase
      .from('profiles')
      .select('nickname, total_points')
      .order('total_points', { ascending: false })
      .limit(10)
    
    if (data) setLeaders(data)
  }

  return (
    <div className="bg-[#131929] border border-[#2a3550] rounded-lg p-4">
      <h3 className="text-[#F5C518] font-bold mb-3">🏆 Таблица лидеров</h3>
      <div className="space-y-2">
        {leaders.map((user, i) => (
          <div key={user.nickname} className="flex justify-between items-center text-sm">
            <span className="text-gray-400">{i + 1}. {user.nickname}</span>
            <span className="text-[#F5C518] font-bold">{user.total_points} pts</span>
          </div>
        ))}
      </div>
    </div>
  )
}
