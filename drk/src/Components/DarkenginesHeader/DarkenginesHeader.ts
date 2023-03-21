import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { mdcElevation, mdcTypography } from '../../Styles/Material';

declare global {
	interface HTMLElementTagNameMap {
		'drk-header': DarkenginesHeader;
	}
}
@customElement('drk-header')
export class DarkenginesHeader extends LitElement {
@property({ type: Boolean })
	public compact: boolean;

	public static get styles() {
		return [
			mdcElevation,
			mdcTypography,
			css`
				:host {
					display: block;
				}
				header {
					display: grid;
					grid-auto-flow: column;
					text-align: center;
					background-color: var(--primary-color);
					color: var(--on-primary-color);
					height: auto;
					justify-content: start;
					align-items: center;
					padding: calc(var(--content-spacing) / 2) var(--content-spacing);
					z-index: 3;
				}
				header.compact {
					max-width: var(--content-max-width);
				}
			`,
		];
	}
	render() {
		return html`<header
			class="mdc-elevation--z4 mdc-typography--headline3 ${classMap({
				compact: this.compact,
			})}"
		>
			<slot></slot>
		</header>`;
	}
}
