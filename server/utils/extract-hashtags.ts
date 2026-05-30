function extractText(node: any): string {
  let text = ''

  if (node.type === 'text') {
    text += node.text
  }

  if (Array.isArray(node.content)) {
    for (const child of node.content) {
      text += extractText(child)
    }
  }

  return text
}

export function extractHashtags(node: any): string[] {
  const content = extractText(node)
  const hashtags = content.match(/#\w+/g)

  return [
    ...new Set(hashtags?.map(tag => tag.slice(1).toLowerCase())),
  ]
}
