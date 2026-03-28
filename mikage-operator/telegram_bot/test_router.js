const router = require('./router');

async function test() {
    console.log('[TEST] Testing router handlers\n');

    const tests = [
        { cmd: '/help', expected: 'Mikage Operator Commands' },
        { cmd: '/run', expected: 'Usage:' },
        { cmd: '/task', expected: 'Usage:' },
        { cmd: '/status', expected: 'not found' },
        { cmd: '/latest', expected: 'No tasks' },
        { cmd: '/queue', expected: 'Queue Status' },
        { cmd: '/artifacts', expected: 'No artifacts' },
        { cmd: '/unknown', expected: 'Unknown command' },
    ];

    for (const t of tests) {
        const parts = t.cmd.split(/\s+/);
        const cmd = parts[0];
        const args = parts.slice(1);

        try {
            const result = await router.handle(cmd, args, {});
            const pass = result.includes(t.expected);
            console.log(`[${pass ? 'PASS' : 'FAIL'}] ${t.cmd} -> ${result.substring(0, 50)}`);
        } catch (e) {
            console.log(`[ERR] ${t.cmd} -> ${e.message}`);
        }
    }

    console.log('\n[TEST] Complete');
}

test();
