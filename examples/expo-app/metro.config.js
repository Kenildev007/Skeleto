const { getDefaultConfig } = require('expo/metro-config');
const path = require('node:path');
const fs = require('node:fs');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];
// Allow Metro to walk up to the workspace root for hoisted/transitive deps.
// projectRoot is still pinned via getDefaultConfig(projectRoot) above.
config.resolver.disableHierarchicalLookup = false;

config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = ['react-native', 'require', 'import'];

// pnpm + React Native: every package transitively required by RN must be
// mapped here, otherwise Metro can't find them from inside .pnpm/...
// Resolve each from the workspace root's hoisted node_modules.
const transitiveDeps = [
  'invariant',
  'fbjs',
  'react',
  'react-dom',
  'react-native',
  'react-native-web',
  '@babel/runtime',
  'event-target-shim',
  'promise',
  'regenerator-runtime',
  'scheduler',
  'use-sync-external-store',
  'whatwg-fetch',
];
config.resolver.extraNodeModules = {
  ...Object.fromEntries(
    transitiveDeps
      .map((dep) => {
        const p = path.resolve(workspaceRoot, 'node_modules', dep);
        return fs.existsSync(p) ? [dep, p] : null;
      })
      .filter(Boolean),
  ),
  // Workspace packages — point directly at source so Metro picks .native.ts
  '@skeleto/core': path.resolve(workspaceRoot, 'packages/core/src'),
  '@skeleto/web': path.resolve(workspaceRoot, 'packages/web/src'),
  '@skeleto/native': path.resolve(workspaceRoot, 'packages/native/src'),
  'skeleto': path.resolve(workspaceRoot, 'packages/native/src'),
};

module.exports = config;
