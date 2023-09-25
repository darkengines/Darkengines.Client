import { css, CSSResultGroup, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

declare global {
	interface HTMLElementTagNameMap {
		'drk-models': Models;
	}
}

@customElement('drk-model-menu')
export class Models extends LitElement {
	public static get styles(): CSSResultGroup {
		return [
			css`
				:host {
					display: block;
					height: 100%;
				}
				#models {
					display: grid;
					grid: 'nav content' 1fr / auto 1fr;
					align-content: start;
					height: 100%;
				}
				#navigation {
					display: grid;
					grid-area: nav;
					color: var(--on-primary-color);
					justify-content: start;
					background: var(--primary-color-dark);
					height: 100%;
					position: sticky;
					top: 0;
					align-content: start;
				}
				#content {
					grid-area: content;
					height: 100%;
				}
			`,
		];
	}
	render() {
		return html`<div id="models">
			<div id="navigation">
				<slot name="menu-item"></slot>
			</div>
			<div id="content">
				<slot></slot>
			</div>
		</div>`;
	}
}
