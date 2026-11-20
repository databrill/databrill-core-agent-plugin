# Search-term intent rules

Two customer-editable tables sort the advertised search terms of one Amazon
store into named groups. The Search intent tab of the PPC dashboard reads them;
the `dbl-search-intent` skill drafts them with the seller and writes them with
`writeSql`. This file is the model that skill drafts from and checks by hand:
what each column and value means, what a row may hold, how a search term is
classified, and the reads the skill runs.

Column types, nullability and keys are in
`${CLAUDE_PLUGIN_ROOT}/docs/schema/common/brand_config_amazon_search_term_category.yaml`
and `brand_config_amazon_search_term_rule.yaml` beside it.

## One store at a time

A store is one merchant in one marketplace: `merchantId` × `marketplaceId`.
Every row of both tables carries the two, and two stores never share a row, not
even stores of one owner that sell the same products.

Product families are workspace-wide (`brand_config_amazon_family` has no store
column), so a family rule takes its store from its own row and applies only to
the ASINs of that family that this store advertises. An ASIN's family for the
store's country is
`COALESCE("countryToFamily"->>'<country code>', "family")` from
`brand_config_amazon_asin`.

## Categories: `brand_config_amazon_search_term_category`

One row per category of the store. A category is a group of search terms on the
page, and the terms of one category share one conversion prior in the page's
estimate, so put terms that convert alike in one category.

- **`termCategory`**: the name shown on the page, unique per store. It may not
  be the name of a fixed group (below).
- **`position`**: unique per store, lower first. It orders the page, and when a
  term matches seeds of several categories, the category with the lowest
  position takes it. Steps of 10 leave room to insert.
- **`brand`**: which kind of brand the category's terms name; `NULL` when they
  name none (generic product or need terms).
  - `OWN`: the store owner's own brand or product-line names.
  - `COMPETITOR`: a brand whose products compete with the store's.
  - `PARTNER`: a brand or store of the same owner that competes with this
    one. The click is not lost to the owner, which makes it a different case
    from a competitor.
  - `COMPLEMENT`: a brand the store's product is often bought with or used
    beside; a term naming it can be a positive rather than a negative.
- **`comment`**: why the category exists, in a few words.

The page also shows five fixed groups. They are not rows and have no brand:

- `Excluded`: an `EXCLUDE` rule, or another product's claim, puts the term out
  for this advertised ASIN.
- `ASIN, own` and `ASIN, other`: a term that is one ASIN (`b0` and eight letters
  or digits) or one ISBN-10 (ten digits, the last may be `x`), matched by no seed
  or exclusion; `own` when the ASIN is one of the store's listings in
  `amazon_listing_all`.
- `No search term`: nothing is left of the term after normalisation (step 1
  below): an empty term, or punctuation alone.
- `Unmatched`: no seed matched.

## Rules: `brand_config_amazon_search_term_rule`

One row per rule of the store: a pattern with an effect, set at the store, at
one family or at one ASIN. The primary key is the store, `level`, `product`,
`matchKind`, `pattern` and `effect`, so one pattern can be a seed and a modifier
at one product as two rows.

- **`level`** and **`product`**: where the rule applies.
  - `STORE`, `product` `*`: every advertised ASIN of the store.
  - `FAMILY`, `product` the `family` value: the store's advertised ASINs of
    that family.
  - `ASIN`, `product` the ASIN in upper case: that one advertised ASIN.
- **`matchKind`**: how `pattern` is compared with the term's words.
  - `EXACT`: the pattern's words are all of the term's words, in order.
  - `PHRASE`: the pattern's words appear in the term next to each other and in
    order.
  - `ALL_WORDS`: each pattern word matches a different word of the term, in
    any order, with any words between.
- **`pattern`**: lower-case words separated by single spaces, written as a
  normalised term would read (step 1).
  - A word may end in `*` to match every term word that starts with what comes
    before it: `mug*` matches `mug`, `mugs` and `mugshot`. A prefix also
    matches words nobody meant, so a short list of alternatives is often
    better.
  - A pattern that starts and ends with `|` is a list of alternatives, each a
    plain pattern: `|mug|mugs|`, `|travel mug|travel cup|`. The rule matches
    when any alternative matches; they are tried in the order written. An
    empty alternative is dropped. A `|` anywhere else is read as a space.
  - Accents are kept and nothing is stemmed: write each spelling the shoppers
    use.
