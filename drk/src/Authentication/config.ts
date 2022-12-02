import { getConfig as getParentConfig } from '../config';

export async function getConfig() {
	const config = await getParentConfig();
	return {};
}
