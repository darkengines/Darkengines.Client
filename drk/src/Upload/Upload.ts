import IUploadMessage from './IUploadMessage';
import { getConfig } from './config';
import { authentication } from '../Authentication/Authentication';

export async function upload(type: string, file: Blob): Promise<string> {
	return new Promise(async (resolve, reject) => {
		const token = authentication.state.idToken;
		const config = await getConfig();
		if (token) {
			const socket = new WebSocket(
				`${config.webSocketSchema}://${config.host}/upload?idToken=${token}&type=${type}`
			);
			socket.onopen = (e) => {
				socket.send(file);
			};
			socket.onmessage = (e) => {
				const result = JSON.parse(e.data) as IUploadMessage;
				const uri = result.content.uri;
				resolve(uri);
			};
		} else {
			reject('No jwt provided');
		}
	});
}
