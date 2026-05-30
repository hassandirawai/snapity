import type { JSONContent } from '@tiptap/vue-3'

export interface Attachment {
  id: string
  file: File
  mediaId?: string
  isUploading: boolean
  uploadProgress: number
}

export interface PostInput {
  postContent: JSONContent
  mediaIds: string[]
}
