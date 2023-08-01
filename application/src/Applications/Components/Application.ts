import { css, CSSResultGroup, html, LitElement, PropertyValueMap, svg, unsafeCSS } from 'lit';
import { customElement, property, query, queryAll, state } from 'lit/decorators.js';
import { commonStyles, defaultHeader, form, signInFooter } from '../../Common/Common';
import commonCss from '!raw-loader!../../Common/Common.css';
import {
	mdcButton,
	mdcElevation,
	mdcTextfield,
	mdcTypography,
} from '@drk/src/Styles/Material/index';
import '@material/mwc-icon-button/mwc-icon-button.js';
import { repeat } from 'lit/directives/repeat.js';
import { groupBy } from 'lodash';
import { Dictionary } from 'ts-essentials';
import logo from '../../../assets/images/logo.svg';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import '@material/web/ripple/ripple.js';
import '@material/web/button/text-button';
import '@material/web/textfield/outlined-text-field';
import '@material/web/textfield/filled-text-field';

export interface IApplicationProps {}
declare global {
	interface HTMLElementTagNameMap {
		'drk-application': Application;
	}
}
@customElement('drk-application')
export class Application extends LitElement {
	@property({ type: Object })
	public props: IApplicationProps;
	@query('.mdc-button')
	protected buttons: HTMLElement[];
	@query('.application > header')
	protected header: HTMLHeadElement;
	public static get styles() {
		return [
			commonStyles,
			mdcElevation,
			mdcTextfield,
			mdcTypography,
			mdcButton,
			css`
				:host {
					max-height: 100%;
					height: 100%;
					display: block;
					overflow: auto;
				}
				.application {
					display: grid;
					grid:
						'nav header' min-content
						'nav content' 1fr / auto 1fr;
					align-content: start;
				}
				#navbar {
					display: grid;
					grid-template:
						'header' auto
						'menu' 1fr;
					grid-area: nav;
					height: 100vh;
					position: sticky;
					top: 0;
					color: var(--on-primary-color);
					min-width: 256px;
					z-index: 1;
				}
				#content {
					grid-area: content;
					position: relative;
					max-height: 100%;
					height: 100%;
					min-height: 100%;
				}
				#content main {
				}
				header {
					display: grid;
					grid-area: header;
					position: sticky;
					top: 0;
					grid-template: 'logo title' / auto 1fr;
					gap: var(--content-spacing);
					place-items: start;
					align-items: center;
					justify-items: start;
					z-index: 2;
					padding: calc(var(--content-padding) / 4) var(--content-padding);
					border-bottom: 1px solid var(--border-color);
				}
				.application > header {
					transition: box-shadow 200ms;
				}
				header svg {
					grid-area: logo;
					height: 48px;
				}
				header .title {
					grid-area: title;
				}
				menu {
					grid-area: menu;
					display: grid;
					align-content: start;
					position: sticky;
					top: 0;
					max-height: 100vh;
					background-color: var(--primary-color-dark);
					z-index: 1;
				}
				.menu-item {
					--md-text-button-container-shape: 0px;
				}
				main {
					background-color: var(--surface-background-color);
					height: 100%;
				}
			`,
		];
	}
	protected firstUpdated(
		_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
	): void {
		super.firstUpdated(_changedProperties);
	}
	async connectedCallback(): Promise<void> {
		super.connectedCallback();
		await this.updateComplete;
		this.addEventListener('scroll', (e: Event) => {
			if (this.scrollTop > 0) {
				this.header.classList.add('mdc-elevation--z1');
			} else {
				this.header.classList.remove('mdc-elevation--z1');
			}
		});
	}
	render() {
		return html`<div class="application">
			<div id="navbar">
				<header class="mdc-elevation--z1" surface>
					${svg`${unsafeSVG(logo)}`}
					<div class="title">Application</div>
				</header>
				<menu class="mdc-elevation--z1">
					<slot name="menu-item"></slot>
				</menu>
			</div>
			<header class="surface header">
				${svg`${unsafeSVG(logo)}`}
				<div class="title">Application</div>
			</header>
			<div id="content">
				<main>
					<slot></slot>
				</main>
			</div>
		</div>`;
	}
}
