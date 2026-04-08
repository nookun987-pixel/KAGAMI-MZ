const fs = require('fs-extra');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

class SharedState {
  constructor() {
    this.tasks = [];
    this.services = {};
    this.runs = [];
    this.costs = [];
    this.artifacts = [];
    this.alerts = [];
    this.loadState();
  }

  loadState() {
    try {
      fs.ensureDirSync(DATA_DIR);
      this.tasks = this.loadJson('tasks.json') || [];
      this.services = this.loadJson('services.json') || {};
      this.runs = this.loadJson('runs.json') || [];
      this.costs = this.loadJson('costs.json') || [];
      this.artifacts = this.loadJson('artifacts.json') || [];
      this.alerts = this.loadJson('alerts.json') || [];
    } catch (error) {
      console.error('Error loading state:', error);
    }
  }

  loadJson(file) {
    try {
      const content = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
      return JSON.parse(content);
    } catch {
      return null;
    }
  }

  saveState() {
    try {
      fs.writeJsonSync(path.join(DATA_DIR, 'tasks.json'), this.tasks);
      fs.writeJsonSync(path.join(DATA_DIR, 'services.json'), this.services);
      fs.writeJsonSync(path.join(DATA_DIR, 'runs.json'), this.runs);
      fs.writeJsonSync(path.join(DATA_DIR, 'costs.json'), this.costs);
      fs.writeJsonSync(path.join(DATA_DIR, 'artifacts.json'), this.artifacts);
      fs.writeJsonSync(path.join(DATA_DIR, 'alerts.json'), this.alerts);
    } catch (error) {
      console.error('Error saving state:', error);
    }
  }

  getTasks() { return this.tasks; }
  setTasks(tasks) { this.tasks = tasks; this.saveState(); }

  getServices() { return this.services; }
  setServices(services) { this.services = services; this.saveState(); }

  getRuns() { return this.runs; }
  setRuns(runs) { this.runs = runs; this.saveState(); }

  getCosts() { return this.costs; }
  setCosts(costs) { this.costs = costs; this.saveState(); }

  getArtifacts() { return this.artifacts; }
  setArtifacts(artifacts) { this.artifacts = artifacts; this.saveState(); }

  getAlerts() { return this.alerts; }
  setAlerts(alerts) { this.alerts = alerts; this.saveState(); }

  // Helper methods
  addTask(task) {
    task.task_id = Date.now().toString();
    task.created_at = new Date().toISOString();
    task.updated_at = new Date().toISOString();
    task.status = task.status || 'pending';
    this.tasks.push(task);
    this.saveState();
    return task.task_id;
  }

  updateTask(taskId, updates) {
    const task = this.tasks.find(t => t.task_id === taskId);
    if (task) {
      Object.assign(task, updates, { updated_at: new Date().toISOString() });
      this.saveState();
    }
  }

  addRun(run) {
    this.runs.push(run);
    this.saveState();
  }

  addCost(cost) {
    this.costs.push(cost);
    this.saveState();
  }

  addArtifact(artifact) {
    this.artifacts.unshift(artifact); // latest first
    this.saveState();
  }

  addAlert(alert) {
    this.alerts.push(alert);
    this.saveState();
  }
}

const sharedState = new SharedState();

module.exports = sharedState;