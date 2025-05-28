import https from 'https';
import fs from 'fs';
import tunnel from 'tunnel';

async function twigtest(config,twig,token) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // ONLY for development



  const agent = tunnel.httpsOverHttp({
    proxy: {
      host: 'webproxy.tataaig.com',
      port: 8099,
      proxyAuth: 'nisingh9:Nks6Tata@2025',
    }
  });

  const requestBody = JSON.stringify({ json: JSON.stringify(config), twig: twig });

  const options = {
    host: 'uatis2.cloware.in',
    port: 443,
    path: '/api/v1/twigtest',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Content-Length': Buffer.byteLength(requestBody),
    },
    agent,
    rejectUnauthorized: false,
    ca: fs.readFileSync('./full-cert-chain.pem'),
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

export default twigtest;