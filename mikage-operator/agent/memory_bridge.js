let lastMemory = '';

function setLast(mem) {
  lastMemory = mem;
}

function getLast() {
  return lastMemory;
}

module.exports = { setLast, getLast };