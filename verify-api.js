const http = require('http');

function postRequest(path, data) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(data);
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
            },
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => (body += chunk));
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    resolve(body);
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(postData);
        req.end();
    });
}

async function runTest() {
    console.log('--- Starting Verification ---');

    // 1. Encrypt
    console.log('\n1. Testing Encryption (/get-encrypt-data)...');
    const payload = 'This is a secret message to verify encryption.';
    console.log('Payload:', payload);

    try {
        const encryptRes = await postRequest('/get-encrypt-data', { payload });
        console.log('Encryption Response:', JSON.stringify(encryptRes, null, 2));

        if (!encryptRes.successful) {
            console.error('Encryption failed!');
            return;
        }

        const { data1, data2 } = encryptRes.data;

        // 2. Decrypt
        console.log('\n2. Testing Decryption (/get-decrypt-data)...');
        console.log('Sending data1 and data2...');

        const decryptRes = await postRequest('/get-decrypt-data', { data1, data2 });
        console.log('Decryption Response:', JSON.stringify(decryptRes, null, 2));

        if (decryptRes.successful && decryptRes.data.payload === payload) {
            console.log('\n✅ SUCCESS: Decrypted payload matches original message!');
        } else {
            console.error('\n❌ FAILURE: Decrypted payload does not match!');
        }

    } catch (error) {
        console.error('Error during test:', error.message);
        console.log('Make sure the server is running (npm run start)');
    }
}

runTest();
