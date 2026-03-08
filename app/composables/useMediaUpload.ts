import type { Attachment } from '~/types/post'
import { toast } from 'vue-sonner'

export async function useMediaUpload() {
  const attachments = ref<Attachment[]>([])

  const mpu = useMultipartUpload('/api/posts/attachments', {

  })

  const totalProgress = computed<number>(() => {
    if (!attachments.value.length) {
      return 0
    }

    const sum = attachments.value.reduce((sum, value) => sum + value.uploadProgress, 0)
    return sum / attachments.value.length
  })

  const isUploading = computed(() =>
    attachments.value.some(attachment => attachment.isUploading),
  )

  const abortUploadMap = new Map<string, () => Promise<void>>()

  // Uploads a list of files and adds them to the attachments list
  async function handleUploadFiles(files: File[]) {
    if (isUploading.value) {
      toast.loading('Upload in progress...')
      return
    }

    if (attachments.value.length + files.length > 5) {
      toast.error('Maximum attachment limit reached')
      return
    }

    const newAttachments: Attachment[] = files.map(file => ({
      id: crypto.randomUUID(),
      file,
      isUploading: true,
      uploadProgress: 0,
    }))

    attachments.value.push(
      ...newAttachments,
    )

    await Promise.all(newAttachments.map(async ({ file, id }) => {
      try {
        const { completed, progress: fileProgress, abort: abortUpload } = mpu(file)
        abortUploadMap.set(id, abortUpload)

        const attachment = attachments.value.find(attachment => attachment.id === id)

        if (!attachment) {
          toast.error('Failed to upload file')
          return
        }

        watch(fileProgress, (newValue) => {
          attachment.uploadProgress = newValue
        })

        const uploadedFile = await completed

        const { mediaId } = await $fetch('/api/media/by-pathname', {
          method: 'GET',
          query: { pathname: uploadedFile?.pathname },
        })

        attachment.mediaId = mediaId
        attachment.isUploading = false
      }
      catch (error: any) {
        attachments.value = attachments.value.filter(attachment => attachment.file.name !== file.name)
        toast.error(`Failed to upload ${error.message}`)
      }
    }))
  }

  // If user cancels the upload, abort the upload for that attachment and remove it from the list
  async function removeAttachment(id: string) {
    const abort = abortUploadMap.get(id)

    if (abort) {
      await abort()
      abortUploadMap.delete(id)
    }
    attachments.value = attachments.value.filter(attachment => attachment.id !== id)
  }

  function reset() {
    attachments.value = []
    abortUploadMap.clear()
  }

  return {
    handleUploadFiles,
    attachments,
    removeAttachment,
    reset,
    isUploading,
    totalProgress,
  }
}
