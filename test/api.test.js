const test = require('node:test');
const assert = require('node:assert/strict');

const { startServer } = require('../server');

let server;

test('health endpoint responds successfully', async () => {
    server = await startServer(3000);

    const response = await fetch('http://localhost:3000/api/health');
    assert.equal(response.status, 200);

    const data = await response.json();
    assert.equal(data.status, 'ok');
});

test('login endpoint accepts resident credentials', async () => {
    const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: 'shravani@example.com',
            password: '123456'
        })
    });

    assert.equal(response.status, 200);

    const data = await response.json();
    assert.equal(data.success, true);
    assert.equal(data.resident.unit, 'B-204');
});

test.after(async () => {
    if (server) {
        await new Promise((resolve, reject) => {
            server.close((error) => (error ? reject(error) : resolve()));
        });
    }
});
