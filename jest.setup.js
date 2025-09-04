// Jest setup file for test environment
import '@testing-library/jest-dom';

// Mock Cloudflare Workers environment
global.Request = Request;
global.Response = Response;
global.Headers = Headers;

// Mock D1 database for tests
global.D1Database = class MockD1Database {
  constructor() {
    this.data = new Map();
  }
  
  prepare(query) {
    return {
      bind: (...values) => this,
      first: () => null,
      all: () => ({ results: [] }),
      run: () => ({ meta: { changes: 0 } }),
    };
  }
  
  exec(query) {
    return { results: [] };
  }
};
