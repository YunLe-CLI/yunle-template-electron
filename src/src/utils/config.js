const version = require('../../package.json').version;
const env = process.env.NODE_ENV;
const config = { // eslint-disable-line
	version: version || '未知',  // eslint-disable-line
	apiUrl: '/',
};
if (env === 'development') {  // eslint-disable-line
	config.apiUrl = '/';
}
console.log(env); // eslint-disable-line
console.log(version);  // eslint-disable-line

export default config;
