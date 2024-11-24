/* eslint-disable */
import * as path from 'path';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx'
// @see https://cn.vitejs.dev/config/
export default ({ command, mode }) => {
  let rollupOptions = {};

  let optimizeDeps = {};

  let alias = {
    '@': path.resolve(__dirname, './src'),
    'Components': path.resolve(__dirname, './src/components'),
    // 'vue$': 'vue/dist/vue.esm.js',
    // 'vue': 'vue/dist/vue.esm.js',
  };

  let proxy = {};

  // prod_url 换成自己最终部署的地址.
  const prod_url = 'https://app.distribution.medcloud.cn/';
  const local_url = 'http://127.0.0.1:9898/';
  let define = {
    'process.env': {},
    'process.env.SERVER_HOST': mode === 'production' ? `"${ prod_url }"` : `"${local_url}"`,
    'process.env.FABU_BASE_URL': mode === 'production' ? `"${ prod_url }"` : `"${ local_url }"`,
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
      manifest: false, // 是否产出manifest.json
      sourcemap: false, // 是否产出sourcemap.json
      outDir: 'dist', // 产出目录
      rollupOptions,
      chunkSizeWarningLimit: 1000,
    },
    esbuild,
    optimizeDeps,
    plugins: [
      vue({
        script: {
          defineModel: true,
        },
        template: {
          compilerOptions: {
            isCustomElement: (tag) => [ 'context-menu', 'context-menu-item' ].includes(tag),
          }
        }
      }),
      vueJsx(),
    ],
    css: {
      preprocessorOptions: {
        less: {
          // 支持内联 JavaScript
          javascriptEnabled: true,
        },
        scss: {
          api: 'modern-compiler' // or "modern"
        }
      }
    },

  };
}
