 // You can delete this file if you're not using it
exports.modifyBabelrc = ({ babelrc }) => {
	return {
		...babelrc,
		plugins: babelrc.plugins.concat([
			["import", { libraryName: "antd", style: "css" }],
			'transform-decorators-legacy',
			'transform-regenerator',
		]),
	}
};

exports.modifyWebpackConfig = ({ config, stage }) => {
	return config
};
