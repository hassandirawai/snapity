export function extractMentionedUsers(
  node: any,
  mentions: string[] = [],
): string[] {
  if (node.type === 'mention') {
    const mentionId = node.attrs?.id

    if (mentionId) {
      mentions.push(mentionId)
    }
  }

  if (Array.isArray(node.content)) {
    for (const child of node.content) {
      extractMentionedUsers(child, mentions)
    }
  }

  return mentions
}
