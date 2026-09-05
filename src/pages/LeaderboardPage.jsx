import { useState, useEffect } from 'react'

const medalColors = ['bg-amber-400', 'bg-gray-300', 'bg-amber-700']
const medalIcons = ['🥇', '🥈', '🥉']

function ScoreBar({ value, max, color }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export default function LeaderboardPage() {
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('student')

  useEffect(() => {
    let isMounted = true

    async function loadScores() {
      try {
        const response = await fetch('/api/scores')
        if (!response.ok) throw new Error('Failed to fetch scores')
        const data = await response.json()
        if (isMounted) setScores(data)
      } catch {
        // Keep the last successful ranking visible while the next poll retries.
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadScores()
    const intervalId = window.setInterval(loadScores, 10_000)

    return () => {
      isMounted = false
      window.clearInterval(intervalId)
    }
  }, [])

  function withRank(list, key) {
    let rank = 0
    return list.map((s, i, arr) => {
      const prev = arr[i - 1]
      if (!prev || s[key] !== prev[key]) rank = rank + 1
      return { ...s, displayRank: rank }
    })
  }

  const studentRanking = withRank(
    [...scores].filter(s => s.studentScore > 0).sort((a, b) => b.studentScore - a.studentScore),
    'studentScore'
  )
  const instructorRanking = withRank(
    [...scores].filter(s => s.instructorScore > 0).sort((a, b) => b.instructorScore - a.instructorScore),
    'instructorScore'
  )
  const ranking = tab === 'student' ? studentRanking : instructorRanking
  const maxScore = Math.max(...(ranking.length ? ranking.map(s => tab === 'student' ? s.studentScore : s.instructorScore) : [1]), 1)

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-black text-wu-black mb-3">積分排行榜</h2>
          <p className="text-gray-500">Leaderboard</p>
        </div>

        <div className="flex justify-center gap-2 mb-10">
          <button
            onClick={() => setTab('student')}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              tab === 'student'
                ? 'bg-wu-blue text-white shadow-lg shadow-wu-blue/30 scale-105'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            🎓 學員排行
          </button>
          <button
            onClick={() => setTab('instructor')}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              tab === 'instructor'
                ? 'bg-wu-yellow text-wu-black shadow-lg shadow-wu-yellow/30 scale-105'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            👨‍🏫 講師排行
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-wu-blue border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-500 mt-4">載入中...</p>
          </div>
        ) : ranking.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <p className="text-5xl mb-4">📊</p>
            <p className="text-gray-500">{tab === 'student' ? '尚無學員積分資料' : '尚無講師積分資料'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {ranking.map((person, idx) => {
              const score = tab === 'student' ? person.studentScore : person.instructorScore
              const r = person.displayRank
              return (
                <div
                  key={person.name}
                  className={`relative bg-white rounded-2xl p-5 transition-all hover:shadow-md ${
                    r <= 3 ? 'shadow-lg ring-2 ring-offset-2 ' + (
                      r === 1 ? 'ring-amber-400 shadow-amber-100' :
                      r === 2 ? 'ring-gray-300 shadow-gray-100' :
                      'ring-amber-700 shadow-amber-100'
                    ) : 'shadow-sm border border-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-10 text-center">
                      {r <= 3 ? (
                        <span className="text-2xl">{['🥇','🥈','🥉'][r - 1]}</span>
                      ) : (
                        <span className="text-lg font-bold text-gray-400">#{r}</span>
                      )}
                    </div>

                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-wu-blue to-wu-yellow flex items-center justify-center text-white font-bold text-sm shadow-sm">
                      {person.name.charAt(0)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-bold text-wu-black truncate">{person.name}</p>
                        <p className={`font-black text-lg ${r === 1 ? 'text-amber-500' : r === 2 ? 'text-gray-500' : r === 3 ? 'text-amber-800' : 'text-wu-blue'}`}>
                          {score}
                        </p>
                      </div>
                      <ScoreBar value={score} max={maxScore} color={r === 1 ? 'bg-amber-400' : 'bg-wu-blue'} />
                      <div className="flex gap-4 mt-1.5 text-xs text-gray-400">
                        <span>學員分 {person.studentScore}</span>
                        <span>講師分 {person.instructorScore}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-8">
          *學院管理人員不參與積分排名
        </p>
      </div>
    </section>
  )
}
