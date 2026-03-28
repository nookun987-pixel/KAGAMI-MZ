const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require("@modelcontextprotocol/sdk/types.js");
const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const DATABASE_ID = process.env.MIKAGE_NOTION_DB;

if (!process.env.NOTION_API_KEY || !process.env.MIKAGE_NOTION_DB) {
  console.error("Missing NOTION_API_KEY or MIKAGE_NOTION_DB");
  process.exit(1);
}

const server = new Server(
  { name: "mikage-notion-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "create_mikage_task",
      description: "Create a new task row in Mikage Notion database",
      inputSchema: {
        type: "object",
        properties: {
          title: { type: "string" },
          prompt: { type: "string" },
          type: { type: "string", default: "image_render" },
          status: { type: "string", default: "Ready" },
          assigned_ai: { type: "string", default: "Auto" },
          mode: { type: "string", default: "MANUAL" },
          next_step: { type: "string", default: "Send to Ollama" },
          raw_request: { type: "string" },
          context: { type: "string" }
        },
        required: ["title", "prompt"]
      }
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== "create_mikage_task") {
    throw new Error(`Unknown tool: ${request.params.name}`);
  }

  const a = request.params.arguments || {};

  const page = await notion.pages.create({
    parent: { database_id: DATABASE_ID },
    properties: {
      Title: {
        title: [{ text: { content: a.title } }]
      },
      Prompt: {
        rich_text: [{ text: { content: a.prompt } }]
      },
      Type: {
        select: { name: a.type || "image_render" }
      },
      Status: {
        select: { name: a.status || "Ready" }
      },
      "Assigned AI": {
        select: { name: a.assigned_ai || "Auto" }
      },
      Mode: {
        select: { name: a.mode || "MANUAL" }
      },
      "Next Step": {
        select: { name: a.next_step || "Send to Ollama" }
      },
      "Raw Request": {
        rich_text: [{ text: { content: a.raw_request || a.prompt } }]
      },
      Context: {
        rich_text: [{ text: { content: a.context || "" } }]
      }
    }
  });

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({
          ok: true,
          page_id: page.id,
          url: page.url
        })
      }
    ]
  };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});