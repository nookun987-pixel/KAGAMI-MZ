console.log('NODE_ENV_CHECK_START');
console.log('NODE_OPTIONS:', process.env.NODE_OPTIONS || '(not set)');
console.log('cwd:', process.cwd());
console.log('node version:', process.version);
console.log('platform:', process.platform);
console.log('ENV_CHECK_DONE');
process.exit(0);
