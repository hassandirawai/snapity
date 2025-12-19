import { formatDate, formatDistanceToNowStrict } from 'date-fns'

export function formatNumber(n: number): string {
  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 0,
    compactDisplay: 'long',
  }).format(n)
}

export function formatRelativeDate(from: Date): string {
  const currentDate = new Date()
  const oldestComputerTime = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

  if (currentDate.getTime() - from.getTime() < oldestComputerTime) {
    return formatDistanceToNowStrict(from, {
      addSuffix: true,
    })
  }
  else {
    return formatDate(from, 'MMM d, yyyy')
  }
}

// Helper function to split content into text and hashtags
export function parseContent(content: string) {
  const regex = /#\w+/g
  const result: { text: string, isTag: boolean }[] = []

  let lastIndex = 0
  let match = regex.exec(content)

  while (match !== null) {
    if (match.index > lastIndex) {
      result.push({
        text: content.slice(lastIndex, match.index),
        isTag: false,
      })
    }

    result.push({ text: match[0], isTag: true })
    lastIndex = regex.lastIndex
    match = regex.exec(content)
  }

  if (lastIndex < content.length) {
    result.push({ text: content.slice(lastIndex), isTag: false })
  }

  return result
}
