const resolveIntel = require('./intel_registry_resolver');

// TEST 1
const result1 = resolveIntel("Google Picatrix");
console.log("TEST 1:", result1);

// TEST 2
const result2 = resolveIntel("Some Random Tool");
console.log("TEST 2:", result2);