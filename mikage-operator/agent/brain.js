let lastMemory = '';

function map(text) {
  const lower = text.toLowerCase();
  if (lower.includes('hello') || lower.includes('hi')) {
    return 'Hello! How can I help?';
  } else if (lower.includes('status')) {
    return 'Use /status to check status.';
  } else if (lower.includes('run')) {
    return 'Use /run <command> to run a command.';
  } else {
    return 'I don\'t understand. Use /help for commands.';
  }
}

module.exports = { map };