const https = require('https');

const SERVER_URL = 'mikage-brain-417250859924.northamerica-northeast1.run.app';

console.log('Testing Mikage Brain Server...');
console.log('URL:', SERVER_URL);

const options = {
  hostname: SERVER_URL,
  port: 443,
  path: '/health',
  method: 'GET'
};

const req = https.request(options, (res) => {
  console.log('Status:', res.statusCode);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
    if (res.statusCode === 200) {
      console.log('✅ Server is ONLINE');
    } else {
      console.log('❌ Server returned error');
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Request failed:', e.message);
});

req.end();
