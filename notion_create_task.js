#!/usr/bin/env node

const { Client } = require('@notionhq/client');

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID || '5bde2365519c4d329118871e02d0dceb';

if (!NOTION_TOKEN) {
  console.error('Missing NOTION_TOKEN');
  process.exit(1);
}

const notion = new Client({ auth: NOTION_TOKEN });

async function run() {
  const res = await notion.pages.create({
    parent: { database_id: NOTION_DATABASE_ID },
    properties: {
      'Task Name': {
        title: [{ text: { content: 'Fix render capture' } }],
      },
      'Status': {
        select: { name: 'Ready' },
      },
      'Task Type': {
        select: { name: 'technical' },
      },
      'Brief': {
        rich_text: [{ text: { content: 'Fix output.png capture after Fooocus render' } }],
      },
      'Summary': {
        rich_text: [{ text: { content: 'Assigned AI: Claude' } }],
      },
    },
  });

  console.log('Created:', res.url);
}

run().catch(console.error);