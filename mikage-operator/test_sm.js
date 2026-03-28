try {
    const sm = require('./telegram_bot/service_manager');
    console.log('Module loaded, keys:', Object.keys(sm));
    sm.getAllServiceStatus()
        .then(r => console.log('RESULT:', JSON.stringify(r, null, 2)))
        .catch(e => { console.error('ERROR:', e.message, e.stack); process.exit(1); });
} catch(e) {
    console.error('LOAD ERROR:', e.message);
    console.error('STACK:', e.stack);
    process.exit(1);
}
