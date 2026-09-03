---
name: dbl-brand-config
description: Edit brand configuration — product families, the ontology category and variant layer, ASIN-to-family and ASIN-to-SKU mapping, and effective-dated cost, rate and planning attributes. Use when the user asks to set up or edit product families, map ASINs to families or SKUs, seed the ontology, recategorise or relabel a family, or set a cost per unit, VAT rate or lead time for a period. Do not use for reading brand configuration — that is dbl-db.
metadata:
    type: question
    audience: client
    tool: writeSql
---

# Edit brand configuration

Write with the **`core`** MCP server's **`writeSql`** tool. It is the only write
path in this plugin, it is announced only on a read-write connector session, and
it reaches the seven customer-editable `brand_config_*` tables and nothing else.
Reading these same tables is `dbl-db`'s job.

## Call

`writeSql` takes two parameters:

- **`sql`** (required) — **exactly one statement.** Stacked statements are
  rejected by Postgres, so a semicolon-separated batch fails as a whole. Write
  many rows in one call with a multi-row `VALUES` list, not with several
  statements.
- **`wsid`** (required on a user- or organization-scoped connector) — the
  workspace to write to, as a string. The SQL tools never infer it, not even when
  the connector reaches exactly one workspace; omitting it is refused with "The
  SQL tools require an explicit wsid argument on this scope". Call
  `listWorkspaces` for the options. A workspace-scoped connector fixes the
  workspace instead, does not announce the parameter, and refuses a call that
  names a different one.

Anything outside this workspace's configuration tables fails with a privilege
error and nothing is written; that includes every pipeline data table. `TRUNCATE`
is refused as well — use `DELETE`. The statement runs inside one transaction
under a 15-second timeout, which `meta.statementTimeoutMs` reports back, so split
a large seed into several calls rather than sending a whole catalogue in one
statement.

For the exact column names, types, nullability and defaults of any of these
tables, read `${CLAUDE_PLUGIN_ROOT}/docs/schema/common/brand_config_<name>.yaml`.
Some columns are lower case (`family`, `category`, `msku`, `asin`, `data`,
`scope`, `value`) and some are camelCase (`createdAt`, `dataResolved`,
`merchantId`, `scopeId`, `dateFirst`, `appliesTo`), so double-quote every
identifier and both kinds are safe. A worked call — one family, written so a
re-run is harmless. Its `category` has to exist as a
`brand_config_ontology_category` row already, or the foreign key refuses the
insert:

```sql
INSERT INTO "brand_config_amazon_family" ("family", "category", "label")
VALUES ('WIDGET_PRESS', 'WIDGET', 'Widget Press')
ON CONFLICT ("family") DO UPDATE
   SET "category"  = EXCLUDED."category",
       "label"     = EXCLUDED."label",
       "updatedAt" = now()
RETURNING "family", "category";
```

## Read the output

`writeSql` returns `meta.command` (the Postgres command tag),
`meta.rowsAffected`, `meta.returnedRowCount`, `meta.statementTimeoutMs`, and the
`RETURNING` rows in `data`.

**Never report a write as done without reading a row count.** An
`UPDATE ... WHERE` that matched nothing and an `INSERT ... ON CONFLICT DO
NOTHING` that conflicted on every row both succeed and both change zero rows. Say
how many rows the statement touched, and add `RETURNING` to any statement whose
result the user will act on.

**Which count is the true one depends on `RETURNING`.** Without a `RETURNING`
clause, read `rowsAffected`. With one, the rows come back through a cursor 100 at
a time and `rowsAffected` counts only the last batch — a 100-row
`INSERT ... RETURNING` reports 0 and a 101-row one reports 1. Read
`returnedRowCount` for those, and never announce "0 rows" for a statement that
handed you rows.

## If `writeSql` is not in the tool list

You are on a read-only connector session. It is not a per-workspace setting and
not a plugin version problem: the connector URL decides it, and a URL with no
read-write suffix never announces the tool.

Ask the user to set the plugin's Databrill MCP URL to the read-write form of
their connector URL — the same URL with `/rw` on the end, replacing a trailing
`/ro` if it has one — and to reconnect. The suffix chooses among capabilities
their Databrill login already has; it grants nothing new. See
`${CLAUDE_PLUGIN_ROOT}/docs/configuration.md`. Do not ask for a database
password: these edits do not need one.

## Write the seven tables in this order

Four foreign keys run through this set, all of them `ON DELETE RESTRICT ON UPDATE
CASCADE`, so an out-of-order insert fails on a constraint.

1. **`brand_config_ontology_category`** — everything else in the ontology hangs
   off a category. `data` is required and has no default, so pass `'{}'::jsonb`
   when a category authors no properties. Write `dataResolved` too — nothing
   computes it, see below.
