import path, { join } from 'path';
import slash from 'slash';

export default {
  mountElementId: 'container',
  history: 'browser',
  publicPath: './',
  outputPath: '../../app/dist/renderer',
  plugins: [
    [
      'umi-plugin-react',
      {
        dva: {
          immer: true
        },
        antd: true,
        routes: {
          exclude: [
            /model\.(j|t)sx?$/,
            /service\.(j|t)sx?$/,
            /models\//,
            /components\//,
            /services\//,
            /utils\//,
          ],
        },
      }
    ],
  ],
  alias:{
    components: path.resolve(__dirname,'src/components'),
    utils: path.resolve(__dirname,'src/utils'),
    services: path.resolve(__dirname,'src/services'),
    models: path.resolve(__dirname,'src/models'),
  },
  externals(context, request, callback) {
    const isDev = process.env.NODE_ENV === 'development';
    let isExternal = false;
    const load = [
      'electron',
      'fs',
      'path',
      'os',
      'url',
      'child_process'
    ];
    if (load.includes(request)) {
      isExternal = `require("${request}")`;
    }
    const appDeps = Object.keys(require('../../app/package').dependencies);
    if (appDeps.includes(request)) {
      const orininalPath = slash(join(__dirname, '../../app/node_modules', request));
      const requireAbsolute = `require('${orininalPath}')`;
      isExternal = isDev ? requireAbsolute : `require('${request}')`;
    }
    callback(null, isExternal);
  },
};
