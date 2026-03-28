const http = require('http');
const { getState, updateState } = require('./shared_state');

const SERVICE_CONFIG = {
    fooocus: {
        name: 'fooocus',
        health_target: 'http://127.0.0.1:7865/',
        restart_command: null
    },
    ollama: {
        name: 'ollama',
        health_target: 'http://127.0.0.1:11434/api/tags',
        restart_command: null
    }
};

function ensureServiceEntry(serviceName) {
    const state = getState();
    if (!state.services[serviceName]) {
        state.services[serviceName] = {
            name: serviceName,
            status: 'UNKNOWN',
            last_checked_at: '',
            health_target: SERVICE_CONFIG[serviceName]?.health_target || '',
            detail: 'Not initialized'
        };
        updateState(() => state);
    }
}

function httpGet(url) {
    return new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
            resolve({ statusCode: res.statusCode, statusMessage: res.statusMessage });
        });
        req.on('error', (err) => {
            reject(err);
        });
        req.setTimeout(5000, () => {
            req.destroy();
            reject(new Error('timeout'));
        });
    });
}

class ServiceManager {
    constructor() {
        Object.keys(SERVICE_CONFIG).forEach(serviceName => {
            ensureServiceEntry(serviceName);
        });
    }

    async healthCheck(serviceName) {
        const config = SERVICE_CONFIG[serviceName];
        if (!config) {
            return { status: 'UNKNOWN', message: 'Unknown service' };
        }

        try {
            const response = await httpGet(config.health_target);
            const isHealthy = response.statusCode >= 200 && response.statusCode < 300;
            updateState(state => {
                state.services[serviceName].status = isHealthy ? 'HEALTHY' : 'UNHEALTHY';
                state.services[serviceName].last_checked_at = new Date().toISOString();
                state.services[serviceName].detail = 'HTTP ' + response.statusCode;
                return state;
            });
            return { 
                status: isHealthy ? 'HEALTHY' : 'UNHEALTHY', 
                message: 'HTTP ' + response.statusCode 
            };
        } catch (error) {
            const detail = error.code || error.message;
            updateState(state => {
                state.services[serviceName].status = 'UNHEALTHY';
                state.services[serviceName].last_checked_at = new Date().toISOString();
                state.services[serviceName].detail = detail;
                return state;
            });
            return { status: 'UNHEALTHY', message: detail };
        }
    }

    getServiceStatus(serviceName) {
        const state = getState();
        if (!state.services[serviceName]) {
            return { name: serviceName, status: 'UNKNOWN', detail: 'Not configured' };
        }
        return state.services[serviceName];
    }

    async getAllServiceStatus() {
        const result = {};
        for (const serviceName of Object.keys(SERVICE_CONFIG)) {
            await this.healthCheck(serviceName);
            result[serviceName] = this.getServiceStatus(serviceName);
        }
        return result;
    }

    async restartService(serviceName) {
        const config = SERVICE_CONFIG[serviceName];
        if (!config) {
            return { success: false, message: 'Unknown service: ' + serviceName };
        }
        if (!config.restart_command) {
            return { 
                success: false, 
                message: 'Restart path not configured for ' + serviceName + '. Manual restart required.' 
            };
        }
        updateState(state => {
            state.services[serviceName].status = 'RESTARTING';
            state.services[serviceName].detail = 'Restart in progress';
            return state;
        });
        return { 
            success: false, 
            message: 'Restart command not yet implemented for ' + serviceName 
        };
    }
}

const serviceManager = new ServiceManager();

module.exports = serviceManager;
