---
name: dbl-search-intent
description: Draft, with the seller, the search-term categories and rules of one Amazon store that sort its advertised search terms on the Search intent tab of the PPC dashboard, and save them. Use when the user asks to set up or update search intent, categorise or classify search terms, rate search-term relevance, mark brand or competitor terms, or exclude irrelevant search terms. Do not use for reading ad metrics (dbl-metrics-ads), product families (dbl-brand-config) or other reads (dbl-db).
metadata:
    type: question
    audience: client
    tool: writeSql
---

# Draft the search-intent rules of a store

Read with the **`core`** MCP server's **`executeSql`** tool and write with its
**`writeSql`** tool, into two tables: `brand_config_amazon_search_term_category`
(the categories) and `brand_config_amazon_search_term_rule` (the patterns that
put a search term into a category, adjust its relevance or exclude it). The
Search intent tab of the PPC dashboard classifies every advertised search term
of the store with them. Read `${CLAUDE_PLUGIN_ROOT}/docs/search-intent-rules.md`
before drafting: it has every column and value, what a row may hold, the steps
that classify a term, and the reads that steps 1 to 4 run.

## Call

On user- and organization-scoped connectors, call `listWorkspaces` and pass the
selected `wsid` to every call. Never infer it from a result with one entry.

- **`executeSql`** — one read-only statement. It takes no bind parameters, so
  the store's values are quoted literals in the SQL, with every `'` inside a
  value doubled (`'Kid''s mug'`). Pass `limit: 1000` when a
  query's `LIMIT` is above the default of 500 rows.
- **`writeSql`** — `sql`, exactly one statement, and `wsid`. It is announced
  only on a read-write connector session. Each call runs in one transaction
  under a 15-second timeout, so split a large rule set over several calls.

Example: "set up search intent for our US store" → step 1's query with
`executeSql`, and after the seller approves the draft, one `writeSql` call per
table:

```sql
INSERT INTO "brand_config_amazon_search_term_category"
  ("merchantId", "marketplaceId", "termCategory", "position", "brand", "comment")
VALUES
  ('<merchantId>', '<marketplaceId>', 'Own brand', 10, 'OWN', 'brand and line names'),
  ('<merchantId>', '<marketplaceId>', 'Travel mug', 40, NULL, NULL)
ON CONFLICT ("merchantId", "marketplaceId", "termCategory") DO UPDATE
   SET "position" = EXCLUDED."position", "brand" = EXCLUDED."brand",
       "comment" = EXCLUDED."comment", "updatedAt" = now()
