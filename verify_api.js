const http = require('http');

const data = JSON.stringify({
    from: "2025-11-10T10:40:00.000Z",
    to: "2025-11-10T11:10:00.000Z",
    payload: {}
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/run-request',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`);
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => {
        console.log('Response:', body.substring(0, 200) + '...');
    });
});

req.on('error', error => {
    console.error(error);
});

req.write(data);
req.end();
