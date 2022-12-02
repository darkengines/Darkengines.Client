import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@material/mwc-icon-button/mwc-icon-button';

@customElement('drk-chip')
export class DarkenginesChip extends LitElement {
	public static get styles() {
		return [
			css`
				:host {
					display: inline-grid;
					align-items: center;
					justify-content: start;
					background-color: var(--primary-color);
					color: var(--on-primary-color);
					border-radius: var(--border-radius);
					grid-gap: calc(var(--content-spacing) / 2);
					padding: calc(var(--content-padding) / 2) var(--content-padding);
					grid-auto-flow: column;
				}
				#closeButton {
					--mdc-icon-size: 16px;
					--mdc-icon-button-size: 24px;
				}
			`,
		];
	}
	render() {
		return html`
			<div id="content"><slot></slot></div>
			<mwc-icon-button
				id="closeButton"
				icon="close"
				@click=${(e: MouseEvent) => this.dispatchEvent(new CustomEvent('close'))}
			></mwc-icon-button>
		`;
	}
}
