interface LogParams {
  component: string;
  message: string;
  data?: any;
  level?: 'info' | 'warn' | 'error' | 'debug';
  timestamp?: boolean;
}

export function log({ component, message, data, level = 'info', timestamp = false }: LogParams) {
  if (process.env.NEXT_PUBLIC_ENV === 'dev') {
    const timestampStr = timestamp ? `[${new Date().toISOString()}]` : '';
    const componentStr = `[${component}]`;
    const levelStr = `[${level.toUpperCase()}]`;

    const logMessage = `${timestampStr} ${componentStr} ${levelStr}: ${message}`;

    if (data) {
      return `${logMessage} | Data: ${JSON.stringify(data)}`;
    }

    return logMessage;
  }

  return '';
}
