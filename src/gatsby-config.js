module.exports = {
	siteMetadata: {
		title: 'YunLe.AI',
	},
	plugins: [
		'gatsby-plugin-react-helmet',
		{
			resolve: 'gatsby-plugin-antd',
			options: {
				style: false
			}
		},
		{
			resolve: `gatsby-plugin-react-css-modules`,
			options: {
				filetypes: {
					".less": { syntax: `postcss-less` },
				},
				exclude: `\/global\/`,
			},
		},
		`gatsby-plugin-less`,
	],
};