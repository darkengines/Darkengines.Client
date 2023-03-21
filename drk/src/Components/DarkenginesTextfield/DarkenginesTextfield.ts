import { TextField } from '@material/mwc-textfield';
import { format } from 'date-fns';
import { css, html, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { darkenginesTextfieldStyles } from './DarkenginesTextField.Styles';

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
export class DarkenginesTextfield extends TextField {
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
			...TextField.styles,
			darkenginesTextfieldStyles,
			css`
				::-webkit-calendar-picker-indicator {
					display: block !important;
				}
				#helper-text {
					white-space: nowrap;
				}
			`,
		];
	}
	protected setValidationMessage(validationMessage?: string) {
		this.setCustomValidity(validationMessage ?? '');
		this.reportValidity();
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

	update(changedProperties: PropertyValues) {
		if (changedProperties.has('validationMessage')) {
			if (this.formElement) {
				this.setValidationMessage(this.validationMessage);
			} else {
				this.updateComplete.then((updated) => {
					if (updated) {
						this.setValidationMessage(this.validationMessage);
					}
				});
			}
		}
		super.update(changedProperties);
	}

	protected getRootAdapterMethods() {
		return {
			registerTextFieldInteractionHandler: (evtType: any, handler: any) =>
				this.addEventListener(evtType, handler),
			deregisterTextFieldInteractionHandler: (evtType: any, handler: any) =>
				this.removeEventListener(evtType, handler),
			registerValidationAttributeChangeHandler: (handler: any) => {
				const getAttributesList = (mutationsList: MutationRecord[]): string[] => {
					return mutationsList
						.map((mutation) => mutation.attributeName)
						.filter((attributeName) => attributeName) as string[];
				};
				const observer = new MutationObserver((mutationsList) => {
					handler(getAttributesList(mutationsList));
				});
				const config = { attributes: true };
				observer.observe(this.formElement, config);
				return observer;
			},
			deregisterValidationAttributeChangeHandler: (observer: MutationObserver) =>
				observer.disconnect(),
			...addHasRemoveClass(this.mdcRoot),
		};
	}

	render() {
		const shouldRenderCharCounter = this.charCounter && this.maxLength !== -1;
		const shouldRenderHelperText =
			this.helperPersistent ||
			!!this.helper ||
			!!this.validationMessage ||
			shouldRenderCharCounter;
		/** @classMap */
		const classes = {
			'mdc-text-field--disabled': this.disabled,
			'mdc-text-field--no-label': !this.label,
			'mdc-text-field--filled': !this.outlined,
			'mdc-text-field--outlined': this.outlined,
			'mdc-text-field--with-leading-icon': this.icon,
			'mdc-text-field--with-trailing-icon': this.iconTrailing,
			'mdc-text-field--end-aligned': this.endAligned,
			'drk-text-field--invalid':
				this.validationMessage && this.validationMessage.length,
		};
		return html`
			<label class="mdc-text-field ${classMap(classes)}">
				${this.renderRipple()} ${this.outlined ? this.renderOutline() : this.renderLabel()}
				${this.renderLeadingIcon()} ${this.renderPrefix()}
				${this.renderInput(shouldRenderHelperText)} ${this.renderSuffix()}
				${this.renderTrailingIcon()} ${this.renderLineRipple()}
			</label>
			${this.renderHelperText(shouldRenderHelperText, shouldRenderCharCounter)}
		`;
	}
}
