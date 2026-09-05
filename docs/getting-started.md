# Getting started with Databrill in Claude

You need:

- a Claude account that can use plugins and remote connectors;
- the Databrill plugin or marketplace repository;
- a Databrill login with access to the intended workspace or workspaces;
- optionally, a scoped MCP URL supplied by Databrill, if the connector should
  see less than that login can access.

No database password, local MCP checkout, Bun, or Deno installation is required
for the normal hosted-MCP setup.

## Claude Code

1. Start Claude Code.
2. Run `/plugin marketplace add databrill/databrill-core-agent-plugin`.
3. Run `/plugin install databrill-core@databrill`.
4. When the plugin asks for an MCP URL, leave it empty to use every workspace
   your Databrill login can access, or enter the exact scoped URL supplied by
   Databrill.
5. Run `/mcp`, select the `core` server under the plugin, and choose Authenticate.
6. Finish the Databrill sign-in in the browser and return to Claude Code.
7. Start a new session so the installed skills and connector are loaded.

Verify which workspaces the connector can see:

```text
Use Databrill to list my available workspaces. Do not query metrics yet.
```

Expect one workspace unless your Databrill login covers several. If
`listWorkspaces` is unavailable, you entered a workspace-scoped URL, which
intentionally fixes the connector to that one workspace.

Then verify data with:

```text
Using Databrill, list my workspaces, select the intended wsid explicitly, show
which Amazon stores it has, then summarize traffic and conversion for the last
four complete weeks. State the workspace and latest data date.
```

## Cowork

1. Open Customize → Plugins.
2. Add the GitHub marketplace repository supplied by Databrill, or upload the
   plugin package supplied to you.
3. Install `databrill-core`.
4. Leave the MCP URL empty, or enter the exact scoped URL supplied by Databrill.
5. Connect the `core` server and finish the Databrill OAuth sign-in.
6. Open a new Cowork task and use one of the verification prompts above.

If an organization administrator controls connectors, they must first add or
approve the remote connector. Each user still signs in individually.

## First useful questions

Try one question at a time and name the marketplace and period:

```text
Why did UK sales change in the last 7 days compared with the previous 28 days?
```

```text
Show weekly sessions, units, sales, and conversion for US over the last 8 weeks.
```

```text
Which products have less than 21 days of inventory runway, and how should we
adjust ad spend?
```

For more examples, see [Common questions](common-questions.md).

## Update or remove

In Claude Code, run `/plugin` and use the Installed tab to update, disable, or
uninstall the plugin. In Cowork, use Customize → Plugins. Disabling or removing
the plugin removes the packaged skills and connector declaration; it does not
change your Databrill account permissions.

## Troubleshooting

### The connector asks for a URL

Leave the field empty unless Databrill supplied a scoped URL. The plugin then
uses `https://mcp.databrill.com/mcp/user`, which exposes every workspace the
signed-in user can access. If you were given a URL, paste it complete: do not
use only `https://mcp.databrill.com`, and do not guess a workspace id.

### Authentication succeeds but access is denied

The signed-in Databrill user does not have current membership in the requested
scope. Ask the workspace administrator or Databrill to check membership.
Changing the URL cannot grant access.

### Claude says a tool is unavailable

Run `/mcp` in Claude Code or check the connector in Cowork. Reconnect if needed,
then start a new session. Also check
[What data the MCP returns](data-coverage.md): some database data does not yet
have a dedicated MCP tool.

### A data call says wsid is required

Ask Claude to call `listWorkspaces`, select a workspace id, then make one data
call per workspace with that `wsid`. This also applies when the user-scoped or
organization-scoped directory contains one workspace. Do not total currencies
across workspaces unless you also specify a currency-conversion method.

## Official Claude references

- [Use plugins in Cowork](https://claude.com/docs/cowork/guide/plugins)
- [Discover and install Claude Code plugins](https://code.claude.com/docs/en/discover-plugins)
- [Connect Claude Code to remote MCP servers](https://code.claude.com/docs/en/mcp)
- [Use custom remote connectors in Claude](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp)
