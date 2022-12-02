const path = require('path');
const fs = require('fs');

function Package(options) {
	this.options = options;
}

Package.prototype.apply = function (compiler) {
	compiler.hooks.beforeRun.tap(Package.name, (compilation) => {
		const package = JSON.parse(fs.readFileSync(this.options.packagePath, 'utf8'));
		const result = this.options.process(package);
		fs.writeFileSync(this.options.packagePath, JSON.stringify(result, null, 4), 'utf8');
	});
};

module.exports = Package;
