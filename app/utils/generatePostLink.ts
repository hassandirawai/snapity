export async function useGeneratePostLink(postId: string) {
  const source = `http://localhost:3000/post/${postId}`
  const { copy } = useClipboard({ source })
  await copy(source)
}
