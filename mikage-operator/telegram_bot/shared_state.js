const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const STATE_FILE = path.join(DATA_DIR, 'state.json');

const DEFAULT_STATE = {
    tasks: [],
    services: {},
    runs: [],
    artifacts: [],
    costs: [],
    alerts: []
};

function ensureStateShape(state) {
    return {
        tasks: state.tasks || [],
        services: state.services || {},
        runs: state.runs || [],
        artifacts: state.artifacts || [],
        costs: state.costs || [],
        alerts: state.alerts || []
    };
}

function loadState() {
    try {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        if (!fs.existsSync(STATE_FILE)) {
            const defaultState = ensureStateShape({});
            fs.writeFileSync(STATE_FILE, JSON.stringify(defaultState, null, 2));
            return defaultState;
        }
        const data = fs.readFileSync(STATE_FILE, 'utf8');
        const parsed = JSON.parse(data);
        return ensureStateShape(parsed);
    } catch (error) {
        console.error('Error loading state:', error);
        return ensureStateShape({});
    }
}

function saveState(state) {
    try {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
    } catch (error) {
        console.error('Error saving state:', error);
    }
}

function getState() {
    return loadState();
}

function updateState(mutator) {
    const state = loadState();
    const newState = mutator(state);
    saveState(newState || state);
    return newState || state;
}

module.exports = {
    loadState,
    saveState,
    getState,
    updateState,
    ensureStateShape
};