- **`effect`**: what a match does.
  - `SEED`: makes the term relevant to the product, in `termCategory`, with
    `relevance` as its starting score. Only a seed puts a term in a category.
  - `MODIFIER`: adds `relevance` to a seed's score, using only words the seed
    did not use. It never makes a term relevant on its own.
  - `EXCLUDE`: puts the term out for the products the rule applies to, unless
    a positive rule lifts it (step 4).
- **`termCategory`**: the category a `SEED` puts the term in; `NULL` for the
  other effects.
- **`relevance`**:
  - `SEED`: `5` spot on; `4` relevant within the niche of closely related
    products; `3` relevant within the broader niche; `2` relevant to related
    products. There is no `1`: exclusion is an effect, not a score.
  - `MODIFIER`: `-2`, `-1`, `1` or `2`.
  - `EXCLUDE`: `NULL`.
- **`exclusiveWithin`**: makes the rule a claim. The pattern's words belong to
  this product, and every other ASIN in the scope is excluded for a term the
  pattern matches, unless that ASIN has a positive rule of its own covering
  those words.
  - `STORE`: every other advertised ASIN of the store.
  - `FAMILY`: every other ASIN of the claimant ASIN's family.
  - A claim counts whether or not the claimant still sells: an inactive
    product's claim excludes its siblings like any other.
- **`comment`**: why the rule exists, in a few words.

## What a row may hold

The tables declare their keys and the foreign key from a seed's category to the
category table, and nothing else: no check constraint. A row that breaks a rule
below is stored without an error, takes no part in the classification, and
shows on the Search intent tab with its problem. Check every row of a draft
against this list before writing it.

A category:

- `termCategory` is not empty and is not `Excluded`, `ASIN, own`,
  `ASIN, other`, `No search term` or `Unmatched`.
- `brand` is `NULL` or one of `OWN`, `COMPETITOR`, `PARTNER`, `COMPLEMENT`.

A rule:

- `level`, `matchKind`, `effect` and `exclusiveWithin` hold one of their listed
  values, in upper case, or `NULL` for `exclusiveWithin`.
- `product` is `*` exactly when `level` is `STORE`. A `FAMILY` rule's `product`
  is not empty. An `ASIN` rule's `product` is an ASIN or ISBN-10 in upper case.
- `pattern` is lower case and has at least one word. Each word is letters,
  digits, or a period between two digits, as step 1 leaves them, and may end in
  `*` after at least one other character; `*` alone or inside a word is not
  allowed.
- A `SEED` names a category of the same store that is itself usable, and has
  `relevance` 2 to 5.
