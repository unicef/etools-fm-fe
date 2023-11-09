import esbuild from 'rollup-plugin-esbuild';
import resolve from '@rollup/plugin-node-resolve';
import path from 'path';
import multiInput from 'rollup-plugin-multi-input';

const importMetaUrlCurrentModulePlugin = () => {
  return {
    name: 'import-meta-url-current-module',
    resolveImportMeta(property, { moduleId }) {
      if (property === 'url') {
        return `new URL('${path.relative(process.cwd(), moduleId)}', document.baseURI).href`;
      }
      return null;
    }
  };
};

const config = {
  input: ['src_ts/**/*.ts'],
  output: {
    dir: 'src/src',
    format: 'es',
    sourcemap: true,
  },
  onwarn(warning, warn) {
    if (warning.code === 'THIS_IS_UNDEFINED') return;
    warn(warning);
  },
  plugins: [
    multiInput({ relative: 'src_ts/' }),
    importMetaUrlCurrentModulePlugin(),
    resolve(),
    esbuild(),
  ],
  preserveEntrySignatures: false
};

export default config;
