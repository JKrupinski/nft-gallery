import { kodaImage } from '@/utils/config/ipfs'

type StreamDownload = {
  url: string
  uid: string
  detail?: {
    thumbnail: string
  }
  video?: {
    default?: {
      url: string
      percentComplete: number
    }
  }
}

const workerUrl = new URL(kodaImage)

export async function getCloudflareMp4(url): Promise<StreamDownload> {
  workerUrl.pathname = '/video/download'

  const kodaUrl = new URL(url)
  const infura = `https://kodadot1.infura-ipfs.io${kodaUrl.pathname}`

  const video = await $fetch(workerUrl.toString(), {
    method: 'POST',
    body: {
      videoUrl: infura,
    },
  })

  return video as StreamDownload
}

export async function getMetadata(url: string) {
  workerUrl.pathname = '/metadata'
  workerUrl.searchParams.set('url', url)

  const metadata = await $fetch(workerUrl.toString())

  return metadata as unknown as NFTWithMetadata
}

export const uploadImage = async (file: File) => {
  try {
    const form = new FormData()
    form.append('file', file)

    workerUrl.pathname = '/image/upload'

    const response = await $fetch<{ url: string }>(workerUrl.toString(), {
      method: 'POST',
      body: form,
    })

    return response
  } catch (error) {
    throw new Error(`[IMAGE::UPLOAD] ERROR: ${error?.data}`)
  }
}
