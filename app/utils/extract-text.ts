export function extractText(node: any): string {
  let text = ''

  if (node.type === 'text') {
    text += node.text ?? ''
  }

  if (node.type === 'mention') {
    text += `@${node.attrs.label}`
  }

  if (node.type === 'hardBreak') {
    text += '\n'
  }

  if (Array.isArray(node.content)) {
    for (const child of node.content) {
      text += extractText(child)
    }
  }

  return text
}
