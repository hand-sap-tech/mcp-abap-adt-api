import fs from 'fs';
type LogLevel = 'error' | 'warn' | 'info' | 'debug';
const logFile = process.env.MCP_LOG_FILE || '/tmp/mcp-abap-abap-adt-api.log';

function appendLog(logString: string) {
  try {
    fs.appendFileSync(logFile, `${logString}\n`);
  } catch {
    // Ignore file logging errors to avoid crashing the server.
  }
}

export function createLogger(name: string) {
  return {
    error: (message: string, meta?: Record<string, unknown>) => 
      log('error', name, message, meta),
    warn: (message: string, meta?: Record<string, unknown>) => 
      log('warn', name, message, meta),
    info: (message: string, meta?: Record<string, unknown>) => 
      log('info', name, message, meta),
    debug: (message: string, meta?: Record<string, unknown>) => 
      log('debug', name, message, meta)
  };
}

function log(level: LogLevel, name: string, message: string, meta?: Record<string, unknown>) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    service: name,
    message,
    ...meta
  };
  
  const logString = JSON.stringify(logEntry, null, 2);
  
  // Use stderr to avoid corrupting MCP stdio protocol on stdout.
  console.error(logString);
  appendLog(logString);
}

export type Logger = ReturnType<typeof createLogger>;
