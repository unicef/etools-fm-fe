import esbuild from 'rollup-plugin-esbuild';
import resolve from '@rollup/plugin-node-resolve';
import { createRequire } from 'module';
import fs from 'fs';
import commonjs from '@rollup/plugin-commonjs';
import path from 'path';
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';

const requireResolve = createRequire(import.meta.url).resolve;

const commonAliasPlugin = () => {
  const prefix = '@common/';
  const commonRoot = path.resolve(process.cwd(), '../../common');

  const tryResolveFile = (p) => {
    if (fs.existsSync(p)) return p;
    if (fs.existsSync(`${p}.ts`)) return `${p}.ts`;
    if (fs.existsSync(`${p}.js`)) return `${p}.js`;
    return null;
  };

  return {
    name: 'common-alias',
    resolveId(source) {
      if (!source?.startsWith(prefix)) return null;
      const rel = source.slice(prefix.length);
      const resolved = tryResolveFile(path.resolve(commonRoot, rel));
      return resolved ?? null;
    }
  };
};

// Resolve npm packages from app/monorepo root when importer is under common/ or libraries/
const resolveFromRootPlugin = () => {
  const appDir = process.cwd();
  const monorepoRoot = path.resolve(appDir, '../..');
  const rootDirs = [monorepoRoot, appDir];

  const tryResolveSubpath = (pkgName, subpath, dir) => {
    try {
      const pkgRoot = requireResolve(pkgName + '/package.json', { paths: [dir] });
      const pkgDir = path.dirname(pkgRoot);
      const base = path.join(pkgDir, subpath);
      for (const ext of ['', '.js', '.ts']) {
        const candidate = base + ext;
        if (fs.existsSync(candidate)) return candidate;
      }
    } catch {
      /* ignore */
    }
    return null;
  };

  return {
    name: 'resolve-from-root',
    resolveId(source, importer) {
      if (!importer || !source) return null;
      const isCommonOrLib = /[\/\\](common|libraries)[\/\\]/.test(importer);
      if (!isCommonOrLib) return null;
      if (source.startsWith('.') || source.startsWith('@common/')) return null;
      for (const dir of rootDirs) {
        try {
          const resolved = requireResolve(source, { paths: [dir] });
          return resolved;
        } catch {
          let pkgName, subpath;
          if (source.startsWith('@') && source.indexOf('/', 1) > 0) {
            const secondSlash = source.indexOf('/', 1);
            pkgName = source.slice(0, secondSlash);
            subpath = source.slice(secondSlash + 1);
          } else {
            const slash = source.indexOf('/');
            if (slash > 0) {
              pkgName = source.slice(0, slash);
              subpath = source.slice(slash + 1);
            }
          }
          if (pkgName && subpath) {
            const sub = tryResolveSubpath(pkgName, subpath, dir);
            if (sub) return sub;
          }
          continue;
        }
      }
      return null;
    }
  };
};

const importMetaUrlCurrentModulePlugin = () => {
  return {
    name: 'import-meta-url-current-module',
    resolveImportMeta(property, {moduleId}) {
      if (property === 'url') {
        return `new URL('${path.relative(process.cwd(), moduleId)}', document.baseURI).href`;
      }
      return null;
    }
  };
};

const config = {
  input: 'src_ts/app-shell.ts',
  output: {
    file: 'src/src/app-shell.js',
    format: 'es',
    inlineDynamicImports: true,
    sourcemap: true,
    compact: true
  },
  onwarn(warning, warn) {
    if (warning.code === 'THIS_IS_UNDEFINED') return;
    warn(warning);
  },
  plugins: [importMetaUrlCurrentModulePlugin(), commonAliasPlugin(), resolveFromRootPlugin(), resolve({
    extensions: ['.js', '.ts'],
    preserveSymlinks: false // 🔥 critical for pnpm
  }), commonjs(), esbuild(), dynamicImportVars()],
  preserveEntrySignatures: false
};

export default config;
