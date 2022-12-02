import { Button } from '@material/mwc-button';
import { css, html, nothing, svg } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import '@material/mwc-icon/mwc-icon';
import oval from '../../Theme/Medias/oval.svg';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

@customElement('drk-button')
export class DarkenginesButton extends Button {
	@property({ type: Boolean })
	public hasLoader: boolean;
	@property({ type: Boolean })
	public set isLoading(isLoading: boolean) {
		this.disabled = this._isLoading = isLoading;
	}
	public get isLoading() {
		return this._isLoading;
	}
	@state()
	protected _isLoading: boolean;
	public static get styles() {
		return [
			...Button.styles,
			css`
				.loading-icon {
					padding: 0 calc(var(--content-spacing) / 2);
					line-height: 16px;
					width: 16px;
					height: 16px;
				}
				.loading-icon svg {
					width: 16px;
					height: 16px;
				}
			`,
		];
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
			${this.renderLoadingIcon()}
		</button>`;
	}
	protected renderLoadingIcon() {
		if (this._isLoading || this.hasLoader) {
			return html`<span class="trailing-icon loading-icon">
				${this._isLoading
					? html`<slot name="loadingIcon"> ${svg`${unsafeSVG(oval)}`} </slot>`
					: nothing}
			</span>`;
		}
		return nothing;
	}
}
