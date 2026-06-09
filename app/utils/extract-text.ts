export function extractText(node: any): string {
  let text = ''

  if (node.type === 'text') {
    text += node.text ?? ''
  }

  if (node.type === 'mention') {
    text += `@${node.attrs.label}`
  }

  if (Array.isArray(node.content)) {
    for (const child of node.content) {
      text += extractText(child)
    }
  }

  if (node.type === 'paragraph') {
    text += '\n'
  }

  return text
}
