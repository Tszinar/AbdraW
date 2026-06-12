'use client'

import Link from 'next/link'

export default function Navbar({ user }) {
  return (
    <nav className="bg-[#0d1526] border-b border-[#2a3550] px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-[#F5C518] font-bold text-xl">
          ⚽ЧМ2026
        </Link>
        
        <div className="flex gap-4">
          <Link href="/" className="text-gray-300 hover:text-white">Главная</Link>
          <Link href="/matches" className="text-gray-300 hover:text-white">Матчи</Link>
          <Link href="/groups" className="text-gray-300 hover:text-white">Группы</Link>
          <Link href="/leaderboard" className="text-gray-300 hover:text-white">Лидеры</Link>
        </div>
        
        <div>
          {user ? (
            <span className="text-white">{user.email}</span>
          ) : (
            <button className="bg-[#F5C518] text-black px-4 py-1 rounded">
              Войти
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