2. **`brand_config_ontology_metadata`** — declares which properties a category or
   variant row may set in its `data`, one row per property. It has no foreign
   keys, so it may equally be written before step 1. `valueType` is required.
3. **`brand_config_ontology_variant`** — one row per merchant SKU. Its `category`
   carries the foreign key to step 1 **and is NOT NULL**, so the category layer is
   mandatory before this step rather than merely earlier than it. `data` is
   required here too, and `dataResolved` needs writing here as well.
4. **`brand_config_amazon_family`** — one row per family. Its `category` points at
   step 1 but is nullable, so a family row will insert with no category at all.
5. **`brand_config_amazon_asin`** — one row per ASIN. Its `msku` points at step 3
   and its `family` at step 4; both are nullable, and both are checked whenever
   they are non-null.
6. **`brand_config_amazon_attributes`** — no foreign keys, because its scope
   columns are polymorphic. It can be written at any point.
7. **`brand_config_business_attributes`** — the same, at the workspace level.

## `dataResolved` is written, not computed

Both ontology tables carry the authored property values in `data` and the
inherited-and-resolved ones in `dataResolved`. **Nothing in the database derives
the second from the first** — there is no trigger and no job — and `dataResolved`
is `NOT NULL DEFAULT '{}'::jsonb`, so an insert that omits it stores an empty
object and raises nothing.

All four `brand_ontology_*` views expose `dataResolved` as their `data` column. A
category written with a full `data` and no `dataResolved` therefore reads back
through every view as a row with no properties at all: the write succeeded, the
row is there, and every property is silently gone.

So write both columns on every category and variant row:

- a **category** resolves to its own `data`, because the schema gives a category
  no parent;
- a **variant** resolves to its category's `dataResolved` with the variant's own
  `data` written over it, key by key — which `jsonb`'s `||` does, right side
  winning.

```sql
INSERT INTO "brand_config_ontology_variant" ("msku", "category", "data", "dataResolved")
SELECT 'WIDGET-BLUE-M', c."category",
       '{"colour":"blue"}'::jsonb,
       c."dataResolved" || '{"colour":"blue"}'::jsonb
FROM "brand_config_ontology_category" c
WHERE c."category" = 'WIDGET'
ON CONFLICT ("msku") DO UPDATE
   SET "category"     = EXCLUDED."category",
       "data"         = EXCLUDED."data",
       "dataResolved" = EXCLUDED."dataResolved",
       "updatedAt"    = now()
RETURNING "msku", "dataResolved";
```

Reading the parent's `dataResolved` inside the statement keeps the two in step,
but it also means a misspelled category name writes **nothing at all**: the
`SELECT` matches no row, the insert succeeds, and the foreign key is never
tested. This is the form that most needs its row count read.

Inheritance is materialised at write time, not at read time, so changing a
category's properties later does not reach the variants under it. Rewrite every
variant of a category whenever you change that category's `data` or
`dataResolved`.

## Nothing stops you writing families with an empty ontology

Steps 4 and 5 hold the nullable columns — `brand_config_amazon_family.category`,
`brand_config_amazon_asin.msku` and `brand_config_amazon_asin.family` — so it is
entirely possible to map a whole catalogue into families, satisfy every
constraint, and end with fully populated `brand_config_*` tables above empty
`brand_ontology_*` views. **The constraints do not notice; the views do.**

Read `${CLAUDE_PLUGIN_ROOT}/docs/product-hierarchy.md` for what that failure looks
like from the reading end. To avoid producing it: write steps 1 to 3 as well, and
give every family a `category`.

## A typo in `brand_config_amazon_family.msku` is silent

`brand_config_amazon_asin.msku` has a foreign key onto
`brand_config_ontology_variant.msku`, so a misspelled SKU there fails immediately
and loudly. `brand_config_amazon_family.msku` deliberately has no such key,
because a family may name a conceptual SKU that exists as no variant row — which
means a misspelling there inserts happily and stays wrong.

So check family-level `msku` values yourself after writing them; nothing else
will. This one is a read, so run it with `executeSql`:

```sql
SELECT f."family", f."msku"
FROM "brand_config_amazon_family" f
LEFT JOIN "brand_config_ontology_variant" v ON v."msku" = f."msku"
WHERE f."msku" IS NOT NULL AND v."msku" IS NULL;
```

Every row that comes back is either an intended conceptual SKU or a typo, and
only the user can tell you which.

## `dateLast` is inclusive, and it is silent when you get it wrong

`brand_config_amazon_attributes` and `brand_config_business_attributes` are
effective-dated, both the same way:

- **`dateFirst`** — interval start, **inclusive**, `YYYY-MM-DD`, and part of the
  primary key. Two intervals for the same scope and attribute are distinct rows
  only because their `dateFirst` differs.
