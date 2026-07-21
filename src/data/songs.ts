import { type GroupId } from './config'
import songsData from './songs.json'
import youtubeIds from './youtubeIds.json'
import type { Song, SongScope } from '../types/song'

const youtubeIdBySongId = youtubeIds as Record<string, string>

const allSongs: Song[] = (songsData.songs as Song[]).map((song) => {
  const youtubeId = youtubeIdBySongId[song.id]
  if (!youtubeId) {
    return song
  }
  return { ...song, youtubeId }
})

export function filterSongs(groupIds: GroupId[], scope: SongScope): Song[] {
  return allSongs.filter((song) => {
    if (!groupIds.includes(song.groupId)) {
      return false
    }
    if (scope === 'titleOnly' && !song.isTitle) {
      return false
    }
    return true
  })
}

export function countSongs(groupIds: GroupId[], scope: SongScope): number {
  return filterSongs(groupIds, scope).length
}
