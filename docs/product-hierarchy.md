# Product families and the catalogue hierarchy

Most Databrill catalogues are large and organised into **families** — groups of
variants of the same item. A workspace with ~1,500 selling ASINs can map them
into a few hundred families, and one family can hold 90+ child ASINs.

Family is very often the right level to analyse at. A single variant may sell
two units a week — far too few to conclude anything from — while its family
sells hundreds. Before reporting "no signal", check whether you were looking at
a variant when you should have been looking at its family.

## Use the tools first

`loadAds`, `loadTraffic`, `loadEconomics`, `loadRank` and `loadSqp` all accept
family names in `products`, and `loadAds` / `loadTraffic` accept
`groupBy: "family"`. `inventoryPacing` is family-native. This is the supported
path and needs no SQL.

```text
loadAds({ stores: "US", when: "P4W", groupBy: "family", derived: true })
loadTraffic({ stores: "US", when: "P8W", groupBy: "family", products: "Garlic_Press" })
```

## In SQL, the mapping lives in `brand_config_*`

- `brand_config_amazon_asin` — one row per ASIN: `asin`, `family`, `msku`,
  `labelInFamily`, `labelStandalone`, and a `countryToFamily` JSONB override for
  catalogues where an ASIN belongs to a different family per marketplace.
- `brand_config_amazon_family` — one row per family: `family`, plus optional
  `category`, `msku`, `label`, `description`.

```sql
SELECT f."family",
       count(DISTINCT p."asin")                                        AS asins,
       ROUND(sum(p."ad_spend")::numeric, 2)                            AS spend,
       ROUND(sum(p."ad_revenue")::numeric, 2)                          AS revenue,
       ROUND((sum(p."ad_spend") / NULLIF(sum(p."ad_revenue"), 0))::numeric, 4) AS acos
FROM "product_overview_ad_asin__day" p
JOIN "brand_config_amazon_asin"   a ON a."asin"   = p."asin"
JOIN "brand_config_amazon_family" f ON f."family" = a."family"
WHERE p."merchant_id" = $1 AND p."marketplace_id" = $2
  AND p."date" >= $3 AND p."date" < $4
GROUP BY 1
ORDER BY spend DESC
```

Use `a."family"` alone when you only need the key; join
`brand_config_amazon_family` when you want its label or category. Where
`countryToFamily` is populated, prefer
`COALESCE(a."countryToFamily"->>$country, a."family")`.

## The `brand_ontology_*` views are often empty — that is not "no family data"

`brand_ontology_amazon_asin` and `brand_ontology_amazon_family` are the
better-named objects, and they are frequently empty while the `brand_config_*`
tables underneath are fully populated. In a verified workspace:

| Relation | Rows |
| --- | --- |
| `brand_config_amazon_asin` | 2,295 |
| `brand_config_amazon_family` | 155 |
| `brand_ontology_amazon_asin` | 0 |
| `brand_ontology_amazon_family` | 0 |

The cause is in the view definitions, not the data.
`brand_ontology_amazon_family` inner-joins `brand_config_ontology_category`, and
`brand_ontology_amazon_asin` requires a linked variant or a family category. A
workspace that maps ASINs to families without filling in the ontology
category/variant layer — `category` and `label` NULL on every family row —
produces two empty views over complete configuration.

So: an empty `brand_ontology_*` result is evidence about the ontology layer, not
about whether family data exists. Check `brand_config_amazon_asin` before
concluding the catalogue has no hierarchy.

## Parent ASINs are a separate axis

`amazon_sales_and_traffic` carries `parent_asin` / `child_asin` — Amazon's own
variation relationship, which is per marketplace and independent of the
Databrill family. `loadAds` exposes both (`groupBy: "parentAsin"` and
`groupBy: "family"`). They usually agree, but do not treat them as the same key,
and say which one a rollup used.
