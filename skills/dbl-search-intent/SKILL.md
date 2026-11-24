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
against the families step 2 returns: it is one of them, or the first parts of
one before a `:`. A family nobody has is valid and matches nothing.

## 1. Choose one store

Run the read "The stores" in the model. If more than one store has clicks, ask
which one. One run drafts one store, and stores are never combined: two stores
of one owner get separate rules.

## 2. Read the store's products and their families

Run the read "The store's products" in the model. The titles show the own brand
and product-line names, and what each family sells. This skill creates no
families; if advertised ASINs have none, say so and point to `dbl-brand-config`.
A family name with parts separated by `:` (`Mug:Travel`, `Mug:Desk`) lies
within the family its first parts name (`Mug`): a rule meant for a whole product
line goes once on the line's name, not once per family within it.

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

A seed names the product: it is what a buyer would answer, in a few words,
when asked what is in the shopping bag ("a travel mug", "a kids' water
bottle"). Draft every row from that test.

1. Categories: brand categories first (own brand, then competitor, partner and
   complement brands), then one per product line, then the generic product
   kind, then gift and occasion categories. Gifts and occasions come after the
   products, so a term that also names a product keeps the product's category.
   Positions in steps of 10.
2. Seeds name a product. The shortest phrase that passes the shopping-bag test
   has relevance 3; a looser name, or one that names other products too, has 2.
   A seed goes above 3 rarely: when a longer phrase has to outrank an exclusion
   or another product's `exclusiveWithin` on one of its words. A topic word
   alone ("insulated") or a kind word alone ("mug") is a seed only when buyers
   call this product just that; otherwise it is a modifier or nothing.
3. Modifiers add +1 for each detail of the product a term names: an audience, a
   feature, a design. A modifier of +2 is only for a word as specific as the own
   brand name. A kind word that is not a seed can be a +1 modifier on the
   products it fits.
4. Brand names, gifts and occasions are seeds with relevance 0: they put a term
   in their category without making it relevant to any product, so "<brand>
   <another product>" is not relevant to every product. The own brand is also a
   `STORE` modifier of +2. An own brand so tied to one product that its name
   alone sells well is a seed at 2 instead.
5. Where a rule goes: `STORE` only for what every product of the store is; a
   product line's rules on its family, or once on the line's name when its
   families are named `<line>:<…>`; `ASIN` modifiers for words that tell one
   listing from its siblings (size, colour, pack). Negative `FAMILY` modifiers
   for words that contradict a family's audience.
6. One row per term. The alternatives of one row (`|a|b|`) are only ways of
   writing one term: spellings, typos, plurals (`|mug|mugs|`,
   `|first year|1st year|`). Different terms get different rows, and every
   competitor brand its own.
7. `exclusiveWithin` only where a term must be negated for the store's other
   products, and step 3 shows those products getting its clicks. A product added
   later is excluded from every such term without anyone noticing, so each one
   needs that reason. Never on an inactive or unadvertised family unless the
   seller names it.
8. `EXCLUDE` at `STORE` for product kinds the store does not sell, and at
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
- for each `exclusiveWithin`: does only this product line sell the term, and
  which ASINs lose it, with their clicks and orders on it;
- the age range or audience of each family the draft lowers relevance for;
- the product kinds the store does not sell (the exclusions), with their clicks;
- whether an inactive or discontinued ASIN should keep an `exclusiveWithin`: it
  counts while its row exists.

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
   'Travel mug', 3, NULL, NULL),
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
