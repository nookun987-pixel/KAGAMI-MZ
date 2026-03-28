const { getState, updateState } = require('./shared_state');
const taskManager = require('./task_manager');

function generateRunId() {
    return 'run_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
}

function normalizeRunRequest(rawInput) {
    if (!rawInput || typeof rawInput !== 'string') {
        return {
            raw_input: '',
            normalized_job: '',
            requested_at: new Date().toISOString()
        };
    }
    const trimmed = rawInput.trim();
    return {
        raw_input: trimmed,
        normalized_job: trimmed,
        requested_at: new Date().toISOString()
    };
}

function resolveExecutor(normalizedRequest) {
    const job = normalizedRequest.normalized_job || '';
    if (job.includes('.js')) {
        return 'local_script';
    }
    return 'orchestrator';
}

function createRunRecord(task, normalizedRequest, executorType) {
    const runId = generateRunId();
    const now = new Date().toISOString();
    const run = {
        run_id: runId,
        task_id: task.task_id,
        raw_input: normalizedRequest.raw_input,
        normalized_job: normalizedRequest.normalized_job,
        executor_type: executorType,
        status: 'CREATED',
        created_at: now,
        updated_at: now,
        command: '',
        result_summary: '',
        blocker: ''
    };
    updateState(state => {
        state.runs.push(run);
        return state;
    });
    return run;
}

function updateRunStatus(runId, status, extra) {
    updateState(state => {
        const run = state.runs.find(r => r.run_id === runId);
        if (run) {
            run.status = status;
            run.updated_at = new Date().toISOString();
            if (extra.result_summary) run.result_summary = extra.result_summary;
            if (extra.blocker) run.blocker = extra.blocker;
            if (extra.command) run.command = extra.command;
        }
        return state;
    });
}

function getLatestRun() {
    const state = getState();
    if (state.runs.length === 0) return null;
    return state.runs.reduce((latest, run) => {
        return new Date(run.created_at) > new Date(latest.created_at) ? run : latest;
    }, state.runs[0]);
}

function getRunById(runId) {
    const state = getState();
    return state.runs.find(r => r.run_id === runId) || null;
}

function getRunsForTask(taskId) {
    const state = getState();
    return state.runs.filter(r => r.task_id === taskId);
}

async function dispatchRun(task, normalizedRequest) {
    const executorType = resolveExecutor(normalizedRequest);
    const run = createRunRecord(task, normalizedRequest, executorType);

    if (executorType === 'unknown') {
        updateRunStatus(run.run_id, 'FAILED', {
            blocker: 'Unknown executor type',
            result_summary: 'Could not resolve executor'
        });
        taskManager.updateTaskStatus(task.task_id, 'FAIL', {
            blocker: 'Unknown executor type',
            related_run_id: run.run_id
        });
        return {
            success: false,
            task_id: task.task_id,
            run_id: run.run_id,
            executor_type: executorType,
            status: 'FAILED',
            message: 'Unknown executor type'
        };
    }

    updateRunStatus(run.run_id, 'DISPATCHED', {
        command: normalizedRequest.normalized_job,
        result_summary: 'Dispatched to ' + executorType
    });

    taskManager.updateTaskStatus(task.task_id, 'RUNNING', {
        related_run_id: run.run_id,
        result_summary: 'Dispatched to ' + executorType + ' at ' + run.created_at
    });

    return {
        success: true,
        task_id: task.task_id,
        run_id: run.run_id,
        executor_type: executorType,
        status: 'DISPATCHED',
        message: 'Dispatched to ' + executorType
    };
}

module.exports = {
    normalizeRunRequest,
    resolveExecutor,
    createRunRecord,
    dispatchRun,
    getLatestRun,
    getRunById,
    getRunsForTask,
    updateRunStatus
};
