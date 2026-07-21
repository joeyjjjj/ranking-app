import type { RankingRecord } from '../types/rankingRecord'

const storageKey = 'ranking-app.records'

function readRecords(): RankingRecord[] {
  const raw = localStorage.getItem(storageKey)
  if (!raw) {
    return []
  }
  try {
    const parsed = JSON.parse(raw) as RankingRecord[]
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed
  } catch {
    return []
  }
}

function writeRecords(records: RankingRecord[]) {
  localStorage.setItem(storageKey, JSON.stringify(records))
}

export function listRankingRecords(): RankingRecord[] {
  return readRecords().sort(
    (left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt),
  )
}

export function getRankingRecord(id: string): RankingRecord | null {
  return readRecords().find((record) => record.id === id) ?? null
}

export function createRankingRecord(songIds: string[]): RankingRecord {
  const record: RankingRecord = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    songIds,
  }
  writeRecords([record, ...readRecords()])
  return record
}

export function deleteRankingRecord(id: string) {
  writeRecords(readRecords().filter((record) => record.id !== id))
}
