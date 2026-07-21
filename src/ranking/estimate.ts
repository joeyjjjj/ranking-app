import { rankingConfig } from '../data/config'

export function estimateMergeComparisons(itemCount: number): number {
  if (itemCount <= 1) {
    return 0
  }
  return Math.ceil(itemCount * Math.log2(itemCount) - itemCount + 1)
}

export function estimateTopKComparisons(itemCount: number, topK = rankingConfig.topK): number {
  const limitedTopK = Math.min(topK, itemCount)
  if (itemCount <= limitedTopK) {
    return estimateMergeComparisons(itemCount)
  }

  const initialSort = estimateMergeComparisons(limitedTopK)
  const outsiderCount = itemCount - limitedTopK
  const expectedInsertions = limitedTopK * Math.log(itemCount / limitedTopK)
  const insertCost = Math.ceil(Math.log2(limitedTopK))
  return Math.ceil(initialSort + outsiderCount + expectedInsertions * insertCost)
}

export function resolvePlannedComparisons(itemCount: number): number {
  return estimateTopKComparisons(itemCount, rankingConfig.topK)
}