- **`dateLast`** — interval end, **inclusive**, `YYYY-MM-DD`. `NULL` means still
  in force.

**An inclusive end date is the opposite of the half-open interval most writers
assume.** A cost meant to cover January alone is `dateFirst = '2026-01-01'`,
`dateLast = '2026-01-31'` — not `'2026-02-01'`. Writing the exclusive form does
not fail, does not warn, and does not look wrong in the row: it silently applies
January's cost to the first day of February, and every margin computed for that
day is wrong. When you close an open interval before starting a new one, set the
old row's `dateLast` to the day **before** the new row's `dateFirst`.

`value` is `NUMERIC`. `source` (`ACTUAL | INFERRED | DEFAULT`) and `confidence`
(`HIGH | MED | LOW`) are both required and have no default, so every insert must
supply them. `currency` is for cost attributes and is null for rates.

## Filling the scope columns

**`brand_config_amazon_attributes`** has the primary key
`("merchantId", "scope", "scopeId", "country", "attribute", "dateFirst")`. All six
are NOT NULL, so the empty string, not `NULL`, is how a column that does not apply
is written. The rendered schema names these columns but not the values they may
take, and no check constraint restricts them — a misspelled or lower-case scope
inserts happily and then matches nothing at resolution time. So they are here in
full.

- **`merchantId`** — the merchant the row applies to, or `''` for the `COUNTRY`
  scope, which applies to every merchant.
- **`scope`** — one of `COUNTRY`, `STORE`, `FAMILY`, `ASIN`, `SKU`, uppercase.
- **`scopeId`** — the SKU, ASIN or family name for those three scopes; `''` for
  the `STORE` and `COUNTRY` scopes.
- **`country`** — uppercase marketplace country code (`US`, `CA`, `GB`, `DE`).
- **`attribute`** — the attribute name, uppercase and extensible: `UNIT_COGS`,
  `VAT_RATE`, `UNSELLABLE_RETURN_LOSS_PCT`, `BRAND_REGISTRY_FLAG`,
  `LEAD_TIME_DAYS`, `SAFETY_STOCK_DAYS`, `TARGET_COVERAGE_DAYS`.

Resolution takes the value from the most specific scope whose interval covers the
date, each attribute independently:
`SKU -> ASIN -> FAMILY -> STORE -> COUNTRY`. So a country-wide default and a
per-SKU override can both exist for the same day, and the per-SKU one wins.

```sql
INSERT INTO "brand_config_amazon_attributes"
       ("merchantId", "scope", "scopeId", "country", "attribute",
        "dateFirst", "dateLast", "value", "currency", "source", "confidence")
VALUES ('YOUR_MERCHANT_ID', 'SKU', 'WIDGET-BLUE-M', 'US', 'UNIT_COGS',
        '2026-01-01', NULL, 9.50, 'USD', 'ACTUAL', 'HIGH')
ON CONFLICT ("merchantId", "scope", "scopeId", "country", "attribute", "dateFirst")
DO UPDATE SET "dateLast"   = EXCLUDED."dateLast",
              "value"      = EXCLUDED."value",
              "currency"   = EXCLUDED."currency",
              "source"     = EXCLUDED."source",
              "confidence" = EXCLUDED."confidence",
              "updatedAt"  = now()
RETURNING "scopeId", "dateFirst", "dateLast", "value";
```

The `DO UPDATE` sets every non-key column, `dateLast` first among them. A
`DO UPDATE` that sets only `"value"` leaves the stored row's end date, currency
and provenance as they were, so re-running this insert to reopen an interval that
was closed at `2026-01-31`, or to correct a currency, changes the number and
keeps the wrong end date or the wrong currency — without an error and without a
visible difference in what you sent.

**`brand_config_business_attributes` is scoped differently** — do not carry that
ladder onto it. It has no `merchantId` and no `country` column, because these
attributes describe the business rather than a merchant or a marketplace; its
primary key is four parts, `("scope", "scopeId", "attribute", "dateFirst")`, with
`scope` set to `WORKSPACE` and `scopeId` to `''`. Resolution is degenerate — one
timeline per attribute — so nothing can be more specific than anything else: pick
the interval covering the as-of date.

## Declaring an ontology property

`brand_config_ontology_metadata.appliesTo` is checked against `'CATEGORY'`,
`'VARIANT'` and `'BOTH'`, defaults to `'BOTH'`, and rejects anything else. Use
`'CATEGORY'` for a property only a category may author, `'VARIANT'` for one only
a variant may author, `'BOTH'` when either may.

## Follow-ups

`dbl-db` for reading brand configuration, and everything else in the database.
`dbl-setup` for the connector URL and for anything that looks like a connection
or membership problem rather than a SQL one.
