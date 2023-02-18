const fs = require('fs');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const _ = require('lodash');
const Package = require('../build/webpack-plugins/package');
const Replace = require('../build/webpack-plugins/replace');
const LocalizationPlugin = require('../build/webpack-plugins/localizationPlugin');

const smp = new SpeedMeasurePlugin();
module.exports = function (env) {
	var appSettings = require('./config/appsettings.config.json');
	let environmentName = appSettings.Environment;
	if (env.env) environmentName = env.env;
	console.log(`Environment=${environmentName}`);
	const environmentAppSettingsPath = `./config/appsettings.${environmentName}.config.json`;
	if (fs.existsSync(environmentAppSettingsPath)) {
		console.log(`Loading ${environmentAppSettingsPath}`);
		const environmentAppSettings = require(environmentAppSettingsPath);
		appSettings = _.merge(appSettings, environmentAppSettings);
	}
	console.log(appSettings);
	return smp.wrap({
		mode: 'development',
		entry: { application: './src/index.ts' },
		devtool: 'eval-source-map',
		resolve: {
			extensions: ['.ts', '.js'],
			plugins: [new TsconfigPathsPlugin()],
		},
		optimization: {
			sideEffects: false,
			minimize: true,
			concatenateModules: false,
		},
		output: {
			filename: '[name].js',
			path: path.resolve(__dirname, 'dist/'),
			publicPath: '/',
			clean: true,
		},
		module: {
			rules: [
				{
					test: /\.html$/i,
					loader: 'html-loader',
				},
				{
					test: /\.tsx?$/,
					use: [
						{
							loader: 'ts-loader',
							options: {
								projectReferences: true,
							},
						},
					],
					exclude: [/node_modules/],
				},
				{
					test: /\.css$/,
					use: [
						'style-loader',
						{
							loader: 'css-loader',
						},
					],
				},
				{
					test: /\.svg$/,
					loader: 'svg-inline-loader',
				},
				{
					test: /\.(jpg|png|gif|ico)$/,
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						outputPath: 'assets/images',
					},
				},
				{
					test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
					include: [path.resolve(__dirname, 'src', 'Theme', 'Fonts')],
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						outputPath: 'assets/fonts',
					},
				},
				{
					test: /\.pem$/i,
					use: 'raw-loader',
				},
				{
					test: /\.(config.json)$/i,
					use: {
						loader: path.resolve('../build/webpack-loaders/configuration-loader.js'),
						options: {
							environmentName,
						},
					},
				},
			],
		},
		plugins: [
			new HtmlWebpackPlugin({
				inject: 'head',
				inject: true,
				filename: 'index.html',
				template: './src/index.html',
				templateParameters: { appSettings },
			}),
		],
		devServer: {
			port: 8080,
			historyApiFallback: true,
			allowedHosts: 'all',
			client: {
				overlay: {
					warnings: false,
					errors: true,
				},
			},
		},
		ignoreWarnings: [/Failed to parse source map/],
	});
};
