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
 * @param {{ [key: string]: any }} body  The request body.
 * @returns { { [key: string]: any } } The redacted request body.
 */
const redactSensitiveInfo = (body: { [key: string]: any }): any => {
  // Clone the request body to avoid modifying the original object
  const redactedBody = { ...body };

  // Redact or remove sensitive fields from the request body
  // For example, you can redact a field named 'password'
  for (const key in body) {
    if (sensitiveInfoList.includes(key)) {
      redactedBody[key] = '*********';
    } else if (typeof body[key] === 'object' && body[key] !== null) {
      // Recursively redact sensitive keys within nested objects
      redactedBody[key] = redactSensitiveInfo(body[key]);
    }
  }

  return redactedBody;
};

export { redactSensitiveInfo };
