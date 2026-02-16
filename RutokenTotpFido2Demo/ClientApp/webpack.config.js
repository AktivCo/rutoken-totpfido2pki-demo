const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
	entry: [
		'/src/index.js',
		'/src/styles/main.scss',
	],
	output: {
		path: path.join(__dirname, '../wwwroot'),
		filename: 'bundle.js'
	},
	resolve: {
		extensions: ['.js', '.jsx'],
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env', '@babel/preset-react'],
					},
				},
			},
			{
				test: /\.(jpg|gif|png|svg)$/,
				type: 'asset/resource'
			},
			{
				test: /.(ttf|otf|eot|woff(2)?)$/,
				type: 'asset/resource'
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader',
				]
			},
			{
				test: /\.scss$/,
				use: [
					'style-loader',
					'css-loader',
					{
						loader: 'sass-loader',
						options: {
							sassOptions: {
								silenceDeprecations: ['if-function', 'color-functions', 'global-builtin', 'import'],
							}
						}
					}
				]
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			hash: true,
			template: './public/index.html',
			favicon: './public/favicon.png'
		}),
		new ESLintPlugin({
			extensions: ['js', 'jsx'],
			fix: true,
		})
	],
};