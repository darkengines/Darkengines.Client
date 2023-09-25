import { msg } from '@lit/localize';
import { IPropertyValidationState, IValidationState } from '@drk/src/Validation/ValidationState';

const emailAddressRegex =
	/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
export function getInvalidEmailAddressMessage() {
	return msg('Please provide a valid email address.', { id: 'signup.email.invalid' });
}
export function validateEmailAddress<TState extends { emailAddress: string }>(
	state: TState,
	validationState: IValidationState<TState>
): IValidationState<TState> {
	let result = { isValid: true, message: undefined };
	result.isValid = state.emailAddress.match(emailAddressRegex) != null;
	if (!result.isValid) result.message = getInvalidEmailAddressMessage();
	return { ...validationState, emailAddress: result };
}

const loginRegex = /^[\w, \s]{3,64}$/;
export function getTooShortLoginMessage() {
	return msg('Must be at least 3 characters.', { id: 'signup.login.tooShort' });
}
export function getTooLongLoginMessage() {
	return msg('Must be lower than 64 characters.', { id: 'signup.login.tooLong' });
}
export function getInvalidLoginMessage() {
	return msg('The login contains invalid characters.', { id: 'signup.login.invalid' });
}
export function validateLogin<TState extends { login: string }>(
	state: TState,
	validationState: IValidationState<TState>
): IValidationState<TState> {
	if (!state.login) state.login = '';
	const isTooShort = state.login.trim().length < 3;
	const isTooLong = state.login.trim().length > 64;
	const isInvalid = !state.login.match(loginRegex);
	let message = undefined;
	let isValid = true;

	isValid = !(isTooShort || isTooLong || isInvalid);
	if (isTooShort) {
		message = getTooShortLoginMessage();
	} else if (isTooLong) {
		message = getTooLongLoginMessage();
	} else if (isInvalid) {
		message = getInvalidLoginMessage();
	}

	return {
		...validationState,
		login: {
			isValid,
			message,
		},
	};
}
