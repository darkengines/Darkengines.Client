import '@material/mwc-notched-outline/mwc-notched-outline';
import { format } from 'date-fns';
import { html, LitElement, nothing, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import './DarkenginesLightTextfield.css';
import '@material/textfield/dist/mdc.textfield.css';
import { TextFieldType } from '@material/mwc-textfield';
import { classMap } from 'lit/directives/class-map.js';

export function addHasRemoveClass(element: HTMLElement) {
	return {
		addClass: (className: string) => {
			element.classList.add(className);
		},
		removeClass: (className: string) => {
			element.classList.remove(className);
		},
		hasClass: (className: string) => element.classList.contains(className),
	};
}
@customElement('drk-light-textfield')
export class DarkenginesLightTextfield extends LitElement {
	@property({ type: String })
	public label: string;
	@property({ type: String })
	public placeholder: string;
	@property({ type: String })
	public name: string;
	@property({ type: String })
	public value: string;
	@property({ type: String })
	public helper: string;
	@property({ type: String })
	public validationMessage: string;
	@property({ type: String })
	public type: TextFieldType;
	@property({ type: String })
	public helperText: any;
	@property({ type: Boolean })
	public isValid: boolean = true;

	protected createRenderRoot(): Element | ShadowRoot {
		return this;
	}
	public static formatDate(value: string | Date): string {
		if (typeof value == 'string') value = new Date(value);
		if (value instanceof Date) {
			if (isNaN(value.getTime())) {
				value = undefined;
			} else {
				value = format(value as Date, "yyyy-MM-dd'T'HH:mm");
			}
		}
		return value as string;
	}
	public get valueAsDate(): Date {
		let date: Date = undefined;
		if (this.value && this.value.length) {
			date = new Date(this.value);
			if (isNaN(date.getTime())) date = undefined;
		}
		return date;
	}
	@property({ attribute: false })
	public set valueAsDate(value: Date | string) {
		if (typeof value == 'string') value = new Date(value);
		if (value instanceof Date) {
			if (isNaN(value.getTime())) value = '';
			this.updateComplete.then(
				() => (this.value = format(value as Date, "yyyy-MM-dd'T'HH:mm"))
			);
		}
	}
	async connectedCallback(): Promise<void> {
		super.connectedCallback();
	}
	update(changedProperties: PropertyValues) {
		super.update(changedProperties);
	}
	render() {
		return html` <label
			class="drk-textfield ${classMap({
				error: this.isValid === false,
			})}"
		>
			${this.renderLabel()}
			<input
				class="darkng-input mdc-typography--body1"
				type=${this.type}
				placeholder=${this.placeholder}
				name=${this.name}
				.value=${live(this.value ?? '')}
				@change=${(e: Event) => {
					const input = e.currentTarget as HTMLInputElement;
					this.value = input.value;
				}}
			/>
			${this.renderHelper()}</label
		>`;
	}
	renderLabel() {
		if (!this.label || !this.label.trim().length) return nothing;
		return html`<span class="drk-label mdc-typography--subtitle1">${this.label}</span>`;
	}
	renderHelper() {
		if (
			this.isValid !== undefined &&
			this.isValid !== null &&
			!this.isValid &&
			this.validationMessage &&
			this.validationMessage.trim().length
		) {
			return html`<span class="drk-error mdc-typography--caption"
				>${this.validationMessage}</span
			>`;
		}
		if (this.helperText) {
			return html`<span class="drk-helper mdc-typography--caption"
					>${this.helperText}</span
				>`;
		}
		return nothing;
	}
}
