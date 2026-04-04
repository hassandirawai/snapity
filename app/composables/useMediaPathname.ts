export function useMediaPathname(url: string): string | null {
  if (!url) {
    return null
  }
  if (url.startsWith('http') || url.startsWith('blob')) {
    return url
  }
  return `images/${url}`
}
