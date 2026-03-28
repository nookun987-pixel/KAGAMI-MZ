const { validate } = require('./agents/validator');
const config = require('./config');
const OpenAI = require('openai');

async function testValidator() {
  const openaiOpts = { apiKey: config.OPENAI_API_KEY };
  if (config.OPENAI_BASE_URL) openaiOpts.baseURL = config.OPENAI_BASE_URL;
  const openai = new OpenAI(openaiOpts);

  const invalidPayload = {
    "contents": [
      {
        "type": "carousel",
        "status": "ready"
      },
      {
        "type": "short_post", 
        "body": "Test body without hook",
        "cta": "Test CTA",
        "status": "ready"
      }
    ]
  };
  
  const sourceText = "Test source for validator";

  console.log('Testing validator with invalid payload...');
  console.log('Invalid payload:', JSON.stringify(invalidPayload, null, 2));
  
  try {
    const result = await validate(invalidPayload, sourceText, openai);
    console.log('Validator result:', JSON.stringify(result, null, 2));
    
    if (!result.pass) {
      console.log('✓ Validator correctly rejected invalid payload');
      console.log('Reason:', result.reason);
    } else {
      console.log('✗ Validator incorrectly accepted invalid payload');
    }
  } catch (error) {
    console.error('Validator error:', error.message);
  }
}

testValidator().catch(console.error);
