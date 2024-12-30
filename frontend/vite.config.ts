import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import react from '@vitejs/plugin-react-swc';
import rollupNodePolyFill from 'rollup-plugin-polyfill-node';
import { defineConfig, UserConfig, loadEnv, splitVendorChunkPlugin } from 'vite';
import Debugger from 'dev-debugger-vite';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const envVariables = loadEnv(mode, process.cwd());

  return {
    plugins: [react(), splitVendorChunkPlugin(),Debugger()],
    define: {
      'process.env': {
        VITE_DCL_DEFAULT_ENV: envVariables.VITE_DCL_DEFAULT_ENV,
        VITE_BASE_URL: envVariables.VITE_BASE_URL
      },
      global: {}
    },
    resolve: {
      alias: {
        util: 'rollup-plugin-node-polyfills/polyfills/util',
        assert: 'rollup-plugin-node-polyfills/polyfills/assert'
      }
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis'
        },
        plugins: [
          NodeGlobalsPolyfillPlugin({
            buffer: false,
            process: false
          }),
          NodeModulesPolyfillPlugin()
        ]
      }
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true
      },
      rollupOptions: {
        plugins: [rollupNodePolyFill()]
      },
      sourcemap: true
    },
    ...(command === 'build' ? { base: envVariables.VITE_BASE_URL } : undefined)
  } as unknown as UserConfig;
});