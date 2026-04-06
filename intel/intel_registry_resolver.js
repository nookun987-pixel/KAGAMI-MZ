const fs = require('fs');
const path = require('path');

const REGISTRY_PATH = path.join(__dirname, '..', 'memory', 'intel_registry.json');

function loadRegistry() {
  if (!fs.existsSync(REGISTRY_PATH)) {
    return [];
  }

  const raw = fs.readFileSync(REGISTRY_PATH, 'utf8').trim();
  if (!raw) {
    return [];
  }

  const parsed = JSON.parse(raw);

  if (Array.isArray(parsed)) {
    return parsed;
  }

  if (Array.isArray(parsed.records)) {
    return parsed.records;
  }

  return [];
}

function resolveIntel(name) {
  const registry = loadRegistry();

  const found = registry.find(item =>
    typeof item.name === 'string' &&
    item.name.toLowerCase() === String(name).toLowerCase()
  );

  if (!found) {
    return {
      found: false,
      query: name
    };
  }

  return {
    found: true,
    query: name,
    record: found
  };
}

module.exports = resolveIntel;