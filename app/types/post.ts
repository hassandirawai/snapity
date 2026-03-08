export interface Attachment {
  id: string
  file: File
  mediaId?: string
  isUploading: boolean
  uploadProgress: number
}

export interface PostInput {
  content: string
  mediaIds: string[]
}
