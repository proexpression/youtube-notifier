import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET() {
  try {
    const session = await getServerSession(authOptions) as any

    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch channel details
    const channelResponse = await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true',
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    )

    if (!channelResponse.ok) {
      throw new Error('Failed to fetch channel data')
    }

    const channelData = await channelResponse.json()
    
    if (!channelData.items || channelData.items.length === 0) {
      return NextResponse.json({ error: 'No channel found' }, { status: 404 })
    }

    const channel = channelData.items[0]
    const statistics = channel.statistics

    // Format the stats
    const stats = {
      channelName: channel.snippet.title,
      channelThumbnail: channel.snippet.thumbnails.default.url,
      subscribers: parseInt(statistics.subscriberCount),
      totalViews: parseInt(statistics.viewCount),
      totalVideos: parseInt(statistics.videoCount),
    }

    // Note: CTR (Click-Through Rate) requires YouTube Analytics API
    // which needs additional OAuth scopes. For now, we'll return basic stats.

    return NextResponse.json(stats)
  } catch (error: any) {
    console.error('Error fetching channel stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch channel statistics' },
      { status: 500 }
    )
  }
}
