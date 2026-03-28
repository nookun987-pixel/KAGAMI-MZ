let pendingCallback = null;

function requestApproval(callback) {
  pendingCallback = callback;
}

function approve() {
  if (pendingCallback) {
    pendingCallback(true);
    pendingCallback = null;
  }
}

function reject() {
  if (pendingCallback) {
    pendingCallback(false);
    pendingCallback = null;
  }
}

module.exports = { requestApproval, approve, reject };