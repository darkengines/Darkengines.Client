const path = require('path');
const fs = require('fs');
const glob = require('glob');
const Compilation = require('webpack').Compilation;
const sources = require('webpack').sources;

function LocalizationPlugin(options) {
	this.options = options;
}

LocalizationPlugin.prototype.apply = function (compiler) {
	compiler.hooks.thisCompilation.tap(LocalizationPlugin.name, (compilation) => {
		compilation.hooks.processAssets.tapPromise({
            name: LocalizationPlugin.name,
            // https://github.com/webpack/webpack/blob/master/lib/Compilation.js#L3280
            stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
          },
          () => {
			return new Promise((resolve, reject) => {
				glob('src/**/*.i18n.json', (e, files) => {
					const result = files.reduce((resources, file) => {
						const regex = /(?<path>.*?)\.(?<language>.*?)\.i18n\.json/gm;
						const matches = regex.exec(file);
						const language = matches.groups.language;
						const path = matches.groups.path;
						const content = fs.readFileSync(file, { encoding: 'utf-8' });
						let json = JSON.parse(content);
		
						const result = {
							...resources,
							[language]: {
								...(resources[language] || {}),
								[path]: json,
							},
						};
						return result;
					}, {});
					Object.keys(result).forEach((languageCode) => {
						const jsonResult = JSON.stringify(result[languageCode]);
						compilation.emitAsset(`./assets/locales/resources.${languageCode}.json`, new sources.RawSource(jsonResult))
					});
					resolve();
				});
			});
          }
        );
		
	});
};

module.exports = LocalizationPlugin;
