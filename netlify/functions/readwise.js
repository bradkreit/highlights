const https = require('https');

function httpsGet(url, headers) {
  return new Promise(function(resolve, reject) {
    const req = https.get(url, { headers: headers }, function(res) {
      let body = '';
      res.on('data', function(chunk) { body += chunk; });
      res.on('end', function() { resolve({ status: res.statusCode, body: body }); });
    });
    req.on('error', reject);
    req.setTimeout(15000, function() { req.destroy(new Error('Request timed out')); });
  });
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'x-readwise-token, Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json'
};

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS, body: '' };
  }

  const token = event.headers['x-readwise-token'];
  if (!token) {
    return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'Missing token' }) };
  }

  const qs = event.queryStringParameters || {};
  const endpoint = qs.endpoint;
  if (!endpoint || (endpoint !== 'highlights' && endpoint !== 'books')) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid endpoint: ' + endpoint }) };
  }

  const page = qs.page || '1';
  const url = 'https://readwise.io/api/v2/' + endpoint + '/?page_size=1000&page=' + page;

  try {
    const result = await httpsGet(url, {
      'Authorization': 'Token ' + token,
      'Accept': 'application/json'
    });
    return { statusCode: result.status, headers: CORS, body: result.body };
  } catch (e) {
    return { statusCode: 502, headers: CORS, body: JSON.stringify({ error: 'Proxy error: ' + e.message }) };
  }
};
