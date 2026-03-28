const { validate } = require('./agents/validator');
const config = require('./config');
const OpenAI = require('openai');
const fs = require('fs');

async function testValidator() {
  const openaiOpts = { apiKey: config.OPENAI_API_KEY };
  if (config.OPENAI_BASE_URL) openaiOpts.baseURL = config.OPENAI_BASE_URL;
  const openai = new OpenAI(openaiOpts);

  const invalidPayload = JSON.parse(fs.readFileSync('./data/invalid_test.json', 'utf-8'));
  const sourceText = "Test source for validator";

  console.log('Testing validator with invalid payload...');
  const result = await validate(invalidPayload, sourceText, openai);
  
  console.log('Validator result:', JSON.stringify(result, null, 2));
  
  if (!result.pass) {
    console.log('✓ Validator correctly rejected invalid payload');
    console.log('Reason:', result.reason);
  } else {
    console.log('✗ Validator incorrectly accepted invalid payload');
  }
}

testValidator().catch(console.error);
