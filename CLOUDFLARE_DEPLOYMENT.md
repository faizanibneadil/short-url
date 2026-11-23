# Cloudflare Workers deployment

This app (Payload CMS + Next.js) runs on Cloudflare Workers through
[OpenNext](https://opennext.js.org/cloudflare). It follows the official Payload
[`with-cloudflare-d1`](https://github.com/payloadcms/payload/tree/main/templates/with-cloudflare-d1) template.

| | Production | Preview (every non-`main` branch) |
| --- | --- | --- |
| Trigger | push to `main` | push to any other branch |
| Workflow | `.github/workflows/deploy-production.yml` | `.github/workflows/deploy-preview.yml` |
| URL | https://url.devslix.com | `https://<branch>-short-url.<subdomain>.workers.dev` |
| D1 / R2 | top-level `d1_databases` / `r2_buckets` in `wrangler.jsonc` | `previews` block in `wrangler.jsonc` (+ `wrangler.preview-migrations.jsonc`) |
| Payload secret | `PAYLOAD_SECRET` | `PREVIEW_PAYLOAD_SECRET` |

Deleting a branch deletes its Preview.

## GitHub secrets

Settings → Secrets and variables → Actions → **New repository secret**

| Secret | Value |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token (see below) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |
| `PAYLOAD_SECRET` | `openssl rand -hex 32` (production) |
| `PREVIEW_PAYLOAD_SECRET` | `openssl rand -hex 32` (previews, different from production) |

API token permissions (Account): **Workers Scripts: Edit**, **D1: Edit**, **Workers R2 Storage: Edit**,
**Account Settings: Read**. Zone `devslix.com`: **Workers Routes: Edit**, **DNS: Edit**, **Zone: Read**.

## Resource IDs

Replace the `replace-me-*` / `00000000-…` placeholders:

- `wrangler.jsonc` → top-level `d1_databases` and `r2_buckets` (production)
- `wrangler.jsonc` → `previews.d1_databases` and `previews.r2_buckets` (preview)
- `wrangler.preview-migrations.jsonc` → same values as the `previews` block

Then run `pnpm generate:types:cloudflare`.

## Database migrations

D1 schema is managed by Payload migrations in `src/migrations`. CI runs them before every deploy.
After changing collections/fields:

```bash
pnpm payload migrate:create <name>
```

Commit the generated files. All previews share one preview D1 database.

## Local development

```bash
cp .env.example .env
pnpm install
pnpm payload migrate
pnpm dev
```

`pnpm dev` uses local D1/R2 simulators (stored in `.wrangler/`).
