console.log('Step 1: Loading shared_state...');
const { getState, updateState } = require('./telegram_bot/shared_state');
console.log('Step 2: shared_state loaded');

console.log('Step 3: Testing getState...');
const state = getState();
console.log('Step 4: getState returned:', Object.keys(state));

console.log('Step 5: Testing updateState...');
updateState(s => {
    console.log('Step 6: Inside mutator, s.services =', typeof s.services);
    return s;
});
console.log('Step 7: Done');
