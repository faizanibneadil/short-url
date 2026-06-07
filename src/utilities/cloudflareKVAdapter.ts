import type { KVAdapterResult, KVStoreValue } from 'payload'
import Cloudflare from "cloudflare";

export type CloudflareKVConfigArgsType = {
    cloudflareKvNamespaceId: string,
    cloudflareAccountId: string,
    cloudflareInstance: Cloudflare
}
export type CloudflareKvAdapterConfig = (args: CloudflareKVConfigArgsType) => KVAdapterResult

export const cloudflareKVadapter: CloudflareKvAdapterConfig = ({
    cloudflareAccountId,
    cloudflareKvNamespaceId,
    cloudflareInstance
}) => {
    return {
        init: () => ({
            async clear(): Promise<void> {
                // Sab keys fetch karo, phir bulk delete
                const allKeys: string[] = [];
                let cursor: string | undefined;

                do {
                    const page = await cloudflareInstance.kv.namespaces.keys.list(cloudflareKvNamespaceId, {
                        account_id: cloudflareAccountId,
                        ...(cursor ? { cursor } : {}),
                        limit: 1000,
                    });

                    for await (const key of page) {
                        allKeys.push(key.name);
                    }

                    // Cloudflare SDK cursor pagination
                    cursor = (page as any).result_info?.cursor;
                } while (cursor);

                // Bulk delete in batches of 10,000 (CF limit)
                const BATCH = 10_000;
                for (let i = 0; i < allKeys.length; i += BATCH) {
                    const batch = allKeys.slice(i, i + BATCH);
                    await cloudflareInstance.kv.namespaces.keys.bulkDelete(cloudflareKvNamespaceId, {
                        account_id: cloudflareAccountId,
                        body: batch,
                    });
                }
            },

            // ─── DELETE ─────────────────────────────────────────────────────────
            async delete(key: string): Promise<void> {
                await cloudflareInstance.kv.namespaces.values.delete(cloudflareKvNamespaceId, key, {
                    account_id: cloudflareAccountId,
                });
            },

            // ─── GET ────────────────────────────────────────────────────────────
            async get<T extends KVStoreValue>(key: string): Promise<null | T> {
                try {
                    const response = await cloudflareInstance.kv.namespaces.values.get(cloudflareKvNamespaceId, key, {
                        account_id: cloudflareAccountId
                    });

                    // SDK Response object return karta hai — text() se value nikalo
                    const raw = await (response as Response).text();
                    if (!raw) return null;

                    return JSON.parse(raw) as T;
                } catch (err: any) {
                    // 404 = key exist nahi karta
                    if (err?.status === 404 || err?.statusCode === 404) return null;
                    throw err;
                }
            },

            // ─── HAS ────────────────────────────────────────────────────────────
            async has(key: string): Promise<boolean> {
                try {
                    await cloudflareInstance.kv.namespaces.metadata.get(cloudflareKvNamespaceId, key, {
                        account_id: cloudflareAccountId,
                    });
                    return true;
                } catch (err: any) {
                    if (err?.status === 404 || err?.statusCode === 404) return false;
                    throw err;
                }
            },

            // ─── KEYS ───────────────────────────────────────────────────────────
            async keys(): Promise<string[]> {
                const allKeys: string[] = [];
                let cursor: string | undefined;

                do {
                    const page = await cloudflareInstance.kv.namespaces.keys.list(cloudflareKvNamespaceId, {
                        account_id: cloudflareAccountId,
                        ...(cursor ? { cursor } : {}),
                        limit: 1000,
                    });

                    for await (const key of page) {
                        allKeys.push(key.name);
                    }

                    cursor = (page as any).result_info?.cursor;
                } while (cursor);

                return allKeys;
            },

            // ─── SET ────────────────────────────────────────────────────────────
            async set(key: string, value: KVStoreValue): Promise<void> {
                await cloudflareInstance.kv.namespaces.values.update(cloudflareKvNamespaceId, key, {
                    account_id: cloudflareAccountId,
                    value: JSON.stringify(value),
                    // Sessions ke liye TTL — Payload default 2 hours
                    expiration_ttl: 60 * 60 * 2,
                });
            },

        })
    }
}