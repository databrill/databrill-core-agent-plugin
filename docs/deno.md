# Install Deno and run the database helpers

Deno is optional. The hosted MCP works without it. Install Deno only when you
have been given a direct read-only database credential and need an off-menu
query, CSV export, or live schema inspection.

## Install

macOS or Linux:

```bash
curl -fsSL https://deno.land/install.sh | sh
```

macOS with Homebrew:

```bash
brew install deno
```

Windows PowerShell:

```powershell
irm https://deno.land/install.ps1 | iex
```

Restart the terminal if the installer changes `PATH`, then verify:

```bash
deno --version
```

Update an existing installation with:

```bash
deno upgrade
```

See the
[official Deno installation guide](https://docs.deno.com/runtime/getting_started/installation/)
for package-manager alternatives and troubleshooting.

## Configure a connection

Follow [Configuration and workspace scopes](configuration.md). Prefer a
Databrill-provisioned read-only `agent` database user. Avoid shell history for a
long-lived password; use your operating system's secret manager or an ignored
environment file where possible.

## Discover the live schema

From the plugin directory:

```bash
deno run --allow-env --allow-read --allow-net scripts/catalog.ts
```

For a configured multi-workspace file:

```bash
deno run --allow-env --allow-read --allow-net scripts/catalog.ts \
  --wsid 100000001
```

This reports the tables, views, columns, types, and nullability actually present
in the selected database. Compare it with
[the complete declared catalog](table-catalog.md).

## Run a read-only query

Put SQL in a file, for example `query.sql`:

```sql
SELECT
	"marketplace_code",
	COUNT(*) AS "listingCount"
FROM "amazon_listing_open"
GROUP BY "marketplace_code"
ORDER BY "marketplace_code";
```

Run it as JSON:

```bash
deno run --allow-env --allow-read --allow-net scripts/query.ts query.sql
```

Or export CSV:

```bash
deno run --allow-env --allow-read --allow-net --allow-write=. scripts/query.ts \
  --format csv --output listing-counts.csv query.sql
```

For placeholders, use `$1`, `$2`, and pass a JSON array:

```bash
deno run --allow-env --allow-read --allow-net scripts/query.ts \
  --params '["US","2026-07-01"]' query.sql
```

With multi-workspace configuration, add `--wsid`.

The helper accepts one read-only statement beginning with `SELECT`, `WITH`,
`EXPLAIN`, `SHOW`, `TABLE`, or `VALUES`. It rejects modifying keywords and also
opens a read-only transaction. Always double-quote Databrill relation and column
identifiers; many names contain uppercase letters.

## Permissions

The command grants only:

- `--allow-env` for connection variables;
- `--allow-read` for configuration and SQL files;
- `--allow-net` for PostgreSQL.

Add `--allow-write=.` only when using `--output`. Do not use `-A` for these
helpers.
