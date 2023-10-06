import { LitElement, css, html, nothing, svg } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import '@material/mwc-icon/mwc-icon';
import oval from './oval.svg';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { Button } from '@material/web/button/internal/button';

declare global {
	interface HTMLElementTagNameMap {
		'drk-button': DarkenginesButton;
	}
}
@customElement('drk-button')
export class DarkenginesButton extends LitElement {
	@query('#component')
	component: Button;
	@property({ type: Boolean })
	public hasLoader: boolean;
	@property({ type: Boolean })
	public set isLoading(isLoading: boolean) {
		this.component.disabled = this._isLoading = isLoading;
	}
	public get isLoading() {
		return this._isLoading;
	}
	@state()
	protected _isLoading: boolean;
	public static get styles() {
		return [
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
		return html` <md-outlined-button id="component" trailing-icon>
			<slot></slot>
			<slot name="icon"></slot>
			${this.renderLoadingIcon()}
		</md-outlined-button>`;
	}
	protected renderLoadingIcon() {
		if (this._isLoading || this.hasLoader) {
			return html`<span class="trailing-icon loading-icon">
				${this._isLoading
					? html`<slot name="icon"> ${svg`${unsafeSVG(oval)}`} </slot>`
					: nothing}
			</span>`;
		}
		return nothing;
	}
}
