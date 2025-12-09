const winston = require('winston');
const path = require('path');

const customTimestamp = winston.format((info) => {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();

  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12;
  const hourStr = String(hours).padStart(2, '0');

  info.timestamp = `${day}/${month}/${year}, ${hourStr}:${minutes}:${seconds} ${ampm}`;
  return info;
});

function getCallerInfo() {
  const stack = new Error().stack;
  const stackLines = stack.split('\n');
  const loggerFilePath = path.basename(__filename);

  for (let i = 3; i < stackLines.length; i++) {
    const callerLine = stackLines[i].trim();
    
    const match = callerLine.match(/at (?:[^(]*\()?(.*):(\d+):\d+\)?/);

    if (match) {
        const filePath = match[1];
        const lineNumber = match[2];
        const fileName = path.basename(filePath);

        if (
            fileName === loggerFilePath || 
            filePath.includes('node_modules') || 
            filePath.includes('internal/')
        ) {
            continue;
        }

        return `${fileName}:${lineNumber}`;
    }
  }

  return 'unknown';
}

const logFormat = winston.format.combine(
  winston.format.colorize(),
  customTimestamp(),
  winston.format.printf(({ level, message, timestamp, location }) => {
    const locTag = location ? `[${location}]` : '';
    return `[${timestamp}] ${level}: ${locTag} ${message}`;
  })
);

const baseLogger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [new winston.transports.Console()]
});

function getLogger() {
  return {
    info: (msg) => baseLogger.info(msg, { location: getCallerInfo() }),
    warn: (msg) => baseLogger.warn(msg, { location: getCallerInfo() }),
    error: (msg) => baseLogger.error(msg, { location: getCallerInfo() }),
    debug: (msg) => baseLogger.debug(msg, { location: getCallerInfo() }),
  };
}

module.exports = { getLogger };