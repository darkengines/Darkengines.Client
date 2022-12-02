import { customElement, html, property, css } from 'lit-element';
import { ButtonBase } from '@material/mwc-button/mwc-button-base';
import { classMap } from 'lit-html/directives/class-map.js';
import { Button } from '@material/mwc-button';
import '../DarkenginesLoader/DarkenginesLoader';
import { ifDefined } from 'lit/directives/if-defined.js';
import { unsafeCSS } from 'lit';
@customElement('drk-progress-button')
export default class DarkenginesProgressButton extends ButtonBase {
	@property({ type: Boolean })
	public inProgress: boolean;

	public static get styles() {
		return css`
			${unsafeCSS(Button.styles)}
			button {
				width: inherit;
				grid-gap: 8px;
			}
		`;
	}

	render() {
		return html` <button
			id="button"
			class="mdc-button ${classMap(this.getRenderClasses())}"
			?disabled="${this.disabled}"
			aria-label="${this.label || this.icon}"
			aria-haspopup="${ifDefined(this.ariaHasPopup)}"
			@focus="${this.handleRippleFocus}"
			@blur="${this.handleRippleBlur}"
			@mousedown="${this.handleRippleActivate}"
			@mouseenter="${this.handleRippleMouseEnter}"
			@mouseleave="${this.handleRippleMouseLeave}"
			@touchstart="${this.handleRippleActivate}"
			@touchend="${this.handleRippleDeactivate}"
			@touchcancel="${this.handleRippleDeactivate}"
		>
			${this.renderOverlay()} ${this.renderRipple()}
			<span class="leading-icon">
				<slot name="icon">
					${this.icon && !this.trailingIcon ? this.renderIcon() : ''}
				</slot>
			</span>
			<span class="mdc-button__label">${this.label}</span>
			<span
				class="slot-container ${classMap({
					flex: this.expandContent,
				})}"
			>
				<slot></slot>
			</span>
			<span class="trailing-icon">
				<slot name="trailingIcon">
					${this.icon && this.trailingIcon ? this.renderIcon() : ''}
				</slot>
			</span>
		</button>`;
	}
}
