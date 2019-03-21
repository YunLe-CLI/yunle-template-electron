import { join } from 'path';

const cwd = process.cwd();

export default function (webpackConfig, { webpack }) {
  webpackConfig.entry = {
    main: './src/main/index.js',
  };
  webpackConfig.output.path = join(cwd, './app/dist/main');
  webpackConfig.target = 'electron';
  webpackConfig.externals = (context, request, callback) => {
    if (request.charAt(0) === '.' || request.indexOf('@babel') > -1) {
      callback(null, false)
    } else {
      callback(null, `require("${request}")`);
    }
  };
  webpackConfig.plugins.push(
      new webpack.DefinePlugin({
        $dirname: '__dirname',
      }),
  );
  return webpackConfig;
};
