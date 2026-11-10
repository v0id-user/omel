// Starts a Postgres instance that lives in .dev/pgdata, so local work needs no Docker or cloud database.
// Usage: bun run db:local [start|stop|status]
import { existsSync, mkdirSync } from 'node:fs';

const dataDir = '.dev/pgdata';
const port = '54329';
const database = 'omel';
const user = 'omel';
const env = { ...process.env, LC_ALL: process.env.LC_ALL ?? 'en_US.UTF-8' };

function run(cmd: string[], allowFailure = false) {
  const result = Bun.spawnSync(cmd, { env, stdout: 'inherit', stderr: 'inherit' });
  if (!allowFailure && result.exitCode !== 0) {
    console.error(`Command failed: ${cmd.join(' ')}`);
    process.exit(result.exitCode ?? 1);
  }
  return result.exitCode === 0;
}

const action = process.argv[2] ?? 'start';

if (action === 'stop') {
  run(['pg_ctl', '-D', dataDir, 'stop'], true);
  process.exit(0);
}

if (action === 'status') {
  run(['pg_ctl', '-D', dataDir, 'status'], true);
  process.exit(0);
}

if (!existsSync(dataDir)) {
  mkdirSync('.dev', { recursive: true });
  run(['initdb', '-D', dataDir, '-U', user, '--auth=trust', '-E', 'UTF8']);
}

const running = Bun.spawnSync(['pg_ctl', '-D', dataDir, 'status'], { env }).exitCode === 0;
if (!running) {
  run([
    'pg_ctl',
    '-D',
    dataDir,
    '-o',
    `-p ${port} -k /tmp`,
    '-l',
    '.dev/postgres.log',
    'start',
    '-w',
  ]);
}

const exists = Bun.spawnSync(['psql', '-h', 'localhost', '-p', port, '-U', user, '-lqt'], {
  env,
}).stdout.toString();
if (!exists.split('\n').some(line => line.split('|')[0]?.trim() === database)) {
  run(['createdb', '-h', 'localhost', '-p', port, '-U', user, database]);
}

console.log(`Postgres is running: postgresql://${user}@localhost:${port}/${database}`);
