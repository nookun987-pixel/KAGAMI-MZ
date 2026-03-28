const fs = require('fs-extra');
const path = require('path');

const stateFile = path.join(__dirname, '../data/operator_state.json');

let state = fs.readJsonSync(stateFile, { throws: false }) || {};

function saveState() {
  fs.writeJsonSync(stateFile, state);
}

function getStatus() {
  return JSON.stringify(state, null, 2);
}

function getLastLog() {
  return state.lastLog || 'No logs';
}

function setLastLog(log) {
  state.lastLog = log;
  saveState();
}

function getLastJob() {
  return state.lastJob;
}

function setLastJob(job) {
  state.lastJob = job;
  saveState();
}

function getRetryCount() {
  return state.retryCount || 0;
}

function incrementRetryCount() {
  state.retryCount = (state.retryCount || 0) + 1;
  saveState();
}

function resetRetryCount() {
  state.retryCount = 0;
  saveState();
}

module.exports = { getStatus, getLastLog, setLastLog, getLastJob, setLastJob, getRetryCount, incrementRetryCount, resetRetryCount };