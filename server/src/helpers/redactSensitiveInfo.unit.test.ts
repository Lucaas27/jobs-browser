import { describe, test, expect } from 'vitest';
import { redactSensitiveInfo } from '@/helpers/redactSensitiveInfo.js';

describe('GIVEN sensitive information is sent in the request body', () => {
  test('should redact top-level sensitive fields', () => {
    const input = {
      username: 'user123',
      password: 'mypassword',
      token: '12345',
    };

    const expectedOutput = {
      username: 'user123',
      password: '*********',
      token: '*********',
    };

    expect(redactSensitiveInfo(input)).toEqual(expectedOutput);
  });

  test('should redact nested sensitive fields', () => {
    const input = {
      user: {
        name: 'user123',
        password: 'mypassword',
      },
      token: '12345',
    };

    const expectedOutput = {
      user: {
        name: 'user123',
        password: '*********',
      },
      token: '*********',
    };

    expect(redactSensitiveInfo(input)).toEqual(expectedOutput);
  });

  test('should handle arrays containing objects with sensitive fields', () => {
    const input = {
      users: [
        { name: 'user1', password: 'pass1' },
        { name: 'user2', token: 'token2' },
      ],
    };

    const expectedOutput = {
      users: [
        { name: 'user1', password: '*********' },
        { name: 'user2', token: '*********' },
      ],
    };

    expect(redactSensitiveInfo(input)).toEqual(expectedOutput);
  });

  test('should not redact non-sensitive fields', () => {
    const input = {
      username: 'user123',
      email: 'user@example.com',
    };

    const expectedOutput = {
      username: 'user123',
      email: 'user@example.com',
    };

    expect(redactSensitiveInfo(input)).toEqual(expectedOutput);
  });

  test('should handle null and undefined values gracefully', () => {
    const input = {
      username: 'user123',
      password: null,
      token: undefined,
    };

    const expectedOutput = {
      username: 'user123',
      password: null,
      token: undefined,
    };

    expect(redactSensitiveInfo(input)).toEqual(expectedOutput);
  });
});
