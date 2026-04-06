// intel/intel_report_normalizer.js
const fs = require('fs');

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

function normalize(text) {
  if (typeof text !== 'string') {
    throw new TypeError('normalize() expects a string');
  }

  const lines = text.split(/\r?\n/);
  const fields = {};
  let currentKey = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const match = line.match(/^(?:\d+\.\s*)?([A-Za-z\s\/]+?):\s*(.*)$/);
    if (match) {
      currentKey = match[1].toUpperCase().trim();
      const value = match[2].trim();
      fields[currentKey] = value;
    } else if (currentKey) {
      fields[currentKey] += ' ' + line;
    }
  }

  const record = {};

  const name = fields['NAME'];
  if (name) {
    record.name = name;
    record.id = `intel:${slugify(name)}`;
  }

  if (fields['TYPE']) {
    record.type = fields['TYPE'].toLowerCase();
  }

  if (fields['FIT FOR MIKAGE']) {
    const val = fields['FIT FOR MIKAGE'].toLowerCase();
    record.fitForMikage = ['yes', 'true', 'y'].includes(val);
  }

  if (fields['USE CASE']) {
    record.useCase = fields['USE CASE'];
  }

  if (fields['INTEGRATION POINT']) {
    record.integrationPoint = fields['INTEGRATION POINT']
      .replace(/\s*[-–•]\s*/g, '')
      .replace(/\s+/g, ' ');
  }

  let verdictField = fields['KEEP OR DROP'] || fields['VERDICT'];
  if (verdictField) {
    const norm = verdictField.trim().toUpperCase();
    record.verdict = norm;
    record.keep = norm === 'KEEP';
  }

  if (fields['REASON']) {
    record.reason = fields['REASON'];
  }

  return record;
}

module.exports = { normalize };