# Databrill Core Agent

This Claude plugin gives a Databrill client one supported way to explore their
data in Claude Code or Cowork. It combines:

- the hosted `core` MCP connector and its OAuth sign-in;
- skills for advertising, traffic, search, rank, profitability, sales-drop,
  Amazon inventory pacing, and The Fulfillment Lab inventory questions;
- guidance for off-menu questions, dashboards, n8n, and single- or
  multi-workspace use;
- diagnosis methods, the product-family hierarchy, and a SQL reference for the
  column names, quoting rules, and data shapes that differ per relation;
- read-only Deno helpers for users who have a direct database credential;
- a generated description of every table and view Databrill can provision in a
  client database, one index per channel group.

Start with [Getting started](docs/getting-started.md). The connector works
without any URL configuration; if Databrill provides a scoped MCP URL, use it
exactly and never guess it or substitute another client's workspace id.

## Install in Claude Code

Add the repository as a marketplace and install the plugin:

```text
/plugin marketplace add databrill/databrill-core-agent-plugin
/plugin install databrill-core@databrill
```

When prompted for the MCP URL, leave it empty unless Databrill supplied a scoped
one. Run `/mcp`, select the `core` server under the plugin, and complete the
browser sign-in.

For local plugin development:

```bash
claude --plugin-dir /path/to/databrill-core-agent-plugin
```

## Install in Cowork

Open Customize → Plugins. Add this GitHub repository as a marketplace, or upload
the plugin package supplied by Databrill. Install `databrill-core`, leave the
MCP URL empty unless Databrill supplied a scoped one, then connect the `core`
server and complete OAuth.

The plugin is for Claude Code and Cowork. A plain Claude chat can use the same
remote connector, but it does not install this skill package.

## Choose a scope

Leaving the MCP URL setting empty is the normal choice. The plugin then uses
`https://mcp.databrill.com/mcp/user`, which exposes every workspace the
signed-in user is allowed to access — for most users, their one workspace.

Set the URL explicitly to narrow that:

- `https://mcp.databrill.com/mcp/workspace/{wsid}` keeps a session in one
  workspace.
- `https://mcp.databrill.com/mcp/org/{orgId}` exposes the authorized workspaces
  in one organization.

The URL selects a scope; OAuth permissions remain authoritative. Multi-workspace
calls still query one workspace at a time. See
[Configuration and workspace scopes](docs/configuration.md).

## Guides

- [Getting started](docs/getting-started.md)
- [Configuration and workspace scopes](docs/configuration.md)
- [What data the MCP returns](docs/data-coverage.md)
- [Common questions](docs/common-questions.md)
- [Diagnosis methods](docs/diagnosis-methods.md)
- [Product families and the catalogue hierarchy](docs/product-hierarchy.md)
- [SQL quick reference](docs/sql-reference.md)
- [Search Query Performance data shape](docs/sqp-data-shape.md)
- [Building dashboards](docs/dashboards.md)
- [Using the database from n8n](docs/n8n.md)
- [Installing Deno and running the helpers](docs/deno.md)
- [Declared tenant schema](docs/schema/README.md) — one index per channel group
  (Amazon, Walmart, Shopify, The Fulfillment Lab, common), one YAML file per
  table or view

When reporting results, use plain language, include the period and marketplace,
state each important metric with its value, and attach an ASIN or SKU to every
named product.
