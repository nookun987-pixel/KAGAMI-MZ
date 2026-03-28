console.log('Starting test...');
try {
    console.log('About to require service_manager...');
    const sm = require('./telegram_bot/service_manager');
    console.log('service_manager loaded, checking exports:', typeof sm);
    console.log('Keys:', Object.keys(sm));
} catch(e) {
    console.error('ERROR:', e.message);
    console.error('STACK:', e.stack);
}
console.log('Done');
