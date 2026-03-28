const router = require('./agent/router');

const mockBot = {
  sendMessage: (chatId, text) => console.log(`Bot to ${chatId}: ${text}`)
};

const testInputs = [
  '/help',
  '/status',
  '/run content',
  '/log last',
  '/memory last',
  '/retry last',
  '/approve',
  '/reject',
  'yes',
  'no',
  'hello world'
];

testInputs.forEach(input => {
  console.log(`\nTesting: ${input}`);
  const mockMsg = {
    text: input,
    chat: { id: 123 }
  };
  router.handleMessage(mockBot, mockMsg);
});