RETURNING "termCategory", "position";
```

If `writeSql` is not in the tool list, the session is read-only: the connector
URL decides it, not a permission. Ask the seller to set the plugin's Databrill
MCP URL to the same URL with `/rw` on the end (replacing a trailing `/ro`) and
to reconnect; see `${CLAUDE_PLUGIN_ROOT}/docs/configuration.md`. Do not ask for
a database password.

## Read the output

`writeSql` returns `meta.rowsAffected`, `meta.returnedRowCount`,
`meta.isTruncated` and the `RETURNING` rows in `data`. **Never report a write as
done until `rowsAffected` equals the number of rows sent**; when it is lower, say
which rows the `RETURNING` list lacks. `meta.isTruncated` on a write caps only
the returned rows, never the write itself: do not re-run it, read the rest with
`executeSql`. A read with `meta.isTruncated` is a partial picture: narrow it, or
say what is missing.

## The database accepts rows the page cannot use

The tables declare their keys and one foreign key, and no check constraint. A
misspelled effect, a pattern in upper case or a modifier with relevance 3 is
stored without an error, takes no part in the classification, and only shows on
the tab with its problem. **Check every drafted row against "What a row may
hold" in the model before writing it**, and every `FAMILY` rule's `product`
against the families step 2 returns: a family nobody has is valid and matches
nothing.

## 1. Choose one store

Run the read "The stores" in the model. If more than one store has clicks, ask
which one. One run drafts one store, and stores are never combined: two stores
of one owner get separate rules.

## 2. Read the store's products and their families

Run the read "The store's products" in the model. The titles show the own brand
and product-line names, and what each family sells. This skill creates no
families; if advertised ASINs have none, say so and point to `dbl-brand-config`.

## 3. Read the search terms

Run the three reads of "The search terms" in the model: the most-clicked terms
per ad type × placement, the words and two-word sequences, and clicks per family
for candidate words you choose from those two results and the titles. **Count
each Sponsored Brands key once**, as their shared beginning does: summing every
row counts a key reported both as an aggregate row and as per-ASIN rows twice.

## 4. Read the existing rules

Run the two reads of "The existing rules" in the model, also when the seller
asks to set up rather than update: they are how a run finds out it is a re-run.
If they return rows, draft changes to those rows rather than a new set.

## 5. Draft

1. Categories: brand categories first (own brand, then competitor, partner and
   complement brands), then one per topic or product line, then the generic
   product kind, then neighbouring needs. Positions in steps of 10.
2. `STORE` seeds for the own brand, each competitor or complement brand, the
   topics several product lines share, and the generic product kind.
3. For a word that names one product line: a `FAMILY` or `ASIN` seed or
   positive modifier with `exclusiveWithin`, and **no `STORE` seed or positive
   modifier containing that word**: a `STORE` positive covering a word claimed
   `exclusiveWithin` `STORE` lifts the claim on every ASIN. Propose a claim for
   an inactive or unadvertised family only when the seller names it.
4. `FAMILY` seeds at relevance 5 for the topic a family is made for; `FAMILY`
   negative modifiers for words that contradict its audience.
5. `ASIN` modifiers for words that tell one listing from its siblings (size,
   colour, pack).
6. `EXCLUDE` at `STORE` for product kinds the store does not sell, and at
   `FAMILY` for words that put a term out for that family only.

## 6. Check coverage by hand

Apply the classification steps of the model to the top terms of step 3, on the
ASINs they ran on. The seeds and exclusions should decide terms carrying at
least 80% of the clicks on terms made of words. List the largest unmatched
terms with their clicks, and every term that falls into two groups on different
ASINs.

## 7. Ask the seller

In plain text, with the evidence from steps 2 and 3 beside each question:

- which names are the own brand and product lines, and whether any brand in the
  terms belongs to the same owner (`PARTNER`);
- for each brand in the terms: competitor, complement or partner;
- for each claimed word: does only this product line sell it, and which ASINs
  lose the term, with their clicks and orders on it;
- the age range or audience of each family the draft lowers relevance for;
- the product kinds the store does not sell (the exclusions), with their clicks;
- whether an inactive or discontinued ASIN should keep a claim: a claim counts
  while its row exists.

## 8. Show the whole draft and ask for approval

Show both tables in full, row by row, every column but the store columns and
the timestamps, in table order, an empty cell for `NULL` and a `|` inside a
pattern written `\|`; then the share of clicks the rules decide and the largest
unmatched terms. Ask the seller to
approve it. **No `writeSql` before the seller says yes to that draft.** After
any change, show the changed rows again and ask again.

## 9. Write

- **Order.** Categories before rules, since a seed's `termCategory` has a
  foreign key onto the category. Deletes go the other way: rules first, then the
  categories they named.
- **Rules**, one multi-row upsert per call:

```sql
INSERT INTO "brand_config_amazon_search_term_rule"
  ("merchantId", "marketplaceId", "level", "product", "matchKind", "pattern", "effect",
   "termCategory", "relevance", "exclusiveWithin", "comment")
VALUES
  ('<merchantId>', '<marketplaceId>', 'STORE', '*', 'ALL_WORDS', 'travel mug*', 'SEED',
   'Travel mug', 4, NULL, NULL),
  ('<merchantId>', '<marketplaceId>', 'FAMILY', 'TRAVEL_MUG', 'ALL_WORDS', 'kid*', 'EXCLUDE',
   NULL, NULL, NULL, 'not for children')
ON CONFLICT ("merchantId", "marketplaceId", "level", "product", "matchKind", "pattern", "effect")
DO UPDATE SET "termCategory" = EXCLUDED."termCategory", "relevance" = EXCLUDED."relevance",
  "exclusiveWithin" = EXCLUDED."exclusiveWithin", "comment" = EXCLUDED."comment",
  "updatedAt" = now()
RETURNING "level", "product", "matchKind", "pattern", "effect";
```

- **Dropped rows** on a re-run are deleted by their whole key, a rule by all
  seven key columns and a category, after its rules, by its three:
  `DELETE FROM "brand_config_amazon_search_term_rule" WHERE ("merchantId", "marketplaceId", "level", "product", "matchKind", "pattern", "effect") IN (VALUES (…), (…)) RETURNING "pattern"`.
- **Positions are unique per store**, checked row by row, so moving a category
  onto a position another holds fails, even when that other moves in the same
  statement. Move one of them to a number no category of the store has first.
- **Renaming a category** is an `UPDATE` of its `termCategory`, which carries
  over to its seeds. An upsert under the new name adds a second category.

Then tell the seller where the result appears: the Search intent tab of the PPC
dashboard, which also lists any row it could not use, with its problem.

## Follow-ups

`dbl-brand-config` for product families and ASIN-to-family mapping, which the
`FAMILY` rules depend on. `dbl-metrics-ads` for the advertising metrics of the
terms. `dbl-db` for any other read. `dbl-setup` for the connector URL and
connection problems.
