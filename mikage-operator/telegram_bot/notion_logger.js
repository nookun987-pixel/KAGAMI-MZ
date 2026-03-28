const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

async function logTask(task) {
  if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) return;
  try {
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        'Task ID': { title: [{ text: { content: task.task_id } }] },
        'Title': { rich_text: [{ text: { content: task.title } }] },
        'Raw Command': { rich_text: [{ text: { content: task.raw_command } }] },
        'Objective': { rich_text: [{ text: { content: task.normalized_objective } }] },
        'Status': { select: { name: task.status } },
        'Priority': { select: { name: task.priority } },
        'Executor Type': { select: { name: task.executor_type } },
        'Created Time': { date: { start: task.created_at } },
        'Updated Time': { date: { start: task.updated_at } },
        'Output Summary': { rich_text: [{ text: { content: task.result } }] },
        'Blocker': { rich_text: [{ text: { content: task.blocker } }] },
        'Artifact Path': { rich_text: [{ text: { content: task.artifact_path } }] }
      }
    });
  } catch (err) {
    console.error('Notion log error:', err.message);
  }
}

async function updateTask(task) {
  if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) return;
  // Find page by Task ID and update
  // Simplified: assume we store page_id in task, but for now skip update
}

module.exports = { logTask, updateTask };