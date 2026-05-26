'use client'
import { ReactSelect, useConfig, useField } from '@payloadcms/ui'
import type { TextFieldClientProps } from 'payload'


export function ConfiguredCollectionSlug(props: TextFieldClientProps & { options: { label: string, value: string }[] }) {
    const { path } = props || {}

    const { value, setValue } = useField({ path })

    const { config: { collections } } = useConfig()

    const enableCollectionViewCollections = collections?.filter(collection => {
        return Boolean(collection.admin?.custom?.enableCollectionView)
    })

    const options = enableCollectionViewCollections.map(({ slug }) => ({
        label: slug.charAt(0).toUpperCase() + slug.slice(1),
        value: slug,
    }))


    const defaultValue = options?.find(opts => {
        return opts.value === value
    })

    return <ReactSelect
        isSearchable={false}
        isClearable={false}
        isMulti={false}
        value={defaultValue}
        options={options}
        onChange={option => {
            setValue(Array.isArray(option) ? option.at(0)?.value : option.value)
        }}
    />
}