- A `MODIFIER` has `termCategory` `NULL`, `matchKind` `PHRASE` or `ALL_WORDS`
  (an `EXACT` modifier would have to reuse the seed's words), and `relevance`
  `-2`, `-1`, `1` or `2`.
- An `EXCLUDE` has `termCategory` and `relevance` `NULL`.
- `exclusiveWithin` is set only on a `SEED` or a `MODIFIER` with positive
  relevance, at `FAMILY` level (`STORE` only) or at `ASIN` level (`STORE` or
  `FAMILY`); never at `STORE` level.

**A family name that no ASIN has is not a problem the page reports.** The rule is
valid and matches nothing. Compare every `FAMILY` rule's `product` with the
families the store's listings have before writing it.

## How a search term is classified

Classification is per (search term, advertised ASIN). A Sponsored Brands
aggregate row, which names no ASIN, is classified with the first creative ASIN
of its ad; a row with no ASIN at all uses the `STORE` rules only. One term can
get two outcomes on two ASINs, and the page then shows it once in each group,
with the clicks of its rows on those ASINs.

For one term and one advertised ASIN, in this order:

1. **Normalise the term.** Lower-case it; turn every character that is not a
   letter, a digit or a period into a space; turn a period that is not between
   two digits into a space; split on spaces. Each word has a position
   (0, 1, 2, …). No word is dropped and none is stemmed. An empty result goes to
   `No search term`.
2. **Match the chain.** The chain is `STORE` (depth 0), the ASIN's family for
   the store's country if it has one (depth 1), and the ASIN (depth 2). A match
   records the term positions it used: for `PHRASE` the leftmost occurrence; for
   `ALL_WORDS` the pattern words in order, each given the earliest free position
   that still lets the remaining words match; for `EXACT` every position.
3. **Collect the exclusions.** Every matched `EXCLUDE` rule, at its own depth.
   Every claim of the store that matches the term, from any family or ASIN, not
   only this chain, unless this ASIN is the claimant (the ASIN of an `ASIN`
   claim, or an ASIN of the family of a `FAMILY` claim). A claim
   `exclusiveWithin` `STORE` acts as an exclusion at depth 0; a claim
   `exclusiveWithin` `FAMILY` acts at depth 1 when this ASIN is in the
   claimant's family, and not at all otherwise.
4. **Lift what is covered.** An exclusion stands unless a positive match in
   this ASIN's chain (a `SEED`, or a `MODIFIER` with positive relevance) at the
   same or a deeper depth covers every position the exclusion used. An `EXACT`
   positive covers every position. An `EXACT` `EXCLUDE` is lifted only by an
   `EXACT` `SEED` at the same or a deeper depth. If any exclusion stands, the
   outcome is `Excluded`.
5. **An exact seed decides.** If an `EXACT` `SEED` matched, take the deepest
   (then the higher relevance, then the lower category position): its category
   and its relevance are the outcome, and no modifier applies.
6. **No seed.** If no `SEED` matched, a term that is one ASIN- or ISBN-shaped
   word goes to `ASIN, own` or `ASIN, other`, and anything else to `Unmatched`.
7. **The category** is that of the matched seed whose category has the lowest
   `position`, at any depth.
8. **The relevance** is the best, over every matched seed, of the seed's
   relevance, plus every negative modifier that uses no position of the seed,
   plus the positive modifiers with the largest sum among those that use no
   position of the seed, of an applied negative modifier, or of each other.
   Negative modifiers are always applied and use up their words; of two
   negatives sharing a position only the one with more words counts, and on a
   tie the more negative. A `-2` lowers the score and never excludes. The result
   is limited to 2 to 5. The seed that gives the best relevance need not be the
   seed that gave the category.
9. **The cited rules** are the standing exclusions for `Excluded`; otherwise the
   category's seed and the seed and modifiers of the best relevance.

## A worked example

An invented store with the own brand "Lumora". Family `TRAVEL_MUG` holds a red
and a blue mug; family `KIDS_BOTTLE` holds a bottle. "Brandex" is a competitor,
and "Brewlo" makes coffee machines often bought with a mug. Store columns and
timestamps are left out, an empty cell is `NULL`, and a `|` inside a pattern is
written `\|` in a markdown table.

| termCategory         | position | brand      | comment         |
| -------------------- | -------- | ---------- | --------------- |
| Own brand            | 10       | OWN        |                 |
| Competitor brand     | 20       | COMPETITOR |                 |
| Coffee machine brand | 30       | COMPLEMENT | bought together |
| Travel mug           | 40       |            |                 |
| Kids bottle          | 50       |            |                 |
| Mug, general         | 60       |            |                 |

| #   | level  | product        | matchKind | pattern            | effect   | termCategory         | relevance | exclusiveWithin |
| --- | ------ | -------------- | --------- | ------------------ | -------- | -------------------- | --------- | --------------- |
| r1  | STORE  | \*             | ALL_WORDS | `lumora`           | SEED     | Own brand            | 5         |                 |
| r2  | STORE  | \*             | ALL_WORDS | `brandex`          | SEED     | Competitor brand     | 2         |                 |
| r3  | STORE  | \*             | ALL_WORDS | `brewlo`           | SEED     | Coffee machine brand | 2         |                 |
| r4  | STORE  | \*             | ALL_WORDS | `travel mug*`      | SEED     | Travel mug           | 4         |                 |
| r5  | STORE  | \*             | ALL_WORDS | `\|mug\|mugs\|`    | SEED     | Mug, general         | 3         |                 |
| r6  | STORE  | \*             | ALL_WORDS | `insulated`        | MODIFIER |                      | 1         |                 |
| r7  | STORE  | \*             | ALL_WORDS | `ceramic`          | MODIFIER |                      | -1        |                 |
| r8  | STORE  | \*             | PHRASE    | `replacement lid*` | EXCLUDE  |                      |           |                 |
| r9  | FAMILY | TRAVEL_MUG     | ALL_WORDS | `kid*`             | EXCLUDE  |                      |           |                 |
| r10 | FAMILY | KIDS_BOTTLE    | ALL_WORDS | `kid* bottle*`     | SEED     | Kids bottle          | 4         |                 |
| r11 | ASIN   | (the red mug)  | ALL_WORDS | `red`              | MODIFIER |                      | 1         | FAMILY          |
| r12 | ASIN   | (the blue mug) | ALL_WORDS | `blue`             | MODIFIER |                      | 1         | FAMILY          |

| term                             | on           | outcome                  | why                                                                                                  |
| -------------------------------- | ------------ | ------------------------ | ---------------------------------------------------------------------------------------------------- |
| `insulated travel mugs`          | either mug   | Travel mug, 5            | r4 and r5 match; Travel mug has the lower position; r4 4 + r6 1 beats r5 3 + r6 1                    |
| `red travel mug`                 | the red mug  | Travel mug, 5            | r4 4 + r11 1; the red mug is the claimant                                                            |
| `red travel mug`                 | the blue mug | Excluded                 | r11 claims `red` within the family, and nothing in the blue mug's chain at depth 1 or 2 covers `red` |
| `brandex travel mug`             | either mug   | Competitor brand, 4      | the category from r2 (position 20), the relevance from r4                                            |
| `kids water bottle`              | the bottle   | Kids bottle, 4           | r10                                                                                                  |
| `kids water bottle`              | either mug   | Excluded                 | r9; no positive at the family or the ASIN covers `kids`                                              |
| `replacement lid for lumora mug` | either mug   | Excluded                 | r8; r1 and r5 match, but neither covers `replacement lid`                                            |
| `ceramic coffee mug`             | either mug   | Mug, general, 2          | r5 3 + r7 -1                                                                                         |
| `stainless tumbler`              | any          | Unmatched                | no seed matches                                                                                      |
| an ASIN typed as the term        | any          | ASIN, own or ASIN, other | no seed matches a single ASIN-shaped word                                                            |

Had the draft added a `STORE` seed `red`, it would still not lift r11's claim on
the blue mug: the claim acts at depth 1, deeper than a `STORE` rule. A claim
`exclusiveWithin` `STORE` acts at depth 0 instead, so a `STORE` positive that
covers its word lifts it on every ASIN of the store.

## The reads

Every read runs through `executeSql`, one statement per call. Replace
`<merchantId>` and `<marketplaceId>` with the store's values as quoted literals:
`executeSql` takes no bind parameters.

### The stores

Clicks and spend per store over the 28 days ending yesterday:

```sql
SELECT r."merchantId", r."marketplaceId", m."country_code",
  sum(r."clicks") AS "clicks", round(sum(r."totalCost")::numeric, 2) AS "spend"
FROM "amzadapi_reports_v1__search_asin_placement__byDay" r
LEFT JOIN "amazon_marketplace" m ON m."marketplace_id" = r."marketplaceId"
WHERE r."date" BETWEEN CURRENT_DATE - 28 AND CURRENT_DATE - 1
GROUP BY 1, 2, 3
ORDER BY 4 DESC
```

### The store's products

The store's listings with their status, family and title:

```sql
SELECT l."asin", string_agg(DISTINCT l."status", ',') AS "status",
  max(COALESCE(a."countryToFamily"->>l."country_code", a."family")) AS "family",
  max(a."labelInFamily") AS "labelInFamily", max(l."item_name") AS "title"
FROM "amazon_listing_all" l
LEFT JOIN "brand_config_amazon_asin" a ON a."asin" = l."asin"
WHERE l."merchant_id" = '<merchantId>' AND l."marketplace_id" = '<marketplaceId>'
  AND l."asin" IS NOT NULL
GROUP BY l."asin"
ORDER BY "family" NULLS LAST, l."asin"
```

### The search terms

The three reads below share one beginning. It reads the 28 days ending
yesterday for one store, counts every Sponsored Brands key once (its per-ASIN
rows when it has any, else its aggregate row, as
`${CLAUDE_PLUGIN_ROOT}/docs/sql-reference.md` explains), gives a kept aggregate
row its ad's first creative ASIN, and tells Sponsored Brands video (`SBV`) from
`SB` by the ad's `adType`. An SB row whose ad is missing from the export counts
as `SB`.

```sql
WITH sb_ad AS (
  SELECT a."adId", a."adType",
    COALESCE(a."creative"->'products'->0->>'productId', a."creative"->'asins'->>0) AS "firstAsin"
  FROM "amzadapi_exports_v1__ad" a
  WHERE a."merchantId" = '<merchantId>' AND a."marketplaceId" = '<marketplaceId>'
    AND a."adProduct" IN ('SPONSORED_BRANDS', 'SPONSORED_BRANDS_VIDEO')
),
src AS (
  SELECT r.*
  FROM "amzadapi_reports_v1__search_asin_placement__byDay" r
  WHERE r."merchantId" = '<merchantId>' AND r."marketplaceId" = '<marketplaceId>'
    AND r."date" BETWEEN CURRENT_DATE - 28 AND CURRENT_DATE - 1
    AND NOT (r."adProduct" = 'Sponsored Brands' AND r."advertisedProductId" = ''
      AND EXISTS (
        SELECT 1 FROM "amzadapi_reports_v1__search_asin_placement__byDay" t
        WHERE t."advertisedProductId" <> ''
          AND t."merchantId" = r."merchantId" AND t."marketplaceId" = r."marketplaceId"
          AND t."date" = r."date" AND t."adProduct" = r."adProduct"
          AND t."campaignId" = r."campaignId" AND t."adGroupId" = r."adGroupId"
          AND t."adId" = r."adId" AND t."targetMatchType" = r."targetMatchType"
          AND t."target" = r."target" AND t."searchTerm" = r."searchTerm"
          AND t."placementClassification" = r."placementClassification"))
),
tagged AS (
  SELECT r."searchTerm",
    COALESCE(NULLIF(r."advertisedProductId", ''), sb."firstAsin", '') AS "asin",
    CASE r."adProduct"
      WHEN 'Sponsored Products' THEN 'SP'
      WHEN 'Sponsored Display' THEN 'SD'
      WHEN 'Sponsored Brands' THEN
        CASE WHEN sb."adType" IN ('VIDEO', 'BRAND_VIDEO') THEN 'SBV' ELSE 'SB' END
      ELSE r."adProduct"
    END AS "adType",
    r."placementClassification" AS "placement",
    r."impressions", r."clicks", r."purchases", r."totalCost", r."sales"
  FROM src r
  LEFT JOIN sb_ad sb ON r."adProduct" = 'Sponsored Brands' AND sb."adId" = r."adId"
)
```

Each read below continues that `WITH` list. Pass `limit: 1000` to `executeSql`
for the first two, whose `LIMIT` is above its default of 500 rows.

**The most-clicked terms**, by clicks and spend per ad type × placement:

```sql
WITH sb_ad AS (…), src AS (…), tagged AS (…),  -- the shared beginning
cell AS (
  SELECT "searchTerm", "adType", "placement",
    sum("clicks") AS "clicks", sum("impressions") AS "impressions", sum("purchases") AS "orders",
    round(sum("totalCost")::numeric, 2) AS "spend", round(sum("sales")::numeric, 2) AS "sales"
  FROM tagged
  GROUP BY 1, 2, 3
),
term AS (
  SELECT "searchTerm", sum("clicks") AS "termClicks", sum("spend") AS "termSpend"
  FROM cell GROUP BY 1
)
SELECT c."searchTerm", c."adType", c."placement", c."clicks", c."impressions", c."orders",
  c."spend", c."sales", t."termClicks", t."termSpend"
FROM cell c JOIN term t USING ("searchTerm")
ORDER BY t."termClicks" DESC, t."termSpend" DESC, c."searchTerm", c."adType", c."placement"
LIMIT 1000
```

**Words and two-word sequences** by clicks over the terms made of words
(ASIN-shaped and empty terms left out), to find the store's vocabulary and the
brand names in it:

```sql
WITH sb_ad AS (…), src AS (…), tagged AS (…),  -- the shared beginning
term AS (
  SELECT lower("searchTerm") AS "term", sum("clicks") AS "clicks", sum("purchases") AS "orders",
    sum("totalCost") AS "spend"
  FROM tagged
  WHERE "searchTerm" !~* '^(b0[0-9a-z]{8}|[0-9]{9}[0-9x])$' AND "searchTerm" <> ''
  GROUP BY 1
),
word AS (
  SELECT t."term", x."w", x."i"
  FROM term t,
    unnest(regexp_split_to_array(trim(regexp_replace(t."term", '[^[:alnum:]]+', ' ', 'g')), ' '))
      WITH ORDINALITY AS x("w", "i")
),
gram AS (
  SELECT DISTINCT "term", "w" AS "gram", 1 AS "n" FROM word
  UNION
  SELECT DISTINCT a."term", a."w" || ' ' || b."w", 2
  FROM word a JOIN word b ON b."term" = a."term" AND b."i" = a."i" + 1
)
SELECT g."n", g."gram", sum(t."clicks") AS "clicks", sum(t."orders") AS "orders",
  round(sum(t."spend")::numeric, 2) AS "spend", count(*) AS "terms"
FROM gram g JOIN term t USING ("term")
GROUP BY 1, 2
HAVING sum(t."clicks") >= 10
ORDER BY 3 DESC
LIMIT 1000
```

**Candidate words per advertised family**, to see which words belong to one
product line and which run on products they do not fit. The candidates are
words chosen from the two results above and from the listing titles; the list
below is a placeholder to replace with them.

```sql
WITH sb_ad AS (…), src AS (…), tagged AS (…),  -- the shared beginning
term_asin AS (
  SELECT lower("searchTerm") AS "term", "asin",
    sum("clicks") AS "clicks", sum("purchases") AS "orders", sum("totalCost") AS "spend"
  FROM tagged GROUP BY 1, 2
),
candidate("word") AS (
  VALUES ('<word>'), ('<another word>'), ('<a prefix>')
)
SELECT c."word",
  COALESCE(a."countryToFamily"->>m."country_code", a."family", '(no family) ' || t."asin") AS "family",
  sum(t."clicks") AS "clicks", sum(t."orders") AS "orders", round(sum(t."spend")::numeric, 2) AS "spend"
FROM term_asin t
JOIN candidate c ON t."term" ~ ('\m' || c."word")
LEFT JOIN "brand_config_amazon_asin" a ON a."asin" = t."asin"
LEFT JOIN "amazon_marketplace" m ON m."marketplace_id" = '<marketplaceId>'
GROUP BY 1, 2
ORDER BY 1, 3 DESC
```

`\m` matches the start of a word, so a candidate is a word or the start of one,
as a pattern word ending in `*` is.

### The existing rules

The store's rows of both tables, in two calls; rows here mean the run is a re-run:

```sql
SELECT * FROM "brand_config_amazon_search_term_category"
WHERE "merchantId" = '<merchantId>' AND "marketplaceId" = '<marketplaceId>'
ORDER BY "position"
```

```sql
SELECT * FROM "brand_config_amazon_search_term_rule"
WHERE "merchantId" = '<merchantId>' AND "marketplaceId" = '<marketplaceId>'
ORDER BY "level", "product", "effect", "pattern"
```
