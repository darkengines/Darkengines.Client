let setConfig: (config: any) => void;
let config: Promise<any> = new Promise((resolve, reject) => {
	setConfig = (config) => {
		resolve({
			Api: config.Api,
			Router: config.Router,
			Localization: config.Localization,
		});
	};
});

export { setConfig };

export async function getConfig() {
	return config;
}
