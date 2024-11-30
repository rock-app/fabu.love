/* eslint-disable */
import * as path from 'path';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx'
// import { loadEnv } from 'vite';

export default ({ command, mode }) => {
  let rollupOptions = {};

  let optimizeDeps = {};

  let alias = {
    '@': path.resolve(__dirname, './src'),
    'Components': path.resolve(__dirname, './src/components'),
  };

  let proxy = {
    '/api': {
      target: 'http://localhost:9898',
      changeOrigin: true,
      // rewrite: (path) => path.replace(/^\/api/, ''),
    },
    '/upload': {
      target: 'http://localhost:9898',
      changeOrigin: true,
    }
  };

  // const env = loadEnv(mode, process.cwd(), '')

  // let define = {
  //   'process.env': {},
  //   'process.env.FABU_BASE_URL': `"${ env.VITE_BASE_URL }"`,
  // };

  let esbuild = {};

  return {
    // base: env.VITE_BASE_URL, // index.html文件所在位置
    root: './', // js导入的资源路径，src
    resolve: {
      alias,
    },
    // define: define,
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
