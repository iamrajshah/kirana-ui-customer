import assert from 'node:assert/strict';
import test from 'node:test';
import { validateProductionApiBaseUrl } from './validate-release-config.mjs';

test('accepts the public HTTPS API origin', () => {
  assert.equal(
    validateProductionApiBaseUrl('https://api.example.com'),
    'https://api.example.com'
  );
});

for (const [name, value] of [
  ['missing URL', ''],
  ['localhost', 'http://localhost:5000'],
  ['loopback IP', 'http://127.0.0.1:5000'],
  ['production HTTP', 'http://api.example.com'],
  ['API path included', 'https://api.example.com/api/v1'],
]) {
  test(`rejects ${name}`, () => {
    assert.throws(() => validateProductionApiBaseUrl(value));
  });
}
