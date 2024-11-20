/* eslint-disable */
import legacyPlugin from '@vitejs/plugin-legacy';
import * as path from 'path';
import {
  createVuePlugin
} from 'vite-plugin-vue2';
// @see https://cn.vitejs.dev/config/
export default ({ command, mode }) => {
  let rollupOptions = {};

  let optimizeDeps = {};

  let alias = {
    '@': path.resolve(__dirname, './src'),
    'Components': path.resolve(__dirname, './src/components'),
    'vue$': 'vue/dist/vue.esm.js',
    'vue': 'vue/dist/vue.esm.js',
  };

  let proxy = {};

  // prod_url 换成自己最终部署的地址.
  const prod_url = 'https://app.distribution.medcloud.cn/';
  const local_url = 'http://127.0.0.1:9898/';
  let define = {
    'process.env': {},
    'process.env.SERVER_HOST': mode === 'production' ? prod_url : `"${ local_url }"`,
    'process.env.FABU_BASE_URL': mode === 'production' ? prod_url : `"${ local_url }"`,
  };

  let esbuild = {};

  return {
    base: mode === 'production' ? prod_url : local_url, // index.html文件所在位置
    root: './', // js导入的资源路径，src
    resolve: {
      alias,
    },
    define: define,
    server: {
      // 代理
      proxy,
    },
    build: {
      target: 'es2015',
      minify: 'terser', // 是否进行压缩,boolean | 'terser' | 'esbuild',默认使用terser
      manifest: false, // 是否产出maifest.json
      sourcemap: false, // 是否产出soucemap.json
      outDir: 'dist', // 产出目录
      rollupOptions,
      chunkSizeWarningLimit: 1000,
    },
    esbuild,
    optimizeDeps,
    plugins: [
      legacyPlugin({
        targets: [ 'Android > 39', 'Chrome >= 60', 'Safari >= 10.1', 'iOS >= 10.3', 'Firefox >= 54', 'Edge >= 15' ],
      }),
      createVuePlugin()
    ],
    css: {
      preprocessorOptions: {
        less: {
          // 支持内联 JavaScript
          javascriptEnabled: true,
        }
      }
    },

  };
}
