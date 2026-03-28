console.log('Step 1: About to require service_manager...');
try {
    const sm = require('./telegram_bot/service_manager');
    console.log('Step 2: service_manager loaded, type:', typeof sm);
    console.log('Step 3: Keys:', Object.keys(sm));
    console.log('Step 4: Done');
} catch(e) {
    console.error('ERROR at step:', e.message);
    console.error('Full stack:', e.stack);
}
