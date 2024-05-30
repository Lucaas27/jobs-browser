import winston from 'winston';

const isDevelopment = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'development';
};

const isTest = () => {
  const env = process.env.NODE_ENV;
  return env === 'test';
};

// Define severity levels.
// With them, we can create log files,
// see or hide levels based on the running ENV.
export const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// This method set the current severity based on
// the current NODE_ENV: show all the log levels
// if the server was run in development mode; otherwise,
// if it was run in production, show only warn and error messages.
const level = () => {
  return isDevelopment() ? 'debug' : isTest() ? 'error' : 'http';
};

// Define different colors for each level.
// Colors make the log message more visible,
// adding the ability to focus or ignore messages.
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'blue',
  debug: 'magenta',
};

// Tell winston that we want to link the colors
// defined above to the severity levels.
winston.addColors(colors);
// Chose the aspect of our log customizing the log format.
const format = winston.format.combine(
  // Add the message timestamp with the preferred format
  winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss:ms' }),
  // Tell Winston that the logs must be colored
  winston.format.colorize({ all: true }),
  // Define the format of the message showing the timestamp, the level and the message
  winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
);

// Create the logger instance that has to be exported
// and used to log messages.
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  defaultMeta: { service: 'user-service' },
  transports:
    isDevelopment() || isTest()
      ? [
          // Allow the use the console to print the messages
          new winston.transports.Console({ silent: isTest() }),
        ]
      : [
          // Allow the use the console to print the messages
          new winston.transports.Console(),
          // Allow to print all the error level messages inside the error.log file
          new winston.transports.File({
            filename: 'logs/application.log',
          }),
        ],
});

export { logger };
