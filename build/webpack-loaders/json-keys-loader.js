const { stubString } = require('lodash');

module.exports = function (source) {
	const root = this.rootContext.replace(/\\/g, '/');
	let path = this.resourcePath.replace(/\\/g, '/');
	path = path.substr(root.length + 1);
	const regex = /(?<path>.*?)\.(?<language>.*?)\.i18n\.json/gm;
	const matches = regex.exec(path);
	const language = matches.groups.language;
	path = matches.groups.path;

	const json = JSON.parse(source);
	const keys = Object.keys(json).reduce(
		(previous, current) => ({ ...previous, [current]: `${path}.${current}` }),
		{}
	);

	return `${JSON.stringify(keys)}`;
};
