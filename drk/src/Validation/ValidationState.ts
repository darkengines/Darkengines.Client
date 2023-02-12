import { Dictionary } from 'ts-essentials';

export interface IPropertyValidationState {
	isValid: boolean;
	message?: string;
}
export type IValidationState<TState> = Partial<Dictionary<IPropertyValidationState, keyof TState>>;
export type Validator<TState> = (
	state: TState,
	validationState: IValidationState<TState>
) => IValidationState<TState>;

export function validate<TState>(
	state: TState,
	validationState: IValidationState<TState>,
	...validators: Validator<Partial<TState>>[]
): IValidationState<TState> {
	return validators.reduce((validationState, validator) => {
		return validator(state, validationState);
	}, validationState);
}
export function isValid<TState>(validationState: IValidationState<TState>) {
	return Object.entries(validationState).every(
		([key, propertyValidationState]: [string, IPropertyValidationState]) =>
			propertyValidationState.isValid
	);
}
