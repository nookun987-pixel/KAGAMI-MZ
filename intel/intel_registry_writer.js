// intel/intel_registry_writer.js
const fs = require('fs');
const path = require('path');

const DEFAULT_REGISTRY_PATH = path.join(__dirname, '..', 'memory', 'intel_registry.json');

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

function loadRegistry(filePath = DEFAULT_REGISTRY_PATH) {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const content = fs.readFileSync(filePath, 'utf8');
  if (!content.trim()) return [];
  const data = JSON.parse(content);
  if (!Array.isArray(data)) {
    throw new Error('Registry file must contain an array');
  }
  return data;
}

function saveRegistry(records, filePath = DEFAULT_REGISTRY_PATH) {
  ensureDir(filePath);
  const json = JSON.stringify(records, null, 2);
  fs.writeFileSync(filePath, json, 'utf8');
}

function getIdentity(record) {
  if (record.id) return record.id;
  if (record.name) return `intel:${slugify(record.name)}`;
  return null;
}

function addRecord(record, filePath = DEFAULT_REGISTRY_PATH) {
  if (typeof record !== 'object' || record === null) {
    throw new TypeError('addRecord() expects an object');
  }

  const id = getIdentity(record);
  if (!id) {
    throw new Error('Record must have id or name');
  }

  const registry = loadRegistry(filePath);
  let found = false;

  for (let i = 0; i < registry.length; i++) {
    const existingId = getIdentity(registry[i]);
    if (existingId === id) {
      registry[i] = { ...registry[i], ...record };
      found = true;
      break;
    }
  }

  if (!found) {
    registry.push(record);
  }

  saveRegistry(registry, filePath);
}

function addRecords(records, filePath = DEFAULT_REGISTRY_PATH) {
  if (!Array.isArray(records)) {
    throw new TypeError('addRecords() expects an array');
  }

  let registry = loadRegistry(filePath);
  const map = new Map();

  for (let i = 0; i < registry.length; i++) {
    const id = getIdentity(registry[i]);
    if (id) map.set(id, i);
  }

  for (const record of records) {
    const id = getIdentity(record);
    if (!id) continue;

    if (map.has(id)) {
      const idx = map.get(id);
      registry[idx] = { ...registry[idx], ...record };
    } else {
      map.set(id, registry.length);
      registry.push(record);
    }
  }

  saveRegistry(registry, filePath);
}

module.exports = {
  loadRegistry,
  saveRegistry,
  addRecord,
  addRecords,
  DEFAULT_REGISTRY_PATH,
  getIdentity,
};