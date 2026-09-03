---
name: dbl-setup
description: Set up, configure, verify, or troubleshoot the Databrill plugin and hosted MCP connector in Claude Code or Cowork. Use when the user asks how to install Databrill, connect or authenticate the MCP, choose a workspace/org/user URL, use one versus many workspaces, install Deno, configure direct database access, update the plugin, or fix a missing/unauthorized connector.
---

# Set up Databrill

Use the hosted `core` connector for normal client setup. Do not ask
for a database password, local source checkout, Bun, or Deno unless the user
specifically needs direct database scripts.

## Route the request

- For installation and first verification, read
  `${CLAUDE_PLUGIN_ROOT}/docs/getting-started.md`.
- For workspace-, organization-, and user-scoped URLs or direct database config,
  read `${CLAUDE_PLUGIN_ROOT}/docs/configuration.md`.
- For Deno, read `${CLAUDE_PLUGIN_ROOT}/docs/deno.md`.

The MCP URL setting is optional, and leaving it empty is the normal setup: it
uses the user-scoped URL, which covers every workspace the signed-in user can
access, and most users have one workspace. A workspace- or organization-scoped
URL only narrows that, and Databrill supplies it complete — never guess a wsid
or org id. Explain that OAuth membership, not the URL, controls access.

For a multi-workspace connection, verify with `listWorkspaces` before calling a
metric tool. For a single-workspace connection, `listWorkspaces` is
intentionally absent.

When troubleshooting, inspect connector status first, then distinguish URL
configuration, OAuth authentication, authorization membership, and unsupported
data coverage. Do not solve an authorization error by widening the scope, either
by clearing the URL or by switching to the user-scoped one: the missing piece is
membership, which a wider URL cannot supply. When the write tool is not listed,
or the user says they cannot edit configuration, the cause is the URL's mode
rather than membership: every URL is read-only unless it ends in `/rw`, which
grants nothing new but does announce the write tool.
