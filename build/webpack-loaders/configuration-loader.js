const loaderUtils = require('loader-utils');
const path = require('path');
const lodash = require('lodash');

const configurationExtension = '.config.json';

module.exports = function (source) {
	const options = loaderUtils.getOptions(this);
	const configurationFilePath = this.resourcePath;
	const environmentConfigurationFilePath = options.environmentName ? changeExtension(
		configurationFilePath,
		`.${changeExtension(options.environmentName, configurationExtension)}`
	) : configurationFilePath;
	const configuration = JSON.parse(source);
	const environmentConfiguration = require(environmentConfigurationFilePath);
	const mergedConfiguration = lodash.merge(configuration, environmentConfiguration);
	return JSON.stringify(mergedConfiguration);
};

function changeExtension(file, extension) {
	const basename = path.basename(file, configurationExtension);
	return path.join(path.dirname(file), basename + extension);
}
