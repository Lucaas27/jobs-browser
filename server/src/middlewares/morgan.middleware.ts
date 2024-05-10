import morgan from 'morgan';
import { logger } from '@/services/logger.service';
import { Request } from 'express';
import { redactSensitiveInfo } from '@/utils/redactSensitiveInfo';

/**
 * Creates a middleware function that logs HTTP requests using the Morgan library.
 *
 * @return The middleware function that logs HTTP requests.
 */

const morganMiddleware = () => {
  const stream = {
    // Use the http severity
    write: (message: string) => logger.http(message),
  };
  const skip = () => {
    const env = process.env.NODE_ENV || 'development';
    return env !== 'development';
  };

  morgan.token('body', (req: Request) => {
    return JSON.stringify(redactSensitiveInfo(req.body));
  });

  return morgan(
    // Define message format string.
    // The message format is made from tokens, and each token is
    // defined inside the Morgan library.
    // We can create our custom token to show what we want from a request.
    JSON.stringify(
      {
        env: `${process.env.NODE_ENV}`,
        method: ':method',
        status: ':status',
        url: ':url',
        response_time: ':response-time ms',
        remote_address: ':remote-addr',
        http_version: 'HTTP/:http-version',
        req_body: ':body',
        content_length: ':res[content-length]',
        content_type: ':res[content-type]',
        remote_user: ':remote-user',
        referrer: ':referrer',
        user_agent: ':user-agent',
      },
      null,
      2
    ),
    // Options: in this case, I overwrote the stream and the skip logic.
    // Skip logging if the environment is not development.
    // Otherwise, log the whole request to the console
    { stream, skip }
  );
};
export { morganMiddleware };
