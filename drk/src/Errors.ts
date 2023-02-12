import { msg } from '@lit/localize';

export function getUnhandledErrorMessage() {
	return msg('An unhandled error occured');
}

export function getUnhandledErrorRetryMessage() {
	return msg('Retry');
}
