'use server'
import { Url } from '@/payload-types'
import config from '@payload-config'
import { getPayload } from 'payload'

export async function CreateURL(prevState: {
    errorMessage?: string | null
    success: boolean,
    shortURL?: Url['shortURL']
}, formData: FormData) {
    try {
        const urlFromArgs = formData.get('url') as string

        if (!urlFromArgs) {
            throw new Error('URL is required.')
        }

        try {
            new URL(urlFromArgs)
        } catch (error) {
            return {
                errorMessage: error instanceof Error ? error.message : 'Internal Server Error',
                success: false
            }
        }

        try {
            const payload = await getPayload({ config })
            const shortURL = await payload.create({
                collection: 'urls',
                draft: false,
                data: {
                    longURL: urlFromArgs,
                }
            })

            return {
                errorMessage: null,
                success: true,
                shortURL: shortURL.shortURL
            }
        } catch (error) {
            return {
                errorMessage: error instanceof Error ? error.message : 'Internal Server Error',
                success: true,
            }
        }


    } catch (error) {
        return {
            success: false,
            errorMessage: error instanceof Error ? error.message : 'Internal Server Error'
        }
    }
}