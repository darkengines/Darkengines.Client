import '@material/mwc-notched-outline/mwc-notched-outline';
import { css, html, LitElement, PropertyValues, unsafeCSS } from 'lit';
import { TextField } from '@material/mwc-textfield';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

@customElement('drk-notched-outlined')
export default class DarkenginesNotchedOutlined extends LitElement {
	@property({ type: Boolean })
	public hasFocus: boolean = false;
	@property({ type: String })
	public label: string;
	@property({ type: Number })
	public labelWidth: number;
	@property({ type: Boolean })
	public invalid: boolean = false;
	@property({ type: String })
	public validationMessage: string;
	@property({ type: Boolean })
	public helperPersistent: boolean;

	updated(_changedProperties: PropertyValues) {
		super.updated(_changedProperties);
	}
	public static get styles() {
		return css`
			${unsafeCSS(TextField.styles)}
			::slotted(*) {
				padding-top: max(8px, var(--mdc-shape-small, 4px));
				box-sizing: border-box;
				position: relative;
			}
			.mdc-text-field--outlined {
				padding: 0;
			}
			.mdc-text-field-helper-text--validation-msg {
				opacity: 1;
				color: var(--mdc-theme-error, #b00020);
			}
		`;
	}

	render() {
		return html`
			<div
				@focusin=${(e) => (this.hasFocus = true)}
				@focusout=${(e) => (this.hasFocus = false)}
				class="mdc-text-field ${classMap({
					'mdc-text-field--focused': this.hasFocus,
					'mdc-text-field--invalid':
						this.validationMessage && this.validationMessage.length,
				})} mdc-text-field--outlined mdc-text-field--label-floating"
				style="height:auto"
			>
				<mwc-notched-outline
					part="mwc-notched-outline"
					class="mdc-notched-outline"
					.width=${this.labelWidth}
					.open=${this.labelWidth != 0}
				>
					<span
						style="top:0;font-size: 0.75rem;"
						class="mdc-floating-label ${classMap({
							//'mdc-floating-label--required': this.required,
						})} "
						>${this.label}</span
					>
				</mwc-notched-outline>
				<slot></slot>
			</div>
			<div
				class="mdc-text-field-helper-line mdc-text-field-helper-text mdc-text-field-helper-text--validation-msg"
			>
				${this.validationMessage}
			</div>
		`;
	}
}
