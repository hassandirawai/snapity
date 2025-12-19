export function extractHashtags(content: string): string[] | null {
  const hashtags = content.match(/#\w+/g)
  return hashtags?.map(h => h.slice(1)) || null
}
