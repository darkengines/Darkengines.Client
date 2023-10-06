import { format } from 'date-fns';
import { css, html, LitElement, nothing, PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { darkenginesTextfieldStyles } from './DarkenginesTextField.Styles';
import { spread } from '@open-wc/lit-helpers';
import {
	TextFieldType,
	TextField,
	UnsupportedTextFieldType
} from '@material/web/textfield/internal/text-field';

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
declare global {
	interface HTMLElementTagNameMap {
		'drk-textfield': DarkenginesTextfield;
	}
}
@customElement('drk-textfield')
export class DarkenginesTextfield extends LitElement {
	@property({ type: String })
	public set value(v: string) {
		this.updateComplete.then((_) => {
			this.editor.value = v;
		});
	}
	public get value(): string {
		return this.editor?.value;
	}
	@property({ type: String })
	public set title(value: string) {
		this.updateComplete.then((_) => {
			this.editor.title = value;
		});
	}
	public get title(): string {
		return this.editor?.title;
	}
	@property({ type: String })
	public set label(value: string) {
		this.updateComplete.then((_) => {
			this.editor.label = value;
		});
	}
	public get label(): string {
		return this.editor?.label;
	}
	@property({ type: String })
	public set type(value: TextFieldType | UnsupportedTextFieldType) {
		this.updateComplete.then((_) => {
			this.editor.type = value;
		});
	}
	public get type(): TextFieldType | UnsupportedTextFieldType {
		return this.editor?.type;
	}
	@property({ type: String })
	public set errorMessage(value: string) {
		this.updateComplete.then((_) => {
			this.editor.error = !!value;
			this.editor.errorText = value;
			this.requestUpdate('errorMessage');
		});
	}
	public get errorMessage(): string {
		return this.editor?.errorText;
	}
	@property({ type: Object })
	get validity(): ValidityState {
		return this.editor?.validity;
	}
	@property({ type: String })
	get validationMessage(): string {
		return this.editor?.validationMessage;
	}
	@property({ type: Boolean })
	get willValidate(): boolean {
		return this.editor?.willValidate;
	}
	setCustomValidity(message?: string) {
		this.updateComplete.then((_) => this.editor.setCustomValidity(message));
	}
	checkValidity(): boolean {
		return this.editor?.checkValidity();
	}
	reportValidity(): boolean {
		return this.editor?.reportValidity();
	}
	@property({ type: Boolean })
	public padding: boolean;

	public static formatDate(value: string | Date): string {
		if (typeof value == 'string') value = new Date(value);
		if (value instanceof Date) {
			if (isNaN(value.getTime())) {
				(value as Date | undefined) = undefined;
			} else {
				value = format(value as Date, "yyyy-MM-dd'T'HH:mm");
			}
		}
		return value as string;
	}
	public static get styles() {
		return [
			darkenginesTextfieldStyles,
			css`
				::-webkit-calendar-picker-indicator {
					display: block !important;
				}
				:host {
					display: inline-block;
				}
				#Editor {
					width: 100%;
				}
				#helper-text {
					white-space: nowrap;
				}
				#placeholder {
					height: 20px;
				}
			`,
		];
	}
	public get valueAsDate(): Date | undefined {
		let date: Date | undefined = undefined;
		if (this.value && this.value.length) {
			date = new Date(this.value);
			if (isNaN(date.getTime())) date = undefined;
		}
		return date;
	}
	@property({ attribute: false })
	public set valueAsDate(value: Date | string | undefined) {
		if (typeof value == 'string') value = new Date(value);
		if (value instanceof Date) {
			if (isNaN(value.getTime())) value = '';
			this.updateComplete.then(
				() => (this.value = format(value as Date, "yyyy-MM-dd'T'HH:mm"))
			);
		}
	}
	@query('#Editor')
	protected editor: TextField;
	update(changedProperties: PropertyValues) {
		if (changedProperties.has('errorMessage')) {
			if (this.editor) {
				this.editor.setCustomValidity(this.errorMessage);
			} else {
				this.updateComplete.then((updated) => {
					if (updated) {
						this.editor.setCustomValidity(this.errorMessage);
					}
				});
			}
		}
		super.update(changedProperties);
	}

	protected onInput(e: InputEvent) {
		this.dispatchEvent(new InputEvent(e.type, e));
	}

	protected onChange(e: InputEvent) {
		this.dispatchEvent(new InputEvent(e.type, e));
	}

	protected onError(detail: any) {
		this.dispatchEvent(new CustomEvent('error', { detail }));
	}

	render() {
		return html`<md-outlined-text-field
				id="Editor"
				part="editor"
				@input=${this.onInput}
				@change=${this.onChange}
			></md-outlined-text-field>
			${this.renderPlaceholder()}`;
	}

	protected renderPlaceholder() {
		if (!this.padding || this.errorMessage) return nothing;
		return html`<div id="placeholder"></div>`;
	}
}
