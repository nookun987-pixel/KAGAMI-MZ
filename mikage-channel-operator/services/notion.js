const { Client } = require('@notionhq/client');
const config = require('../config');

let notion = null;

function getClient() {
  if (!notion) {
    notion = new Client({ auth: config.NOTION_API_KEY });
  }
  return notion;
}

async function saveToNotion(data) {
  const client = getClient();
  const contents = data.contents || [];

  const results = [];

  for (const item of contents) {
    const properties = {
      Name: {
        title: [{ text: { content: `[${item.type}] ${item.hook || item.slides?.[0] || 'content'}` } }],
      },
      Type: {
        select: { name: item.type },
      },
      Status: {
        select: { name: item.status || 'ready' },
      },
    };

    const children = [];

    if (item.type === 'short_post') {
      children.push(
        { object: 'block', type: 'heading_3', heading_3: { rich_text: [{ text: { content: 'Hook' } }] } },
        { object: 'block', type: 'paragraph', paragraph: { rich_text: [{ text: { content: item.hook || '' } }] } },
        { object: 'block', type: 'heading_3', heading_3: { rich_text: [{ text: { content: 'Body' } }] } },
        { object: 'block', type: 'paragraph', paragraph: { rich_text: [{ text: { content: item.body || '' } }] } },
        { object: 'block', type: 'heading_3', heading_3: { rich_text: [{ text: { content: 'CTA' } }] } },
        { object: 'block', type: 'paragraph', paragraph: { rich_text: [{ text: { content: item.cta || '' } }] } },
      );
    } else if (item.type === 'carousel') {
      children.push(
        { object: 'block', type: 'heading_3', heading_3: { rich_text: [{ text: { content: 'Slides' } }] } },
      );
      for (let i = 0; i < (item.slides || []).length; i++) {
        children.push({
          object: 'block', type: 'numbered_list_item',
          numbered_list_item: { rich_text: [{ text: { content: item.slides[i] || '' } }] },
        });
      }
    } else if (item.type === 'caption') {
      children.push(
        { object: 'block', type: 'heading_3', heading_3: { rich_text: [{ text: { content: 'Hook' } }] } },
        { object: 'block', type: 'paragraph', paragraph: { rich_text: [{ text: { content: item.hook || '' } }] } },
        { object: 'block', type: 'heading_3', heading_3: { rich_text: [{ text: { content: 'Pain' } }] } },
        { object: 'block', type: 'paragraph', paragraph: { rich_text: [{ text: { content: item.pain || '' } }] } },
        { object: 'block', type: 'heading_3', heading_3: { rich_text: [{ text: { content: 'Insight' } }] } },
        { object: 'block', type: 'paragraph', paragraph: { rich_text: [{ text: { content: item.insight || '' } }] } },
        { object: 'block', type: 'heading_3', heading_3: { rich_text: [{ text: { content: 'CTA' } }] } },
        { object: 'block', type: 'paragraph', paragraph: { rich_text: [{ text: { content: item.cta || '' } }] } },
      );
    }

    const page = await client.pages.create({
      parent: { database_id: config.NOTION_DB_ID },
      properties,
      children,
    });

    results.push(page.id);
  }

  console.log(`[NOTION] ✓ Created ${results.length} pages`);
  return results;
}

module.exports = { saveToNotion };
