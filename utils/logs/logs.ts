interface LogParams {
  component: string;
  message: string;
  data?: any;
  level?: 'info' | 'warn' | 'error' | 'debug';
  timestamp?: boolean;
}

const getCallerInfo = () => {
  const stack = new Error().stack;
  if (!stack) return 'unknown';

  const lines = stack.split('\n');
  // Skip the first 3 lines: Error, getCallerInfo, and log function
  const callerLine = lines[3];

  if (!callerLine) return 'unknown';

  // Extract file path and line number from stack trace
  // Format is usually: "at functionName (file:line:column)" or "at file:line:column"
  const match = callerLine.match(/\((.+):(\d+):(\d+)\)|at (.+):(\d+):(\d+)/);

  if (match) {
    const filePath = match[1] || match[4];
    const lineNumber = match[2] || match[5];

    // Extract just the filename and path relative to project root
    const relativePath = filePath.replace(/.*\/omel\//, '').replace(/^.*\\omel\\/, '');
    return `${relativePath}:${lineNumber}`;
  }

  return 'unknown';
};

export const log = ({ component, message, data, level = 'info', timestamp = true }: LogParams) => {
  if (process.env.NEXT_PUBLIC_ENV === 'dev') {
    const callerInfo = getCallerInfo();
    const timestampStr = timestamp ? `[${new Date().toISOString()}]` : '';
    const componentStr = `[${component}]`;
    const callerStr = `[${callerInfo}]`;
    const levelStr = `[${level.toUpperCase()}]`;

    const logMessage = `${timestampStr} ${componentStr} ${callerStr} ${levelStr}: ${message}`;

    if (data) {
      return `${logMessage} | Data: ${JSON.stringify(data)}`;
    }

    return logMessage;
  }

  return '';
};
