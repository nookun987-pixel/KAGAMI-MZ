const { getState, updateState } = require('./shared_state');

class TaskManager {
    constructor() {
    }

    createTask(title, objective = '', executorType = 'unknown') {
        const taskId = 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
        const now = new Date().toISOString();
        const task = {
            task_id: taskId,
            title: title,
            objective: objective,
            executor_type: executorType,
            status: 'NEW',
            created_at: now,
            updated_at: now,
            result_summary: '',
            blocker: '',
            artifact_paths: [],
            related_run_id: ''
        };
        updateState(state => {
            state.tasks.push(task);
            return state;
        });
        return taskId;
    }

    updateTask(taskId, updates) {
        updateState(state => {
            const task = state.tasks.find(t => t.task_id === taskId);
            if (task) {
                Object.assign(task, updates, { updated_at: new Date().toISOString() });
            }
            return state;
        });
    }

    updateTaskStatus(taskId, status, extra = {}) {
        this.updateTask(taskId, { status: status, ...extra });
    }

    getTask(taskId) {
        if (taskId === 'latest') return this.getLatestTask();
        const state = getState();
        return state.tasks.find(t => t.task_id === taskId) || null;
    }

    getAllTasks() {
        return getState().tasks;
    }

    getPendingTasks() {
        return getState().tasks.filter(t => t.status === 'NEW' || t.status === 'WAITING_APPROVAL');
    }

    getRunningTasks() {
        return getState().tasks.filter(t => t.status === 'RUNNING');
    }

    getCompletedTasks() {
        return getState().tasks.filter(t => t.status === 'DONE');
    }

    getFailedTasks() {
        return getState().tasks.filter(t => t.status === 'FAIL');
    }

    listTasks(limit = 10) {
        const tasks = getState().tasks;
        return tasks.slice(-limit).reverse();
    }

    getLatestTask() {
        const tasks = getState().tasks;
        if (tasks.length === 0) return null;
        return tasks.reduce((latest, task) => {
            return new Date(task.created_at) > new Date(latest.created_at) ? task : latest;
        }, tasks[0]);
    }

    setTaskRunning(taskId) {
        this.updateTaskStatus(taskId, 'RUNNING');
    }

    setTaskCompleted(taskId, resultSummary = '', artifactPaths = []) {
        this.updateTaskStatus(taskId, 'DONE', { result_summary: resultSummary, artifact_paths: artifactPaths });
    }

    setTaskFailed(taskId, blocker = '') {
        this.updateTaskStatus(taskId, 'FAIL', { blocker: blocker });
    }
}

const taskManager = new TaskManager();

module.exports = taskManager;