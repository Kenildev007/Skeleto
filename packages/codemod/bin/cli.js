#!/usr/bin/env node
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const transforms = {
  'react-loading-skeleton': path.join(__dirname, '..', 'transforms', 'from-react-loading-skeleton.ts'),
};

const args = process.argv.slice(2);
if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
  console.log(`Usage: skeleton-auto-migrate <from> <files...>

  <from>      one of: ${Object.keys(transforms).join(', ')}
  <files...>  glob(s) or paths

Examples:
  skeleton-auto-migrate react-loading-skeleton 'src/**/*.{ts,tsx}'
`);
  process.exit(0);
}

const [from, ...files] = args;
const transform = transforms[from];
if (!transform) {
  console.error(`Unknown migration source: ${from}`);
  console.error(`Available: ${Object.keys(transforms).join(', ')}`);
  process.exit(1);
}

const jscodeshift = require.resolve('jscodeshift/bin/jscodeshift.js');
const result = spawnSync(
  process.execPath,
  [jscodeshift, '--parser=tsx', '-t', transform, ...files],
  { stdio: 'inherit' },
);
process.exit(result.status ?? 0);
