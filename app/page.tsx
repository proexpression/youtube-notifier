'use client'

import { useSession, signIn, signOut } from "next-auth/react"

export default function Home() {
  const { data: session, status } = useSession()

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
        <button
          onClick={() => signOut()}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
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

