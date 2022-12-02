export interface IValidatable {
	formNoValidate?: boolean;
	required?: boolean;
	readonly validity: ValidityState;
	readonly validationMessage?: string;
	readonly willValidate: boolean;
	setCustomValidity(message?: string): void;
	checkValidity(): boolean;
	reportValidity(): boolean;
}

export function isValidatable(element: any): element is IValidatable {
	return element && element.setCustomValidity && element.checkValidity && element.reportValidity;
}
