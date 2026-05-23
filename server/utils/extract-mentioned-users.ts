export function extractMentionedUsers(content: string): string[] | null {
  const mentions = content.match(/(?:^|\s)@(\w+)/g)
  return mentions?.map(m => m.slice(1)) || null
}
