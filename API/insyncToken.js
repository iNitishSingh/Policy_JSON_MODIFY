import https from 'https';
import tunnel from 'tunnel';
import fs from 'fs';

async function insyncToken(data) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // ONLY for development

  const agent = tunnel.httpsOverHttp({
    proxy: {
      host: 'webproxy.tataaig.com',
      port: 8099,
      proxyAuth: 'nisingh9:Nks6Tata@2025',
    }
  });

  const requestBody = JSON.stringify({
    "email": "uw",
    "mpwd": "098f6bcd4621d373cade4e832627b4f6"
});

  const options = {
    host: 'uatis2.cloware.in',
    port: 443,
    path: '/api/v1/auth',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ',  // Add your token if needed here
      'Content-Length': Buffer.byteLength(requestBody),
    },
    agent,
    rejectUnauthorized: false,
    //ca: fs.readFileSync('./full-cert-chain.pem'),
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsedBody = JSON.parse(data);
          resolve({ body: parsedBody, statusCode: res.statusCode });
        } catch (err) {
          reject(new Error(`Error parsing JSON: ${err.message}, Raw response: ${data}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(requestBody);
    req.end();
  });
}

export default insyncToken;