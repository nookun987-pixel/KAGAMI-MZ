const originalError = console.error;
console.error = function(...args) {
    originalError.apply(console, ['[ERR]'].concat(args));
};

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT:', err.message);
    console.error('STACK:', err.stack);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED:', err.message);
    console.error('STACK:', err.stack);
    process.exit(1);
});

console.log('Starting...');
try {
    const sm = require('./telegram_bot/service_manager');
    console.log('Loaded:', typeof sm);
} catch(e) {
    console.error('ERROR:', e.message);
    console.error('STACK:', e.stack);
}
console.log('End');
