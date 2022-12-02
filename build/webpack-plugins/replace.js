const path = require('path');
const fs = require('fs');

function Replace(options) {
	this.options = options;
}

Replace.prototype.apply = function (compiler) {
	compiler.hooks.beforeRun.tap(Replace.name, (compilation) => {
		const template = fs.readFileSync(this.options.templatePath, 'utf8');
		const result = template.replace(/{(.*?)}/g, (g, m) =>
			m.split('.').reduce((p, c) => (p && p[c]) || null, this.options.context)
		);
		fs.writeFileSync(this.options.configFilePath, result, 'utf8');
	});
};

module.exports = Replace;
