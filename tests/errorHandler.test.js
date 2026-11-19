import assert from 'node:assert/strict';
import test from 'node:test';
import { errorHandlerMiddleware } from '../middlewares/errorHandler.middleware.js';

test('production API errors do not disclose internal details', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalConsoleError = console.error;
  const response = {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };

  process.env.NODE_ENV = 'production';
  console.error = () => {};
  try {
    errorHandlerMiddleware(
      Object.assign(new Error('Database connection string contains a secret'), { code: 'P2010' }),
      { method: 'GET', originalUrl: '/api/v1/productos' },
      response,
      () => {}
    );
  } finally {
    if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = originalNodeEnv;
    console.error = originalConsoleError;
  }

  assert.equal(response.statusCode, 500);
  assert.equal(response.body.error.code, 'INTERNAL_SERVER_ERROR');
  assert.equal(response.body.error.message, 'Ha ocurrido un error inesperado en el servidor.');
  assert.equal(JSON.stringify(response.body).includes('secret'), false);
});
