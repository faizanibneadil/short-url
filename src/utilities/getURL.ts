import { Media } from '@/payload-types'
import { canUseDOM } from './canUseDOM'

export const getServerSideURL = () => {
  return process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
}

export const getClientSideURL = () => {
  if (canUseDOM()) {
    const protocol = window.location.protocol
    const domain = window.location.hostname
    const port = window.location.port

    return `${protocol}//${domain}${port ? `:${port}` : ''}`
  }

  return process.env.NEXT_PUBLIC_SERVER_URL || ''
}

export const formatShortURL = (shortURL: string) => {
  return `${getClientSideURL()}/s/${shortURL}`
}

export const getMediaUrl = (media: number | Media | null | undefined): string => {
  // If media is a valid object with a non-empty filename, return the constructed URL
  if (media && typeof media === 'object' && 'filename' in media && media.filename) {
    return `${getClientSideURL()}/api/media/file/${media.filename}`;
  }

  // Return empty string for numbers, null, undefined, or invalid objects
  return '';
};