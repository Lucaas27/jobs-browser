const sensitiveInfoList = [
  'password',
  'new_password',
  'old_password',
  'repeat_password',
  'token',
  'refresh_token',
  'access_token',
  'refreshToken',
  'accessToken',
  'authorization',
];

/**
 * Redacts sensitive information from the request body.
 *
 * @param {any} body  The request body.
 * @returns {any} The redacted request body.
 */
const redactSensitiveInfo = (body: any): any => {
  // Clone the request body to avoid modifying the original object
  const redactedBody = Array.isArray(body) ? [...body] : { ...body };

  if (Array.isArray(body)) {
    for (const [index, value] of body.entries()) {
      if (typeof value === 'object' && (value !== null || value !== undefined)) {
        redactedBody[index] = redactSensitiveInfo(value);
      }
    }
  } else {
    for (const key in body) {
      if (body[key] === null || body[key] === undefined) {
        continue; // Skip null and undefined values
      }

      // Redact sensitive information
      if (sensitiveInfoList.includes(key) && (body[key] !== null || body[key] !== undefined)) {
        redactedBody[key] = '*********';
      } else if (typeof body[key] === 'object' && body[key] !== null) {
        redactedBody[key] = redactSensitiveInfo(body[key]);
      }
    }
  }

  return redactedBody;
};

export { redactSensitiveInfo };
