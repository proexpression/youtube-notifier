'use client'

import { useSession, signIn, signOut } from "next-auth/react"
import { useEffect, useState } from "react"

interface ChannelStats {
  channelName: string
  channelThumbnail: string
  subscribers: number
  totalViews: number
  totalVideos: number
}

export default function Home() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<ChannelStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session) {
      fetchChannelStats()
    }
  }, [session])

  const fetchChannelStats = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/channel-stats')
      if (!response.ok) {
        throw new Error('Failed to fetch channel stats')
      }
      const data = await response.json()
      setStats(data)
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center">
      <p>Loading...</p>
    </div>
  }

  if (session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold mb-8">YouTube Notifier</h1>
        <p className="mb-4">Signed in as {session.user?.email}</p>
        <img
          src={session.user?.image || ''}
          alt="Profile"
          className="w-20 h-20 rounded-full mb-4"
        />

        {loading && <p className="text-gray-600 mb-4">Loading channel stats...</p>}
        
        {error && <p className="text-red-600 mb-4">Error: {error}</p>}

        {stats && (
          <div className="mt-8 w-full max-w-2xl">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <div className="flex items-center mb-6">
                <img
                  src={stats.channelThumbnail}
                  alt={stats.channelName}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{stats.channelName}</h2>
                  <p className="text-gray-600">Channel Statistics</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Subscribers</p>
                  <p className="text-2xl font-bold text-blue-600">{formatNumber(stats.subscribers)}</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Views</p>
                  <p className="text-2xl font-bold text-green-600">{formatNumber(stats.totalViews)}</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Videos</p>
                  <p className="text-2xl font-bold text-purple-600">{formatNumber(stats.totalVideos)}</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">📊 Note about CTR</p>
                <p className="text-sm text-gray-700">
                  Click-Through Rate (CTR) requires YouTube Analytics API with additional OAuth scopes. 
                  This feature can be added in future updates.
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => signOut()}
          className="mt-8 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign out
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">YouTube Notifier</h1>
      <p className="mb-8 text-center max-w-md">
        Monitor your YouTube channel for limited monetization alerts and get notified instantly.
      </p>
      <button
        onClick={() => signIn('google')}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Sign in with Google
      </button>
    </div>
  )
}
